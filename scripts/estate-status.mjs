#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, lstat, readFile, readdir, realpath, writeFile, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const privateBoundary = path.join(root, ".local/private-registry");
const defaultInput = path.join(privateBoundary, "overlay.json");
const defaultOutput = path.join(privateBoundary, "estate-status.json");
const gitMaxBuffer = 64 * 1024 * 1024;
const excludedKinds = ["archive", "data_plane", "private_store", "runtime"];
const excludedBoundaries = [
  "vendor clones",
  "reference checkouts",
  "ephemeral worktrees",
  "runtime tooling",
  "credentials and private topology",
  "raw databases, transcripts, and personal payloads"
];

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  const value = process.argv[index + 1];
  if (!value) throw new Error(`--${name} requires a value`);
  return path.resolve(value);
}

function git(args, cwd, { required = false } = {}) {
  const result = spawnSync("/usr/bin/git", ["-C", cwd, ...args], { encoding: "utf8", maxBuffer: gitMaxBuffer });
  if (result.error) throw new Error(`git ${args[0]} failed: ${result.error.message}`);
  if (result.status !== 0) {
    if (required) throw new Error(`git ${args[0]} failed with exit ${result.status}: ${(result.stderr || result.stdout).trim()}`);
    return null;
  }
  return result.stdout.trim();
}

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }

function sanitizedRemote(value) {
  if (!value || /^(?:\/|~\/|\.{1,2}\/|file:)/i.test(value)) return null;
  try {
    const url = new URL(value);
    if (!["http:", "https:", "ssh:"].includes(url.protocol)) return null;
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    if (/^[^/\s@]+@[^:\s]+:.+/.test(value)) return value.replace(/^[^@]+@/, "");
    return null;
  }
}

async function readJson(file) { return JSON.parse(await readFile(file, "utf8")); }

async function registryIndex() {
  const records = new Map();
  for (const directory of ["works", "releases", "assemblies", "source-inventories", "snapshots", "decisions", "events"]) {
    const base = path.join(root, "registry", directory);
    for (const name of (await readdir(base)).filter((entry) => entry.endsWith(".json")).sort()) {
      const record = await readJson(path.join(base, name));
      records.set(record.id, record);
    }
  }
  return records;
}

async function hasFile(directory, name) {
  try { await access(path.join(directory, name)); return true; } catch { return false; }
}

async function inspectEntry(entry, records) {
  const record = records.get(entry.registry_record_id);
  const result = {
    entry_id: entry.entry_id,
    registry_record_id: entry.registry_record_id,
    registry_resolution: record ? "resolved" : "unresolved",
    ...(entry.source_unit_id ? { source_unit_id: entry.source_unit_id } : {}),
    unit_kind: entry.unit_kind,
    expected_visibility: entry.expected_visibility,
    storage_class: entry.storage_class,
    status: record ? "pass" : "drift",
    presence: "missing",
    documentation: { README: false, AGENTS: false, CURRENT_STATE: false },
    exclusions: excludedKinds.includes(entry.unit_kind) ? ["entry-kind-excluded-from-repository-contract"] : []
  };
  try {
    const metadata = await lstat(entry.path);
    result.presence = metadata.isDirectory() ? "directory" : metadata.isFile() ? "file" : "other";
    if (metadata.isDirectory()) {
      result.documentation = {
        README: await hasFile(entry.path, "README.md"),
        AGENTS: await hasFile(entry.path, "AGENTS.md"),
        CURRENT_STATE: await hasFile(entry.path, "CURRENT_STATE.md")
      };
    }
  } catch (error) {
    if (!(["ENOENT", "ENOTDIR"].includes(error?.code))) throw error;
    result.status = "drift";
  }

  const topLevel = result.presence === "directory" ? git(["rev-parse", "--show-toplevel"], entry.path) : null;
  if (topLevel) {
    const boundary = (await realpath(topLevel)) === (await realpath(entry.path)) ? "direct" : "contained";
    const origin = git(["remote", "get-url", "origin"], entry.path);
    const head = git(["rev-parse", "HEAD"], entry.path);
    const branch = git(["symbolic-ref", "--short", "HEAD"], entry.path);
    const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], entry.path);
    const dirtyEntries = git(["status", "--porcelain=v1", "--untracked-files=all"], entry.path, { required: true }).split("\n").filter(Boolean).length;
    result.repository = {
      boundary,
      head_sha: head,
      branch,
      upstream_ref: upstream,
      origin_url: sanitizedRemote(origin),
      head_present: Boolean(head),
      branch_present: Boolean(branch),
      remote_present: Boolean(origin),
      remote_matches: entry.expected_remote ? origin === entry.expected_remote : null,
      dirty: dirtyEntries > 0,
      dirty_entries: dirtyEntries
    };
    if (["canonical_repo", "worktree"].includes(entry.unit_kind) && boundary !== "direct") result.status = "drift";
    if (["canonical_repo", "worktree"].includes(entry.unit_kind) && !result.repository.head_present) result.status = "drift";
    if (entry.expected_remote && origin !== entry.expected_remote) result.status = "drift";
  } else if (["canonical_repo", "worktree"].includes(entry.unit_kind) && result.presence === "directory") {
    result.status = "drift";
  }
  return result;
}

async function main() {
  const input = argument("input", defaultInput);
  const output = argument("output", defaultOutput);
  const allowTestOutput = process.argv.includes("--allow-test-output");
  if (!allowTestOutput && !output.startsWith(`${privateBoundary}${path.sep}`)) throw new Error("output must remain under the ignored .local/private-registry boundary");
  const overlayText = await readFile(input, "utf8");
  const overlay = JSON.parse(overlayText);
  const records = await registryIndex();
  const entries = await Promise.all([...overlay.entries].sort((a, b) => a.entry_id.localeCompare(b.entry_id)).map((entry) => inspectEntry(entry, records)));
  const drift = entries.filter((entry) => entry.status === "drift").length;
  const informationalDirty = entries.filter((entry) => entry.repository?.dirty).length;
  const report = {
    schema_version: "1.0.0",
    record_type: "private_estate_status_report",
    inventory_id: overlay.inventory_id,
    observed_at: overlay.observed_at,
    overlay_sha256: sha256(overlayText),
    summary: { total: entries.length, pass: entries.length - drift, drift, informational_dirty: informationalDirty },
    contract: {
      repository_mutation: false,
      private_report_written: true,
      path_policy: "machine-local paths omitted from report",
      dirty_policy: "dirty repositories are informational unless repository boundary, identity, or remote drifts",
      documentation_files: ["README.md", "AGENTS.md", "CURRENT_STATE.md"],
      excluded_entry_kinds: excludedKinds,
      excluded_boundaries: excludedBoundaries
    },
    entries
  };
  const outputText = `${JSON.stringify(report, null, 2)}\n`;
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, outputText, { mode: 0o600 });
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else console.log(`${drift ? "DRIFT" : "PASS"} estate status: ${entries.length} entries; ${drift} drift; ${informationalDirty} dirty (informational)`);
  process.exit(drift ? 1 : 0);
}

main().catch((error) => { console.error(`ERROR estate status: ${error.message}`); process.exit(2); });
