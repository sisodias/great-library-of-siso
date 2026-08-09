#!/usr/bin/env node
import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const privateOutputBoundary = path.join(root, ".local/private-registry");
const gitMaxBuffer = 64 * 1024 * 1024;

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  if (!process.argv[index + 1]) throw new Error(`--${name} requires a value`);
  return path.resolve(process.argv[index + 1]);
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

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function main() {
  const input = argument("input", path.join(root, ".local/private-registry/overlay.json"));
  const receiptFile = argument("receipt", path.join(root, ".local/private-registry/laptop-estate-receipt.json"));
  const allowTestOutput = process.argv.includes("--allow-test-output");
  if (!allowTestOutput && !receiptFile.startsWith(`${privateOutputBoundary}${path.sep}`)) throw new Error("receipt output must remain under the ignored .local/private-registry boundary");
  const outputDirectory = path.dirname(receiptFile);
  const normalizedFile = path.join(outputDirectory, "audit-normalized.json");
  const projectionFile = path.join(outputDirectory, "audit-public-projection.json");
  const json = process.argv.includes("--json");

  await mkdir(outputDirectory, { recursive: true });
  const build = spawnSync(process.execPath, [
    path.join(root, "scripts/build-private-overlay.mjs"),
    "--input", input,
    "--normalized", normalizedFile,
    "--projection", projectionFile,
    ...(allowTestOutput ? ["--allow-test-output"] : [])
  ], { cwd: root, encoding: "utf8" });
  if (build.error) throw build.error;
  if (build.status !== 0) {
    process.stderr.write(build.stderr || build.stdout);
    process.exit(2);
  }

  const [overlayBuffer, normalizedBuffer] = await Promise.all([readFile(input), readFile(normalizedFile)]);
  const normalized = JSON.parse(normalizedBuffer.toString("utf8"));
  const entries = [];
  let drift = 0;

  for (const entry of normalized.entries) {
    const findings = [];
    let exists = false;
    let kind = null;
    let gitState = null;
    try {
      const metadata = await lstat(entry.path);
      exists = true;
      if (metadata.isSymbolicLink()) {
        kind = "symlink";
        findings.push("symlink-entry-not-allowed");
      } else {
        kind = metadata.isDirectory() ? "directory" : metadata.isFile() ? "file" : "other";
      }

      const topLevel = git(["rev-parse", "--show-toplevel"], entry.path);
      if (topLevel) {
        const boundary = (await realpath(topLevel)) === (await realpath(entry.path)) ? "direct" : "contained";
        const head = git(["rev-parse", "HEAD"], entry.path);
        const origin = git(["remote", "get-url", "origin"], entry.path);
        gitState = {
          boundary,
          has_head: Boolean(head),
          origin_matches: entry.expected_remote ? origin === entry.expected_remote : null,
          dirty_entries: git(["status", "--porcelain=v1", "--untracked-files=all"], entry.path, { required: true }).split("\n").filter(Boolean).length
        };
        if (["canonical_repo", "worktree"].includes(entry.unit_kind) && boundary !== "direct") findings.push("repository-boundary-not-direct");
        if (["canonical_repo", "worktree"].includes(entry.unit_kind) && !head) findings.push("repository-head-missing");
        if (entry.expected_remote && origin !== entry.expected_remote) findings.push("repository-remote-mismatch");
      } else if (["canonical_repo", "worktree"].includes(entry.unit_kind)) {
        findings.push("repository-metadata-missing");
      }
    } catch (error) {
      if (error?.code === "ENOENT" || error?.code === "ENOTDIR") findings.push("path-missing");
      else throw error;
    }

    const status = findings.length ? "drift" : "pass";
    if (status === "drift") drift += 1;
    entries.push({
      entry_id: entry.entry_id,
      registry_record_id: entry.registry_record_id,
      ...(entry.source_unit_id ? { source_unit_id: entry.source_unit_id } : {}),
      unit_kind: entry.unit_kind,
      status,
      exists,
      kind,
      findings,
      ...(gitState ? { git: gitState } : {})
    });
  }

  const receipt = {
    schema_version: "1.0.0",
    record_type: "laptop_estate_audit_receipt",
    inventory_id: normalized.inventory_id,
    observed_at: normalized.observed_at,
    overlay_sha256: sha256(overlayBuffer),
    normalized_sha256: sha256(normalizedBuffer),
    summary: { total: entries.length, drift, pass: entries.length - drift },
    entries
  };
  await writeFile(receiptFile, `${JSON.stringify(receipt, null, 2)}\n`, { mode: 0o600 });

  if (json) console.log(JSON.stringify(receipt, null, 2));
  else {
    console.log(`${drift ? "DRIFT" : "PASS"} laptop estate audit: ${entries.length} entries; ${drift} drift`);
    for (const entry of entries) console.log(`- ${entry.status.toUpperCase()} ${entry.entry_id}${entry.findings.length ? ` (${entry.findings.join(", ")})` : ""}`);
    console.log("Private redacted receipt written under the ignored local registry boundary.");
  }
  process.exit(drift ? 1 : 0);
}

main().catch((error) => {
  console.error(`ERROR laptop estate audit: ${error.message}`);
  process.exit(2);
});
