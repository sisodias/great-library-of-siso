#!/usr/bin/env node
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const inventoryId = "gls:source-inventory:7c9e2a41-5d68-4f03-b8a7-1e6c9d2f405b";
let passed = 0;

function build(input, normalized, projection) {
  return spawnSync(process.execPath, [join(root, "scripts/build-private-overlay.mjs"), "--input", input, "--normalized", normalized, "--projection", projection, "--allow-test-output"], { cwd: root, encoding: "utf8" });
}

function audit(input, receipt, extra = []) {
  return spawnSync(process.execPath, [join(root, "scripts/audit-laptop-estate.mjs"), "--input", input, "--receipt", receipt, "--allow-test-output", ...extra], { cwd: root, encoding: "utf8" });
}

function overlay(entries) {
  return { schema_version: "1.0.0", record_type: "private_source_overlay", inventory_id: inventoryId, observed_at: "2026-08-09", entries };
}

function entry(overrides = {}) {
  return {
    entry_id: "gls:private-entry:test-path",
    registry_record_id: inventoryId,
    source_unit_id: "knowledge-data-planes",
    unit_kind: "data_plane",
    path: "/tmp/great-library-overlay-test",
    expected_visibility: "private",
    storage_class: "external_data",
    ...overrides
  };
}

async function writeLargeDirtyFixture(repo, count = 5000) {
  const directory = join(repo, "large-status");
  await mkdir(directory);
  const suffix = "x".repeat(210);
  for (let offset = 0; offset < count; offset += 200) {
    await Promise.all(Array.from({ length: Math.min(200, count - offset) }, (_, index) => {
      const number = String(offset + index).padStart(5, "0");
      return writeFile(join(directory, `${number}-${suffix}`), "");
    }));
  }
}

