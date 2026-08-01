#!/usr/bin/env node
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const startName = "2026-08-01-ecosystem-intelligence-started.json";
const frontierName = "2026-08-01-frontier-questions.json";
const startId = "gls:event:659accbe-2370-4169-8fc0-c67bc320d983";
let passed = 0;

async function fixture() {
  const target = await mkdtemp(join(tmpdir(), "great-library-intelligence-contract-"));
  await cp(join(root, "schemas"), join(target, "schemas"), { recursive: true });
  await cp(join(root, "registry"), join(target, "registry"), { recursive: true });
  await cp(join(root, "scripts", "validate.mjs"), join(target, "scripts", "validate.mjs"), { recursive: true });
  return target;
}

function validate(target) {
  return spawnSync(process.execPath, [join(target, "scripts", "validate.mjs")], { cwd: target, encoding: "utf8" });
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function test(name, mutate, expectedStatus, expectedText) {
  const target = await fixture();
  try {
    await mutate(target);
    const result = validate(target);
    const output = `${result.stdout}\n${result.stderr}`;
    if ((result.status === 0) !== (expectedStatus === 0) || !output.includes(expectedText)) {
      console.error(`FAIL intelligence contract: ${name}`);
      console.error(output.trim());
      process.exit(1);
    }
    passed += 1;
  } finally {
    await rm(target, { recursive: true, force: true });
  }
}

await test("baseline ledger validates", async () => {}, 0, "PASS registry validation");

await test("event scope rejects an unresolved Work", async (target) => {
  const file = join(target, "registry", "events", startName);
  const event = await readJson(file);
  event.scope.work_ids = ["gls:work:00000000-0000-4000-8000-000000000000"];
  await writeJson(file, event);
}, 1, "work_ids reference gls:work:00000000-0000-4000-8000-000000000000 does not resolve");

await test("event thread rejects forked successors", async (target) => {
  const file = join(target, "registry", "events", startName);
  const start = await readJson(file);
  for (const [id, minute] of [["gls:event:ac2e0991-ec41-40ba-ac66-a6b8b5520d6d", "37"], ["gls:event:94aa91d7-afe8-4b36-9c1c-c1e50c446a44", "38"]]) {
    const successor = structuredClone(start);
    successor.id = id;
    successor.occurred_at = `2026-08-01T22:${minute}:40+07:00`;
    successor.recorded_at = successor.occurred_at;
    successor.entry_type = "initiative_updated";
    successor.predecessor_event_id = startId;
    await writeJson(join(target, "registry", "events", `${id.slice(-12)}.json`), successor);
  }
}, 1, "has 2 successors");

await test("live initiative requires reserved paths", async (target) => {
  const file = join(target, "registry", "events", startName);
  const event = await readJson(file);
  event.coordination.reserved_paths = [];
  await writeJson(file, event);
}, 1, "live initiative requires at least one reserved path");

await test("active lanes reject overlapping reservations", async (target) => {
  const file = join(target, "registry", "events", startName);
  const event = await readJson(file);
  event.id = "gls:event:b31d760e-fa5f-4a2e-85f2-5f20a5ee3c2c";
  event.thread = { id: "gls:thread:collision-fixture", name: "Collision fixture", kind: "initiative" };
  event.coordination.reserved_paths = ["docs/"];
  await writeJson(join(target, "registry", "events", "collision-fixture.json"), event);
}, 1, "reserve overlapping paths");

await test("V24 requires an authored event", async (target) => {
  const file = join(target, "registry", "events", frontierName);
  const event = await readJson(file);
  event.scope.snapshot_ids = [];
  await writeJson(file, event);
}, 1, "Snapshot 24.0.0 must be referenced by an ecosystem Event");

await test("decision supersession must resolve", async (target) => {
  const file = join(target, "registry", "decisions", "adr-0004-append-only-ecosystem-intelligence.json");
  const decision = await readJson(file);
  decision.supersedes_decision_id = "gls:decision:00000000-0000-4000-8000-000000000000";
  await writeJson(file, decision);
}, 1, "supersedes_decision_id gls:decision:00000000-0000-4000-8000-000000000000 does not resolve");

await test("accepted ADR must enter the event graph", async (target) => {
  const file = join(target, "registry", "events", startName);
  const event = await readJson(file);
  event.scope.decision_ids = [];
  await writeJson(file, event);
}, 1, "accepted decision ADR-0004 must be referenced by at least one Event");

await test("decision scope rejects an unresolved Work", async (target) => {
  const file = join(target, "registry", "decisions", "adr-0004-append-only-ecosystem-intelligence.json");
  const decision = await readJson(file);
  decision.scope.work_ids = ["gls:work:00000000-0000-4000-8000-000000000000"];
  await writeJson(file, decision);
}, 1, "work_ids reference gls:work:00000000-0000-4000-8000-000000000000 does not resolve");

await test("completed thread cannot be reopened as active", async (target) => {
  const file = join(target, "registry", "events", frontierName);
  const completed = await readJson(file);
  const resumed = structuredClone(completed);
  resumed.id = "gls:event:1faf0210-753f-4ba5-ae03-1c3c4c4378a1";
  resumed.occurred_at = "2026-08-01T22:38:40+07:00";
  resumed.recorded_at = resumed.occurred_at;
  resumed.entry_type = "initiative_resumed";
  resumed.status = "active";
  resumed.predecessor_event_id = completed.id;
  resumed.coordination.reserved_paths = ["docs/research-question-model.html"];
  await writeJson(join(target, "registry", "events", "reopened-fixture.json"), resumed);
}, 1, "terminal status completed cannot transition to active");

console.log(`PASS intelligence contract tests: ${passed} cases`);
