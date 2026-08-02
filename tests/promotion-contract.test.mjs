#!/usr/bin/env node
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const inventoryName = "agent-capability-promotion-2026-08-01.json";
const inventoryId = "gls:source-inventory:ce88a0e3-ffa0-459a-836a-52824d253e34";
const successorId = "gls:source-inventory:8501f7e7-cfe3-4512-9840-1ada7104aced";
const stackReleaseId = "gls:release:a085911a-30f7-4075-b8e1-680a65a2a0cd";
const stackRevision = "f4a9626c0a1771cd3ee449f25a1ab63c8b297845";
const hooksReleaseId = "gls:release:98ba8230-3cdc-478b-b855-e9d808655c46";
const hooksRevision = "9125a972b4ba03661bf17ee135790282f246c15f";
const manifestLocator = `https://github.com/sisodias/siso-agent-stack/blob/${stackRevision}/stack.manifest.json`;
const manifestSha256 = "0c09aa2e462301f20b0b9f79cd7336b638623982c72c3bd4913bb649324a80f2";
let passed = 0;

async function fixture() {
  const target = await mkdtemp(join(tmpdir(), "great-library-promotion-contract-"));
  await cp(join(root, "schemas"), join(target, "schemas"), { recursive: true });
  await cp(join(root, "registry"), join(target, "registry"), { recursive: true });
  await cp(join(root, "scripts", "validate.mjs"), join(target, "scripts", "validate.mjs"), { recursive: true });
  return target;
}

function validate(target) {
  return spawnSync(process.execPath, [join(target, "scripts", "validate.mjs")], { cwd: target, encoding: "utf8" });
}

async function readInventory(target) {
  const file = join(target, "registry", "source-inventories", inventoryName);
  return { file, value: JSON.parse(await readFile(file, "utf8")) };
}

async function test(name, mutate, expectedStatus, expectedText) {
  const target = await fixture();
  try {
    await mutate(target);
    const result = validate(target);
    const output = `${result.stdout}\n${result.stderr}`;
    if ((result.status === 0) !== (expectedStatus === 0) || !output.includes(expectedText)) {
      console.error(`FAIL promotion contract: ${name}`);
      console.error(output.trim());
      process.exit(1);
    }
    passed += 1;
  } finally {
    await rm(target, { recursive: true, force: true });
  }
}

async function addSuccessor(target, change) {
  const { value } = await readInventory(target);
  value.id = successorId;
  value.name = "SISO agent capability promotion campaign successor fixture";
  value.observed_at = "2026-08-02";
  value.supersedes_inventory_id = inventoryId;
  change(value);
  await writeFile(join(target, "registry", "source-inventories", "agent-capability-promotion-2026-08-02.json"), `${JSON.stringify(value, null, 2)}\n`);
}

async function bindStackManifestArtifact(target) {
  const releaseFile = join(target, "registry", "releases", "siso-agent-stack-f4a9626.json");
  const release = JSON.parse(await readFile(releaseFile, "utf8"));
  release.artifacts.push({
    id: "gls:artifact:68cc3a53-c31c-4efd-b04c-4574d9e4eac9",
    kind: "registry_metadata",
    locator: manifestLocator,
    revision: stackRevision,
    availability: "public",
    owner: "sisodias",
    ownership: "siso",
    license: release.artifacts[0].license,
    integrity: { state: "verified", algorithm: "sha256", digest: manifestSha256 }
  });
  const rawRelease = `${JSON.stringify(release, null, 2)}\n`;
  await writeFile(releaseFile, rawRelease);
  const snapshotDir = join(target, "registry", "snapshots");
  const mutatedReleaseHash = createHash("sha256").update(rawRelease).digest("hex");
  for (const snapshotName of await readdir(snapshotDir)) {
    if (!snapshotName.endsWith(".json")) continue;
    const snapshotFile = join(snapshotDir, snapshotName);
    const snapshot = JSON.parse(await readFile(snapshotFile, "utf8"));
    const pin = snapshot.releases.find((candidate) => candidate.release_id === stackReleaseId);
    if (!pin) continue;
    pin.manifest_sha256 = mutatedReleaseHash;
    await writeFile(snapshotFile, `${JSON.stringify(snapshot, null, 2)}\n`);
  }
}