async function test(name, value, expectedStatus, expectedText) {
  const dir = await mkdtemp(join(tmpdir(), "gls-overlay-test-"));
  try {
    const input = join(dir, "input.json");
    const normalized = join(dir, "normalized.json");
    const projection = join(dir, "projection.json");
    await writeFile(input, `${JSON.stringify(value, null, 2)}\n`);
    const result = build(input, normalized, projection);
    const output = `${result.stdout}\n${result.stderr}`;
    if (result.status !== expectedStatus || !output.includes(expectedText)) {
      console.error(`FAIL private overlay: ${name}`);
      console.error(output.trim());
      process.exit(1);
    }
    if (expectedStatus === 0) {
      const publicProjection = await readFile(projection, "utf8");
      if (publicProjection.includes("/tmp/")) {
        console.error(`FAIL private overlay: ${name}: projection leaked a path`);
        process.exit(1);
      }
    }
    passed += 1;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

await test("valid source-unit mapping", overlay([entry()]), 0, "PASS private overlay build");
await test("unknown registry ID", overlay([entry({ registry_record_id: "gls:work:00000000-0000-4000-8000-000000000000", source_unit_id: undefined })]), 2, "does not resolve");
await test("unknown source unit", overlay([entry({ source_unit_id: "not-a-real-unit" })]), 2, "unknown source_unit_id");
await test("duplicate path", overlay([entry(), entry({ entry_id: "gls:private-entry:second-path" })]), 2, "duplicate path");
await test("relative path", overlay([entry({ path: "relative/path" })]), 2, "path must be absolute");
await test("missing unit kind", overlay([entry({ unit_kind: undefined })]), 2, "invalid unit_kind");
await test("unexpected entry property", overlay([entry({ surprise: true })]), 2, "unexpected property surprise");

const auditDir = await mkdtemp(join(tmpdir(), "gls-audit-test-"));
try {
  const input = join(auditDir, "input.json");
  const receipt = join(auditDir, "receipt.json");
  const existing = join(auditDir, "existing-data");
  await mkdir(existing);
  const publicDestination = join(auditDir, "public-receipt.json");
  let boundaryResult = spawnSync(process.execPath, [join(root, "scripts/audit-laptop-estate.mjs"), "--input", input, "--receipt", publicDestination], { cwd: root, encoding: "utf8" });
  if (boundaryResult.status !== 2 || !boundaryResult.stderr.includes("ignored .local/private-registry boundary")) throw new Error("audit must reject receipt output outside the private boundary");
  boundaryResult = spawnSync(process.execPath, [join(root, "scripts/build-private-overlay.mjs"), "--input", input, "--normalized", join(auditDir, "public-normalized.json"), "--projection", join(auditDir, "public-projection.json")], { cwd: root, encoding: "utf8" });
  if (boundaryResult.status !== 2 || !boundaryResult.stderr.includes("ignored .local/private-registry boundary")) throw new Error("builder must reject outputs outside the private boundary");
  passed += 2;
  await writeFile(input, `${JSON.stringify(overlay([entry({ path: existing })]), null, 2)}\n`);
  let result = audit(input, receipt, ["--json"]);
  if (result.status !== 0) throw new Error(`valid audit failed: ${result.stderr || result.stdout}`);
  for (const forbidden of [existing, "/Users/", "/home/", "file://", "top_level", "realpath"]) {
    if (result.stdout.includes(forbidden)) throw new Error(`audit JSON leaked ${forbidden}`);
  }
  const firstReceipt = await readFile(receipt, "utf8");
  result = audit(input, receipt, ["--json"]);
  const secondReceipt = await readFile(receipt, "utf8");
  if (result.status !== 0 || secondReceipt !== firstReceipt) throw new Error("audit receipt is not deterministic");
  passed += 1;

  await writeFile(input, `${JSON.stringify(overlay([entry({ path: join(auditDir, "missing") })]), null, 2)}\n`);
  result = audit(input, receipt);
  if (result.status !== 1 || !result.stdout.includes("path-missing")) throw new Error("missing path must be drift exit 1");
  passed += 1;

  await writeFile(input, "{bad json\n");
  result = audit(input, receipt);
  if (result.status !== 2) throw new Error("malformed input must be runtime exit 2");
  passed += 1;

  const repository = join(auditDir, "repo");
  const nested = join(repository, "nested");
  await mkdir(nested, { recursive: true });
  for (const args of [["init"], ["config", "user.email", "audit@example.invalid"], ["config", "user.name", "Estate Audit"], ["commit", "--allow-empty", "-m", "fixture"], ["remote", "add", "origin", "https://example.invalid/actual.git"]]) {
    const command = spawnSync("/usr/bin/git", ["-C", repository, ...args], { encoding: "utf8" });
    if (command.status !== 0) throw new Error(`git fixture failed: ${command.stderr}`);
  }
  await writeFile(input, `${JSON.stringify(overlay([entry({ unit_kind: "canonical_repo", path: repository, expected_visibility: "public", storage_class: "tracked_source", expected_remote: "https://example.invalid/expected.git" })]), null, 2)}\n`);
  result = audit(input, receipt);
  if (result.status !== 1 || !result.stdout.includes("repository-remote-mismatch")) throw new Error("remote mismatch must be drift exit 1");
  passed += 1;

  await writeFile(input, `${JSON.stringify(overlay([entry({ unit_kind: "canonical_repo", path: nested, expected_visibility: "public", storage_class: "tracked_source", expected_remote: undefined })]), null, 2)}\n`);
  result = audit(input, receipt);
  if (result.status !== 1 || !result.stdout.includes("repository-boundary-not-direct")) throw new Error("nested canonical repo must be drift exit 1");
  passed += 1;

  await writeLargeDirtyFixture(repository);
  await writeFile(input, `${JSON.stringify(overlay([entry({ unit_kind: "canonical_repo", path: repository, expected_visibility: "public", storage_class: "tracked_source", expected_remote: "https://example.invalid/actual.git" })]), null, 2)}\n`);
  result = audit(input, receipt, ["--json"]);
  const largeReceipt = JSON.parse(await readFile(receipt, "utf8"));
  const observedDirtyEntries = largeReceipt.entries[0].git?.dirty_entries;
  if (result.status !== 0 || observedDirtyEntries !== 5000) throw new Error(`audit collector must not silently truncate repositories above the default child-process buffer (exit=${result.status}, dirty_entries=${observedDirtyEntries}, findings=${largeReceipt.entries[0].findings.join(",")}, stderr=${result.stderr.trim()})`);
  passed += 1;
} finally {
  await rm(auditDir, { recursive: true, force: true });
}

console.log(`PASS private overlay tests: ${passed} cases`);
