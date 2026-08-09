#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaults = {
  input: path.join(root, ".local/private-registry/overlay.json"),
  normalized: path.join(root, ".local/private-registry/normalized.json"),
  projection: path.join(root, ".local/private-registry/public-projection.json")
};
const privateOutputBoundary = path.join(root, ".local/private-registry");

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? path.resolve(process.argv[index + 1]) : fallback;
}

function fail(message) {
  console.error(`INVALID private overlay: ${message}`);
  process.exit(2);
}

async function readJson(file) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (error) { fail(`${file}: ${error.message}`); }
}

async function registryIndex() {
  const directories = ["works", "releases", "assemblies", "source-inventories", "snapshots", "decisions", "events"];
  const records = new Map();
  for (const directory of directories) {
    const base = path.join(root, "registry", directory);
    for (const name of (await readdir(base)).filter((entry) => entry.endsWith(".json")).sort()) {
      const record = await readJson(path.join(base, name));
      records.set(record.id, record);
    }
  }
  return records;
}

async function main() {
const input = argument("input", defaults.input);
const normalizedFile = argument("normalized", defaults.normalized);
const projectionFile = argument("projection", defaults.projection);
const allowTestOutput = process.argv.includes("--allow-test-output");
if (!allowTestOutput) {
  for (const [label, file] of [["normalized", normalizedFile], ["projection", projectionFile]]) {
    if (!file.startsWith(`${privateOutputBoundary}${path.sep}`)) fail(`${label} output must remain under the ignored .local/private-registry boundary`);
  }
}
const overlay = await readJson(input);
if (overlay?.schema_version !== "1.0.0" || overlay?.record_type !== "private_source_overlay") fail("unsupported schema_version or record_type");
if (!Array.isArray(overlay.entries) || overlay.entries.length === 0) fail("entries must be a non-empty array");
const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(overlay.observed_at ?? "");
const parsedDate = dateMatch ? new Date(Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3]))) : null;
if (!dateMatch || parsedDate.getUTCFullYear() !== Number(dateMatch[1]) || parsedDate.getUTCMonth() !== Number(dateMatch[2]) - 1 || parsedDate.getUTCDate() !== Number(dateMatch[3])) fail("observed_at must be a real YYYY-MM-DD date");
const overlayKeys = new Set(["schema_version", "record_type", "inventory_id", "observed_at", "entries"]);
for (const key of Object.keys(overlay)) if (!overlayKeys.has(key)) fail(`unexpected overlay property: ${key}`);

const records = await registryIndex();
const inventory = records.get(overlay.inventory_id);
if (inventory?.record_type !== "source_inventory") fail(`inventory_id does not resolve to a Source Inventory: ${overlay.inventory_id}`);
const entryIds = new Set();
const localPaths = new Set();
const entryKeys = new Set(["entry_id", "registry_record_id", "source_unit_id", "unit_kind", "path", "expected_visibility", "storage_class", "expected_remote", "notes"]);
const unitKinds = new Set(["canonical_repo", "worktree", "project_tree", "data_plane", "archive", "private_store", "runtime"]);
const visibilities = new Set(["public", "private", "mixed"]);
const storageClasses = new Set(["tracked_source", "external_data", "private_state", "recoverable_archive", "runtime_state"]);
for (const entry of overlay.entries) {
  for (const key of Object.keys(entry)) if (!entryKeys.has(key)) fail(`${entry.entry_id ?? "entry"}: unexpected property ${key}`);
  if (!/^gls:private-entry:[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.entry_id ?? "")) fail(`invalid entry_id: ${entry.entry_id}`);
  if (entryIds.has(entry.entry_id)) fail(`duplicate entry_id: ${entry.entry_id}`);
  entryIds.add(entry.entry_id);
  const record = records.get(entry.registry_record_id);
  if (!record) fail(`${entry.entry_id}: registry_record_id does not resolve: ${entry.registry_record_id}`);
  if (entry.source_unit_id) {
    if (record.record_type !== "source_inventory") fail(`${entry.entry_id}: source_unit_id requires a Source Inventory registry_record_id`);
    if (!record.units?.some((unit) => unit.unit_id === entry.source_unit_id)) fail(`${entry.entry_id}: unknown source_unit_id ${entry.source_unit_id}`);
  }
  if (!unitKinds.has(entry.unit_kind)) fail(`${entry.entry_id}: invalid unit_kind`);
  if (!visibilities.has(entry.expected_visibility)) fail(`${entry.entry_id}: invalid expected_visibility`);
  if (!storageClasses.has(entry.storage_class)) fail(`${entry.entry_id}: invalid storage_class`);
  if (entry.expected_remote !== undefined && (typeof entry.expected_remote !== "string" || !entry.expected_remote.trim())) fail(`${entry.entry_id}: expected_remote must be a non-empty string`);
  if (entry.notes !== undefined && (typeof entry.notes !== "string" || !entry.notes.trim())) fail(`${entry.entry_id}: notes must be a non-empty string`);
  if (!path.isAbsolute(entry.path)) fail(`${entry.entry_id}: path must be absolute`);
  const normalizedPath = path.normalize(entry.path);
  if (normalizedPath !== entry.path) fail(`${entry.entry_id}: path must already be normalized`);
  if (localPaths.has(normalizedPath)) fail(`duplicate path: ${normalizedPath}`);
  localPaths.add(normalizedPath);
}

const entries = overlay.entries.map((entry) => ({ ...entry })).sort((a, b) => a.entry_id.localeCompare(b.entry_id));
const normalized = { schema_version: overlay.schema_version, record_type: overlay.record_type, inventory_id: overlay.inventory_id, observed_at: overlay.observed_at, entries };
const sourceSha256 = createHash("sha256").update(`${JSON.stringify(normalized)}\n`).digest("hex");
const projection = {
  schema_version: "1.0.0",
  record_type: "private_source_overlay_projection",
  inventory_id: overlay.inventory_id,
  observed_at: overlay.observed_at,
  source_sha256: sourceSha256,
  entries: entries.map(({ entry_id, registry_record_id, source_unit_id, unit_kind, expected_visibility, storage_class }) => ({
    entry_id, registry_record_id, ...(source_unit_id ? { source_unit_id } : {}), unit_kind, expected_visibility, storage_class
  }))
};
const projectionText = JSON.stringify(projection);
if (/(?:\/Users\/|\/home\/|file:\/\/|unix:\/\/|\\\\)/i.test(projectionText)) fail("public projection contains a machine-local reference");
if (/(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{12,}/i.test(projectionText) || /(?:token|key|secret|password|credential|signature)\s*[=:]\s*[^\s&#]{8,}/i.test(projectionText)) fail("public projection contains credential-bearing text");
await mkdir(path.dirname(normalizedFile), { recursive: true });
await mkdir(path.dirname(projectionFile), { recursive: true });
await writeFile(normalizedFile, `${JSON.stringify(normalized, null, 2)}\n`, { mode: 0o600 });
await writeFile(projectionFile, `${JSON.stringify(projection, null, 2)}\n`, { mode: 0o600 });
console.log(`PASS private overlay build: ${entries.length} entries; projection contains no local paths`);
}

main().catch((error) => {
  console.error(`INVALID private overlay: ${error.message}`);
  process.exit(2);
});