function configureStackPinnedUnit(value, manifestDigest = manifestSha256) {
  const unit = value.units.find((candidate) => candidate.unit_id === "hooks-registry-and-promotion");
  unit.promotion.stage = "stack_pinned";
  unit.promotion.release_id = hooksReleaseId;
  unit.promotion.snapshot_id = "gls:snapshot:95cec3fe-9c7a-4135-9eb6-02fdecc3696d";
  unit.promotion.stack_pin = {
    stack_release_id: stackReleaseId,
    component_work_id: "gls:work:4198f323-9855-43f6-a99a-72143086818e",
    component_release_id: hooksReleaseId,
    component_revision: hooksRevision,
    manifest_locator: manifestLocator,
    manifest_sha256: manifestDigest,
    evidence_reference: manifestLocator
  };
  unit.evidence[0].kind = "release_receipt";
  unit.evidence[0].reference = manifestLocator;
  unit.evidence[0].summary = `Stack revision ${stackRevision} pins Hooks component revision ${hooksRevision} in the verified manifest.`;
  unit.promotion.verification_evidence_refs = [manifestLocator];
}

await test("baseline campaign validates", async () => {}, 0, "PASS registry validation");

await test("unassigned product owner cannot retain a product target", async (target) => {
  const { file, value } = await readInventory(target);
  const unit = value.units[0];
  unit.promotion.target_owner_state = "unassigned";
  unit.promotion.evidence_owner_work_ids = [unit.promotion.target_work_ids[0]];
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 1, "cannot declare target Works while its target owner is unassigned");

await test("assigned product owner requires a product target", async (target) => {
  const { file, value } = await readInventory(target);
  value.units[0].promotion.target_work_ids = [];
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 1, "with an assigned target owner requires a target Work");

await test("valid successor advances without losing history", async (target) => {
  await addSuccessor(target, (value) => {
    value.units.find((unit) => unit.unit_id === "deterministic-policy-guards").promotion.stage = "owner_assigned";
  });
}, 0, "PASS registry validation");

await test("released stage requires a real Release", async (target) => {
  const { file, value } = await readInventory(target);
  value.units[0].promotion.stage = "released";
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 1, "requires a resolving release_id");

await test("verified stage rejects unbound evidence", async (target) => {
  const { file, value } = await readInventory(target);
  value.units[0].promotion.stage = "verified";
  value.units[0].evidence[0].kind = "integration_check";
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 1, "requires bound verification_evidence_refs");

await test("released stage rejects an unrelated Work release", async (target) => {
  const { file, value } = await readInventory(target);
  value.units[0].promotion.stage = "released";
  value.units[0].promotion.release_id = "gls:release:3da753a0-ffd2-467c-a2ca-5dfd712ba86f";
  value.units[0].evidence[0].kind = "integration_check";
  value.units[0].promotion.verification_evidence_refs = [value.units[0].evidence[0].reference];
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 1, "release Work must be one of its target Works");

await test("stack-pinned stage resolves owning release, Snapshot, and Stack release", async (target) => {
  await bindStackManifestArtifact(target);
  const { file, value } = await readInventory(target);
  configureStackPinnedUnit(value);
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 0, "PASS registry validation");

await test("stack-pinned stage rejects a fabricated manifest digest", async (target) => {
  await bindStackManifestArtifact(target);
  const { file, value } = await readInventory(target);
  configureStackPinnedUnit(value, "f".repeat(64));
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 1, "manifest locator and digest must match a verified Stack Release artifact");

await test("stack-pinned stage rejects a nominal unstructured receipt", async (target) => {
  const { file, value } = await readInventory(target);
  const unit = value.units.find((candidate) => candidate.unit_id === "hooks-registry-and-promotion");
  unit.promotion.stage = "stack_pinned";
  unit.promotion.release_id = "gls:release:98ba8230-3cdc-478b-b855-e9d808655c46";
  unit.promotion.snapshot_id = "gls:snapshot:95cec3fe-9c7a-4135-9eb6-02fdecc3696d";
  unit.evidence[0].kind = "release_receipt";
  unit.promotion.verification_evidence_refs = [unit.evidence[0].reference];
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}, 1, "requires a structured stack_pin receipt");

await test("successor cannot erase a candidate", async (target) => {
  await addSuccessor(target, (value) => { value.units = value.units.slice(1); });
}, 1, "drops unit hooks-registry-and-promotion");

await test("successor cannot regress lifecycle stage", async (target) => {
  await addSuccessor(target, (value) => {
    value.units.find((unit) => unit.unit_id === "hooks-registry-and-promotion").promotion.stage = "read";
  });
}, 1, "regresses from owner_assigned to read");

console.log(`PASS promotion contract tests: ${passed} cases`);
