#!/usr/bin/env node
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const questionFiles = {
  gq001: "frontier-question-gq-001.json",
  gq002: "frontier-question-gq-002.json",
  gq009: "frontier-question-gq-009.json"
};
let passed = 0;

async function fixture() {
  const target = await mkdtemp(join(tmpdir(), "great-library-god-questions-"));
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
    const workPath = (key) => join(target, "registry", "works", questionFiles[key]);
    const loadWork = async (key) => JSON.parse(await readFile(workPath(key), "utf8"));
    const saveWork = async (key, work) => writeFile(workPath(key), `${JSON.stringify(work, null, 2)}\n`);
    await mutate({ loadWork, saveWork });
    const result = validate(target);
    const output = `${result.stdout}\n${result.stderr}`;
    if ((result.status === 0) !== (expectedStatus === 0) || !output.includes(expectedText)) {
      console.error(`FAIL God Questions infrastructure: ${name}`);
      console.error(output.trim());
      process.exit(1);
    }
    passed += 1;
  } finally {
    await rm(target, { recursive: true, force: true });
  }
}

const crmContractReplay = {
  assumptions: [{
    id: "QA-CRM-KERNEL",
    level: "QA",
    scope: "composable CRM kernel",
    statement: "A stable shared kernel can support representative CRM workflows without forcing incompatible vertical invariants.",
    status: "active",
    confidence: "low",
    falsifier: "Two representative verticals require mutually incompatible invariants inside the proposed shared kernel.",
    depends_on: [],
    evidence_connection_ids: ["EC-CRM-DOSSIER"],
    review_date: "2026-08-02"
  }],
  evidence_connections: [{
    id: "EC-CRM-DOSSIER",
    source_type: "documentation",
    owning_work_id: "gls:work:9b18cc64-7d5e-4f30-b63d-a0ec30c1f7e1",
    reference: "docs/frontier-question-template.html#worked-example-composable-crm",
    relevance_hypothesis: "The existing CRM dossier is heterogeneous enough to test a domain assumption and action-learning lineage contract.",
    rights_state: "public_metadata_only",
    observed_at: "2026-08-02",
    provenance_receipt: "documentation-fixture:composable-crm:2026-08-02",
    revision_or_digest: "fixture-only:no-execution-evidence",
    summary: "This documentation fixture frames a reversible experiment but is not a CRM Work, mandate, or observed outcome.",
    supports_assumption_ids: ["QA-CRM-KERNEL"],
    challenges_assumption_ids: []
  }],
  action_learning_links: [
    {
      id: "AL-CRM-DEMAND",
      object_type: "epistemic_demand",
      authority_state: "demand_only",
      owner_role: "question_steward",
      reference: "fixture-only:crm:demand",
      predecessor_ids: [],
      related_assumption_ids: ["QA-CRM-KERNEL"],
      status: "proposed",
      summary: "Synthetic contract replay only; it requests evidence and grants no authority."
    },
    {
      id: "AL-CRM-CANDIDATE",
      object_type: "action_candidate",
      authority_state: "proposal_only",
      owner_role: "operating_architecture",
      reference: "fixture-only:crm:candidate",
      predecessor_ids: ["AL-CRM-DEMAND"],
      related_assumption_ids: ["QA-CRM-KERNEL"],
      status: "proposed",
      summary: "Synthetic contract replay only; the candidate is mutable and not approved."
    },
    {
      id: "AL-CRM-MANDATE",
      object_type: "execution_mandate",
      authority_state: "approved_scope",
      owner_role: "decision_owner",
      reference: "fixture-only:crm:mandate",
      content_sha256: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      predecessor_ids: ["AL-CRM-CANDIDATE"],
      related_assumption_ids: ["QA-CRM-KERNEL"],
      status: "approved",
      expires_at: "2026-08-03T00:00:00Z",
      summary: "Synthetic schema replay only; no real CRM execution authority is asserted."
    },
    {
      id: "AL-CRM-OBSERVATION",
      object_type: "observation_receipt",
      authority_state: "observation_only",
      owner_role: "independent_verifier",
      reference: "fixture-only:crm:observation",
      content_sha256: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      predecessor_ids: ["AL-CRM-MANDATE"],
      related_assumption_ids: ["QA-CRM-KERNEL"],
      status: "verified",
      summary: "Synthetic schema replay only; no factual CRM outcome is asserted."
    },
    {
      id: "AL-CRM-LEARNING",
      object_type: "learning_return",
      authority_state: "learning_proposal",
      owner_role: "evidence_engine",
      reference: "fixture-only:crm:learning-return",
      content_sha256: "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
      predecessor_ids: ["AL-CRM-OBSERVATION"],
      related_assumption_ids: ["QA-CRM-KERNEL"],
      status: "no_change",
      summary: "Synthetic schema replay only; the return demonstrates no-change without accepting an answer."
    }
  ]
};

