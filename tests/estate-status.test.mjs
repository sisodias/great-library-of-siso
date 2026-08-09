#!/usr/bin/env node
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const registryId = "gls:work:9b18cc64-7d5e-4f30-b63d-a0ec30c1f7e1";
let passed = 0;

function run(input, output) {
  return spawnSync(process.execPath, [join(root, "scripts/estate-status.mjs"), "--input", input, "--output", output, "--allow-test-output", "--json"], { cwd: root, encoding: "utf8" });
}
function overlay(entry) {
  return { schema_version: "1.0.0", record_type: "private_source_overlay", inventory_id: "gls:source-inventory:7c9e2a41-5d68-4f03-b8a7-1e6c9d2f405b", observed_at: "2026-08-09", entries: [entry] };
}
function entry(path, extra = {}) {
  return { entry_id: "gls:private-entry:status-test", registry_record_id: registryId, unit_kind: "canonical_repo", path, expected_visibility: "public", storage_class: "tracked_source", ...extra };
}
function git(cwd, args) {
  const result = spawnSync("/usr/bin/git", ["-C", cwd, ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
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

const dir = await mkdtemp(join(tmpdir(), "gls-estate-status-"));
try {
  const repo = join(dir, "repo");
  await mkdir(repo);
  git(repo, ["init"]); git(repo, ["config", "user.email", "status@example.invalid"]); git(repo, ["config", "user.name", "Estate Status"]); git(repo, ["commit", "--allow-empty", "-m", "fixture"]);
  await writeFile(join(repo, "README.md"), "fixture\n");
  await writeFile(join(repo, "AGENTS.md"), "fixture\n");
  await writeFile(join(repo, "CURRENT_STATE.md"), "fixture\n");
  git(repo, ["add", "README.md", "AGENTS.md", "CURRENT_STATE.md"]);
  git(repo, ["commit", "-m", "add repository contract"]);
  git(repo, ["remote", "add", "origin", "https://user:secret@example.invalid/estate-status.git?token=fixture#private"]);
  const input = join(dir, "overlay.json"); const output = join(dir, "report.json");
  await writeFile(input, `${JSON.stringify(overlay(entry(repo)), null, 2)}\n`);
  let result = run(input, output);
  if (result.status !== 0) throw new Error(`clean status failed: ${result.stdout}\n${result.stderr}`);
  const first = await readFile(output, "utf8");
  const report = JSON.parse(first);
  if (report.entries[0].registry_resolution !== "resolved" || report.entries[0].repository.boundary !== "direct") throw new Error("identity or direct Git boundary missing");
  if (report.entries[0].documentation.README !== true || report.entries[0].documentation.AGENTS !== true) throw new Error("documentation contract missing");
  if (report.summary.informational_dirty !== 0 || report.entries[0].repository.dirty !== false) throw new Error("clean repository must not be reported dirty");
  if (!/^[0-9a-f]{40}$/.test(report.entries[0].repository.head_sha) || !report.entries[0].repository.branch) throw new Error("commit or branch identity missing");
  if (report.entries[0].repository.origin_url !== "https://example.invalid/estate-status.git") throw new Error("origin identity missing or unsanitized");
  for (const forbidden of [dir, "/Users/", "/home/", "user:secret", "token=fixture", "#private"]) {
    if (result.stdout.includes(forbidden) || first.includes(forbidden)) throw new Error(`status output leaked ${forbidden}`);
  }
  result = run(input, output); const second = await readFile(output, "utf8");
  if (result.status !== 0 || first !== second) throw new Error("status report is not deterministic");
  passed += 2;

  await writeFile(join(repo, "dirty.txt"), "informational\n");
  result = run(input, output); const dirty = JSON.parse(await readFile(output, "utf8"));
  if (result.status !== 0 || dirty.summary.informational_dirty !== 1 || dirty.entries[0].status !== "pass") throw new Error("dirty repository must remain informational");
  passed += 1;

  await writeFile(input, `${JSON.stringify(overlay(entry(repo, { expected_remote: "https://example.invalid/not-the-origin.git" })), null, 2)}\n`);
  result = run(input, output);
  if (result.status !== 1 || !result.stdout.includes('"remote_matches": false')) throw new Error("remote drift must be reported");
  passed += 1;

  const nested = join(repo, "nested"); await mkdir(nested);
  await writeFile(input, `${JSON.stringify(overlay(entry(nested)), null, 2)}\n`);
  result = run(input, output);
  if (result.status !== 1 || !result.stdout.includes('"boundary": "contained"')) throw new Error("contained repository must be drift");
  passed += 1;

  const largeRepo = join(dir, "large-repo");
  await mkdir(largeRepo);
  git(largeRepo, ["init"]); git(largeRepo, ["config", "user.email", "status@example.invalid"]); git(largeRepo, ["config", "user.name", "Estate Status"]); git(largeRepo, ["commit", "--allow-empty", "-m", "fixture"]);
  await writeLargeDirtyFixture(largeRepo);
  await writeFile(input, `${JSON.stringify(overlay(entry(largeRepo)), null, 2)}\n`);
  result = run(input, output);
  const large = JSON.parse(await readFile(output, "utf8"));
  if (result.status !== 0 || large.entries[0].repository.dirty_entries !== 5000) throw new Error("status collector must not silently truncate repositories above the default child-process buffer");
  passed += 1;
} finally { await rm(dir, { recursive: true, force: true }); }

console.log(`PASS estate status tests: ${passed} cases`);
