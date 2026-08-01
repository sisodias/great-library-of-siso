#!/usr/bin/env node
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const questionName = "frontier-question-gq-009.json";
let passed = 0;

async function fixture() {
  const target = await mkdtemp(join(tmpdir(), "great-library-research-contract-"));
  await cp(join(root, "schemas"), join(target, "schemas"), { recursive: true });
  await cp(join(root, "registry"), join(target, "registry"), { recursive: true });
  await cp(join(root, "scripts", "validate.mjs"), join(target, "scripts", "validate.mjs"), { recursive: true });
  return target;
}

function validate(target) {
  return spawnSync(process.execPath, [join(target, "scripts", "validate.mjs")], { cwd: target, encoding: "utf8" });
}

async function test(name, mutate, expectedStatus, expectedText) {
  const target = await fixture();
  try {
    const file = join(target, "registry", "works", questionName);
    const question = JSON.parse(await readFile(file, "utf8"));
    await mutate(question);
    await writeFile(file, `${JSON.stringify(question, null, 2)}\n`);
    const result = validate(target);
    const output = `${result.stdout}\n${result.stderr}`;
    if ((result.status === 0) !== (expectedStatus === 0) || !output.includes(expectedText)) {
      console.error(`FAIL research contract: ${name}`);
      console.error(output.trim());
      process.exit(1);
    }
    passed += 1;
  } finally {
    await rm(target, { recursive: true, force: true });
  }
}

await test("GQ-009 baseline validates", async () => {}, 0, "PASS registry validation");
await test("falsifiers cannot be empty", async (question) => { question.research_contract.falsifiers = []; }, 1, "expected at least 1 items");
await test("decision target must be substantive", async (question) => { question.research_contract.decision_to_change = "tiny"; }, 1, "string is too short");
await test("watch triggers must be structured", async (question) => { question.research_contract.watch_triggers = "anything changes"; }, 1, "expected array");

console.log(`PASS research question contract tests: ${passed} cases`);