await test("three registry programs validate", async () => {}, 0, "PASS registry validation");
await test("CRM documentation contract replay validates", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program = crmContractReplay;
  await saveWork("gq009", work);
}, 0, "PASS registry validation");
await test("duplicate assumption IDs fail", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.assumptions.push(structuredClone(work.research_contract.program.assumptions[0]));
  await saveWork("gq009", work);
}, 1, "duplicate assumption id");
await test("unknown assumption dependency fails", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.assumptions[0].depends_on = ["QA-GQ009-MISSING"];
  await saveWork("gq009", work);
}, 1, "depends on unknown assumption");
await test("assumption cycles fail", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.assumptions[0].depends_on = ["QA-GQ009-METADATA-VALUE"];
  await saveWork("gq009", work);
}, 1, "depends_on cycle");
await test("unknown evidence owner fails", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.evidence_connections[0].owning_work_id = "gls:work:00000000-0000-0000-0000-000000000000";
  await saveWork("gq009", work);
}, 1, "owner Work");
await test("directionless evidence fails", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.evidence_connections[0].supports_assumption_ids = [];
  work.research_contract.program.evidence_connections[0].challenges_assumption_ids = [];
  await saveWork("gq009", work);
}, 1, "must support or challenge");
await test("machine-local evidence references fail", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.evidence_connections[0].reference = ["", "Users", "example", "private", "research.json"].join("/");
  await saveWork("gq009", work);
}, 1, "machine-local path");
await test("private-host evidence references fail", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.evidence_connections[0].reference = "http://127.0.0.1:3000/private";
  await saveWork("gq009", work);
}, 1, "private or local host");
await test("authority laundering fails", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.action_learning_links[1].authority_state = "approved_scope";
  await saveWork("gq009", work);
}, 1, "must use authority_state proposal_only");
await test("unknown action predecessor fails", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program.action_learning_links[1].predecessor_ids = ["AL-GQ009-MISSING"];
  await saveWork("gq009", work);
}, 1, "unknown predecessor");
await test("learning returns cannot claim accepted state", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program = structuredClone(crmContractReplay);
  work.research_contract.program.action_learning_links.at(-1).status = "approved";
  await saveWork("gq009", work);
}, 1, "learning_return");
await test("mandates require expiry and digest", async ({ loadWork, saveWork }) => {
  const work = await loadWork("gq009");
  work.research_contract.program = structuredClone(crmContractReplay);
  delete work.research_contract.program.action_learning_links[2].expires_at;
  delete work.research_contract.program.action_learning_links[2].content_sha256;
  await saveWork("gq009", work);
}, 1, "requires expires_at and content_sha256");
await test("question IDs remain unique", async ({ loadWork, saveWork }) => {
  const gq001 = await loadWork("gq001");
  const gq009 = await loadWork("gq009");
  gq001.research_contract.question_id = gq009.research_contract.question_id;
  await saveWork("gq001", gq001);
}, 1, "duplicate question_id");

console.log(`PASS God Questions infrastructure contract tests: ${passed} cases`);
