import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("site");
const basePath = normalizeBase(process.env.LIBRARY_BASE_PATH || "/");
const errors = [];
const [releaseRecords, snapshotRecords] = await Promise.all(["releases", "snapshots"].map(async (directory) => {
  const location = path.resolve("registry", directory);
  const entries = await readdir(location, { withFileTypes: true });
  return Promise.all(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map(async (entry) => JSON.parse(await readFile(path.join(location, entry.name), "utf8"))));
}));
const selectedSnapshot = [...snapshotRecords].sort((a, b) => String(a.version).localeCompare(String(b.version), undefined, { numeric: true })).at(-1);

function normalizeBase(value) {
  const clean = `/${String(value).replace(/^\/+|\/+$/g, "")}/`;
  return clean === "//" ? "/" : clean;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

async function exists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

function localTarget(raw, sourceFile) {
  if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) return null;
  const clean = decodeURIComponent(raw.split("#", 1)[0].split("?", 1)[0]);
  if (!clean) return null;

  let relative;
  if (clean.startsWith("/")) {
    if (!clean.startsWith(basePath)) {
      errors.push(`${path.relative(root, sourceFile)}: root-relative URL is outside ${basePath}: ${raw}`);
      return null;
    }
    relative = clean.slice(basePath.length);
  } else {
    relative = path.relative(root, path.resolve(path.dirname(sourceFile), clean));
  }

  if (relative.endsWith("/")) relative += "index.html";
  if (!path.extname(relative)) relative = path.join(relative, "index.html");
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    errors.push(`${path.relative(root, sourceFile)}: URL escapes the publication root: ${raw}`);
    return null;
  }
  return resolved;
}

function publicProjectionReferenceProblem(value, depth = 0) {
  const reference = String(value ?? "");
  if (/(?:\/Users\/|\/home\/|file:\/\/|unix:\/\/|\\\\|(?:^|[\\/])\.\.(?:[\\/]|$))/i.test(reference)) return "machine-local path or traversal";
  if (/(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{12,}/i.test(reference) || /(?:token|key|secret|password|credential|signature)\s*[=:]\s*[^\s&#]{8,}/i.test(reference)) return "credential-bearing reference";
  if (!/^https?:\/\//i.test(reference)) return null;
  let url;
  try { url = new URL(reference); } catch { return "invalid public URL"; }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host === "::1" || /^::ffff:/i.test(host)
    || /^(?:0|10|127)\./.test(host) || /^169\.254\./.test(host) || /^192\.168\./.test(host)
    || /^172\.(?:1[6-9]|2\d|3[01])\./.test(host) || /^(?:fc|fd|fe8|fe9|fea|feb)/i.test(host)) return "private or local host";
  let fragment = url.hash.slice(1);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const decoded = decodeURIComponent(fragment);
      if (decoded === fragment) break;
      fragment = decoded;
    } catch { break; }
  }
  if (depth < 2) for (const match of fragment.matchAll(/https?:\/\/[^\s<>"')]+/gi)) {
    const nestedProblem = publicProjectionReferenceProblem(match[0], depth + 1);
    if (nestedProblem) return `unsafe URL fragment: ${nestedProblem}`;
  }
  return null;
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

for (const required of ["index.html", "catalog.json", "agents/index.html", "promotion/index.html", "promotion.json", "intelligence/index.html", "intelligence.json", "research/index.html", "research.json", "docs/research-question-model.html", "docs/siso-mission.html", "docs/question-driven-research.html", "docs/frontier-question-template.html", "docs/god-questions-infrastructure.html", "docs/estate-reconciliation.html", "docs/foundry-agency-intelligence.html", "docs/ecosystem-intelligence.html", "docs/100-million-token-program.html", "docs/100-million-token-operating-plan.html", "docs/laptop-estate.html", "estate/index.html", "estate.json", "works/siso-people-graph/index.html", "works/siso-book-library/index.html", "works/frontier-question-gq-010/index.html"]) {
  if (!await exists(path.join(root, required))) errors.push(`missing required page: ${required}`);
}

const catalogProjection = JSON.parse(await readFile(path.join(root, "catalog.json"), "utf8"));
for (const work of catalogProjection.works || []) {
  if (!work.summary || !work.agent_context_url) errors.push(`catalog.json: ${work.id} lacks summary or agent context`);
  const dossierPath = localTarget(work.agent_context_url, path.join(root, "catalog.json"));
  if (!dossierPath || !await exists(dossierPath)) {
    errors.push(`catalog.json: ${work.id} has no generated dossier at ${work.agent_context_url}`);
    continue;
  }
  const dossier = JSON.parse(await readFile(dossierPath, "utf8"));
  if (dossier.work_id !== work.id || !Array.isArray(dossier.evidence) || !Array.isArray(dossier.relationships)) errors.push(`works/${work.slug}/index.json: incomplete Work dossier`);
  if (work.source_links?.some((link) => link.kind === "source_repository" && /^https:\/\/github\.com\/[^/]+\/[^/#]+\/?$/.test(link.url)) && !work.source_links.some((link) => link.kind === "readme")) errors.push(`catalog.json: ${work.id} has a repository but no README action`);
}

const promotionProjection = JSON.parse(await readFile(path.join(root, "promotion.json"), "utf8"));
const agencyPromotion = promotionProjection.campaigns?.find((campaign) => campaign.campaign_id === "foundry-agency-intelligence");
for (const unitId of ["siso-business-control-plane-gaps", "agency-source-module-portfolio"]) {
  const unit = agencyPromotion?.units?.find((candidate) => candidate.id === unitId);
  if (unit?.target_owner_state !== "unassigned" || unit?.target_works?.length !== 0) errors.push(`promotion.json: ${unitId} must retain an unassigned product owner without a target Work link`);
  if (!unit?.evidence_owner_works?.some((owner) => owner.id === "gls:work:ec664d93-df93-48c5-be40-5d0165886c01")) errors.push(`promotion.json: ${unitId} must retain Foundry as its evidence owner`);
}
const coverageUnit = agencyPromotion?.units?.find((candidate) => candidate.id === "foundry-agency-coverage-v0-5-1");
if (!coverageUnit) errors.push("promotion.json: missing Foundry v0.5.1 Agency coverage unit");
else {
  if (coverageUnit.stage !== "candidate" || coverageUnit.target_owner_state !== "unassigned") errors.push("promotion.json: v0.5.1 coverage must remain candidate until an Agency product owner and runtime adoption authority exist");
  if (!coverageUnit.evidence_owner_works?.some((owner) => owner.id === "gls:work:ec664d93-df93-48c5-be40-5d0165886c01")) errors.push("promotion.json: v0.5.1 coverage must retain Foundry as its evidence owner");
  const summary = coverageUnit.evidence?.map((entry) => entry.summary).join(" ") || "";
  for (const marker of ["628 projects", "497 applications", "189 capabilities", "30 frontier rows", "114 multi-vertical", "10 confirmed/79 source-read/408 metadata/131 inferred", "89 source-read/reusable", "Published=coverage inventory + 20-row decision matrix", "analyzed=628 projects with 89 source-read/reusable and 10 confirmed", "specified=10 integration proofs", "runtime-proven=1 named script", "job-level pillar mapping verified", "coverage-inventory.json 1084043 bytes sha256 cc103906478ff1c44a6c96921269d9695afb7f020092b8b54e1e0993efe4552d", "COVERAGE.md 2809 bytes sha256 d1b89a8cc76e6dfb8f55c1ffcce85bbb7fffa532966ba5c42949d79d03554947", "capability-pillar-map.json 74534 bytes sha256 4bacd6a1d198d661506659f38668dbe7810941a7457b55adea6ecd7bff1fe9cc"]) {
    if (!summary.includes(marker)) errors.push(`promotion.json: v0.5.1 coverage receipt missing: ${marker}`);
  }
}
const promotionHtml = await readFile(path.join(root, "promotion", "index.html"), "utf8");
for (const marker of ["No product owner assigned", "Evidence owner Works"]) {
  if (!promotionHtml.includes(marker)) errors.push(`promotion/index.html: missing owner-boundary marker: ${marker}`);
}

const intelligence = JSON.parse(await readFile(path.join(root, "intelligence.json"), "utf8"));
if (intelligence.counts?.decisions < 6) errors.push("intelligence.json: expected the six accepted ADRs through ADR-0006");
if (!intelligence.decisions?.some((decision) => decision.id === "gls:decision:9e6dd4a4-63ab-4042-8c85-d1b38932e573" && decision.decision_key === "ADR-0006")) errors.push("intelligence.json: missing ADR-0006 Cloudflare Pages hosting decision");
if (intelligence.counts?.events < 5) errors.push("intelligence.json: expected the seeded ecosystem events");
if (!intelligence.decisions?.some((decision) => decision.decision_key === "ADR-0004")) errors.push("intelligence.json: missing ADR-0004");
if (!intelligence.decisions?.some((decision) => decision.id === "gls:decision:97c0be80-9ae4-4874-84e9-5f80062f68a8" && decision.decision_key === "ADR-0005")) errors.push("intelligence.json: missing ADR-0005 People Graph ownership boundary");
if (!intelligence.events?.some((event) => event.scope?.snapshot_ids?.includes("gls:snapshot:73ee0c53-7e65-4c1c-9fe8-c990607ebf89"))) errors.push("intelligence.json: Whole Library V24 is not connected to an authored event");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "24.0.0")) errors.push("intelligence.json: automatic registry changelog is missing V24");
if (!intelligence.events?.some((event) => event.id === "gls:event:9c8e46f9-0a2a-4396-bda1-f2a3967c2cb9" && event.status === "completed" && event.scope?.snapshot_ids?.includes("gls:snapshot:a7a99ae1-a2e2-4e44-8fb3-c0235a35023b"))) errors.push("intelligence.json: God Questions infrastructure completion lineage is missing");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "32.0.0" && change.id === "gls:snapshot:a7a99ae1-a2e2-4e44-8fb3-c0235a35023b")) errors.push("intelligence.json: automatic registry changelog is missing V32");
if (!intelligence.events?.some((event) => event.id === "gls:event:dc9d1aef-28e7-4d5a-8a97-3eee45be4cf1" && event.status === "completed" && event.predecessor_event_id === "gls:event:9b09caed-89b4-4c1e-8829-b58cbddeb115" && event.scope?.snapshot_ids?.includes("gls:snapshot:5929e723-9789-4a33-af63-ba472650a522"))) errors.push("intelligence.json: estate reconciliation completion lineage is missing");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "33.0.0" && change.id === "gls:snapshot:5929e723-9789-4a33-af63-ba472650a522")) errors.push("intelligence.json: automatic registry changelog is missing V33");
if (!intelligence.events?.some((event) => event.id === "gls:event:3f79b614-bd24-4b14-89dd-6e822ffc1720" && event.status === "completed" && event.predecessor_event_id === "gls:event:eda7d606-a2c9-4919-83cc-c7358d19fb2f" && event.scope?.snapshot_ids?.includes("gls:snapshot:3c7cb166-8056-48c8-948f-f9cf16d8d69b"))) errors.push("intelligence.json: Foundry Agency intelligence completion lineage is missing");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "34.0.0" && change.id === "gls:snapshot:3c7cb166-8056-48c8-948f-f9cf16d8d69b")) errors.push("intelligence.json: automatic registry changelog is missing V34");
if (!intelligence.events?.some((event) => event.id === "gls:event:4d237823-29e9-4dc1-bcc4-0ebd952ab2b2" && event.status === "completed" && event.predecessor_event_id === "gls:event:3f79b614-bd24-4b14-89dd-6e822ffc1720" && event.scope?.snapshot_ids?.includes("gls:snapshot:39ebc62f-482e-4b1e-89b2-fd278a5a6b2a"))) errors.push("intelligence.json: Foundry Agency value-matrix completion lineage is missing");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "35.0.0" && change.id === "gls:snapshot:39ebc62f-482e-4b1e-89b2-fd278a5a6b2a")) errors.push("intelligence.json: automatic registry changelog is missing V35");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "37.0.0" && change.id === "gls:snapshot:29c1b8ef-d173-4a18-b15b-291412d43fc9")) errors.push("intelligence.json: automatic registry changelog is missing V37");
if (!intelligence.registry_changes?.some((change) => change.kind === "snapshot" && change.version === "38.0.0" && change.id === "gls:snapshot:adfaabc8-ee8f-442c-88ba-64c5879bc623")) errors.push("intelligence.json: automatic registry changelog is missing V38");
for (const [kind, records] of [["release", releaseRecords], ["snapshot", snapshotRecords]]) {
  const expectedIds = records.map((record) => record.id).sort();
  const actualIds = (intelligence.registry_changes || []).filter((change) => change.kind === kind).map((change) => change.id).sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) errors.push(`intelligence.json: ${kind} changelog must cover the exact immutable registry records`);
}
if (!intelligence.events?.some((event) => event.id === "gls:event:3a47e7b6-2974-4a0b-9844-cf9dd6d6289a" && event.status === "completed" && event.scope?.snapshot_ids?.includes("gls:snapshot:adfaabc8-ee8f-442c-88ba-64c5879bc623"))) errors.push("intelligence.json: UNFUCK source-layer publication Event is missing or does not select V38");
if (intelligence.counts?.events !== intelligence.events?.length) errors.push("intelligence.json: Event count does not match the generated Event projection");
if (intelligence.counts?.active_initiatives !== intelligence.active_initiatives?.length) errors.push("intelligence.json: active-initiative count does not match the generated initiative projection");
for (const threadId of [
  "gls:thread:unsolveable-mathematics-program",
  "gls:thread:remote-viewing-research-module",
  "gls:thread:declassified-government-records-department"
]) {
  if (!intelligence.active_initiatives?.some((initiative) => initiative.thread_id === threadId)) errors.push(`intelligence.json: expected active initiative ${threadId}`);
}
if (intelligence.active_initiatives?.some((initiative) => initiative.thread_id === "gls:thread:foundry-agency-intelligence")) errors.push("intelligence.json: completed Foundry Agency intelligence initiative remains active");
if (intelligence.active_initiatives?.some((initiative) => initiative.thread_id === "gls:thread:people-graph-parallel-expansion")) errors.push("intelligence.json: People Graph parallel initiative must NOT be projected as active — closed by the 2026-08-08 integration Event");
if (!intelligence.events?.some((event) => event.id === "gls:event:f7dbd510-879c-405b-9cac-58d3dd598501" && event.status === "active" && event.scope?.snapshot_ids?.includes("gls:snapshot:29c1b8ef-d173-4a18-b15b-291412d43fc9") && event.scope?.decision_ids?.includes("gls:decision:97c0be80-9ae4-4874-84e9-5f80062f68a8"))) errors.push("intelligence.json: People Graph launch Event is missing its V37 and ADR-0005 lineage");

const frontierQuestions = [
  ["GQ-001", "frontier-question-agent-workspace"],
  ["GQ-002", "frontier-question-agent-layer-efficiency"],
  ["GQ-004", "frontier-question-best-software-primitive"],
  ["GQ-005", "frontier-question-field-momentum"],
  ["GQ-006", "frontier-question-information-organ"],
  ["GQ-008", "frontier-question-model-routing"],
  ["GQ-009", "frontier-question-god-questions-infrastructure"],
  ["GQ-010", "frontier-question-gq-010"],
];
const researchIndex = await readFile(path.join(root, "research/index.html"), "utf8");
const researchProjection = JSON.parse(await readFile(path.join(root, "research.json"), "utf8"));
if (!researchIndex.includes("Frontier Questions · God Questions")) errors.push("research/index.html: missing Frontier Questions section");
if (!researchIndex.includes("God Questions Observatory")) errors.push("research/index.html: missing God Questions Observatory portfolio state");
if (!researchIndex.includes("/research.json")) errors.push("research/index.html: missing agent-readable Observatory JSON link");
if (!researchIndex.includes("Program substrate.</b> 3 questions · 7 assumptions · 10 evidence connections · 8 action/learning links.")) errors.push("research/index.html: missing program substrate coverage");
if (!researchIndex.includes("versioned-answer contracts. Metadata seed Releases are not accepted answers.")) errors.push("research/index.html: answer maturity boundary is missing");
if (researchIndex.includes("explicit evidence scopes, and versioned answers.")) errors.push("research/index.html: metadata seeds are overstated as accepted versioned answers");
for (const [field, expected] of Object.entries({ questions: 8, programmed_questions: 3, assumptions: 7, evidence_connections: 10, challenge_edges: 2, action_learning_links: 8, public_answers_released: 0 })) {
  if (researchProjection.counts?.[field] !== expected) errors.push(`research.json: expected ${field}=${expected}, found ${researchProjection.counts?.[field]}`);
}
if (researchProjection.snapshot_version !== selectedSnapshot?.version || researchProjection.snapshot_id !== selectedSnapshot?.id) errors.push("research.json: must identify the latest numeric registry snapshot");
for (const [questionId, state, assumptions, evidence, links] of [
  ["GQ-001", "partial", 2, 2, 1],
  ["GQ-002", "partial", 2, 2, 1],
  ["GQ-009", "researching", 3, 6, 6],
  ["GQ-010", "scoped", 0, 0, 0],
]) {
  const question = researchProjection.questions?.find((entry) => entry.question_id === questionId);
  if (!question) { errors.push(`research.json: missing ${questionId}`); continue; }
  if (question.research_state !== state) errors.push(`research.json: ${questionId} research state changed from ${state}`);
  if (question.selected_release?.release_kind !== "question_program_metadata" || question.selected_release?.public_answer_state !== "not_released" || question.selected_release?.artifact_count !== 1) errors.push(`research.json: ${questionId} program metadata Release is missing or inflated into a public answer`);
  if (questionId === "GQ-009" && question.selected_release?.id !== "gls:release:df8a236d-b092-4d51-9e17-d1016671db64") errors.push("research.json: GQ-009 estate reconciliation program Release is not selected");
  if (questionId === "GQ-010" && question.selected_release?.id !== "gls:release:f8ddbc97-e795-474a-b9c1-e508bd9e1787") errors.push("research.json: GQ-010 People Graph program Release is not selected");
  if (question.authoring_metrics?.assumptions !== assumptions || question.authoring_metrics?.evidence_connections !== evidence || question.authoring_metrics?.action_learning_links !== links) errors.push(`research.json: ${questionId} program fixture counts changed unexpectedly`);
}
for (const question of researchProjection.questions ?? []) {
  if (!question.steward || question.steward === "Unassigned") errors.push(`research.json: ${question.question_id} has no named steward`);
  if (!question.lifecycle_status) errors.push(`research.json: ${question.question_id} has no lifecycle status`);
  if (!question.freshness?.state || !question.freshness?.as_of) errors.push(`research.json: ${question.question_id} has no explicit freshness read model`);
  if (!question.next_useful_work || question.next_useful_work.length < 10) errors.push(`research.json: ${question.question_id} has no explicit next useful work`);
  if (question.source_works?.length !== question.source_work_ids?.length) errors.push(`research.json: ${question.question_id} does not resolve every source Work`);
  for (const sourceWork of question.source_works || []) {
    if (!sourceWork.work_id || !sourceWork.name || !sourceWork.library_url) errors.push(`research.json: ${question.question_id} has an incomplete source Work projection`);
  }
  const program = question.program;
  if (!program) continue;
  if (program.next_useful_work !== question.next_useful_work) errors.push(`research.json: ${question.question_id} next-work projection diverges from registry program`);
  for (const connection of program.evidence_connections) if (connection.publication_state !== "public_safe_metadata") errors.push(`research.json: ${question.question_id} projects evidence without a public-safe metadata assertion`);
  for (const reference of [
    ...program.evidence_connections.flatMap((entry) => [entry.reference, entry.provenance_receipt, entry.revision_or_digest]),
    ...program.action_learning_links.map((entry) => entry.reference),
  ]) {
    const problem = publicProjectionReferenceProblem(reference);
    if (problem) errors.push(`research.json: ${question.question_id} exposes ${problem}`);
  }
}
for (const [document, marker] of [
  ["docs/siso-mission.html", "The Great Library of SISO</td><td>Provides durable public identities"],
  ["docs/question-driven-research.html", "The ten-pass first-principles loop"],
  ["docs/frontier-question-template.html", "Worked example · composable CRM"],
  ["docs/god-questions-infrastructure.html", "The smallest stable first tranche"],
  ["docs/estate-reconciliation.html", "Four reviewed outcomes"],
]) {
  const documentHtml = await readFile(path.join(root, document), "utf8");
  if (!documentHtml.includes(marker)) errors.push(`${document}: missing contract marker: ${marker}`);
  if (!researchIndex.includes(`/${document}`)) errors.push(`research/index.html: missing ${document} link`);
}
const infrastructureHtml = await readFile(path.join(root, "docs/god-questions-infrastructure.html"), "utf8");
for (const marker of ["One canonical object graph", "Assumption graph and circuit breakers", "Cross-source contradiction radar", "research-swarm compiler", "evidence-aware context compiler", "Proof-carrying execution", "Causal agent lineage", "Capability genome and promotion", "Counterfactual portfolio twin", "Learning Capital Market", "Existing, first tranche, later, and rejected"]) {
  if (!infrastructureHtml.includes(marker)) errors.push(`docs/god-questions-infrastructure.html: missing architecture marker: ${marker}`);
}
if (!infrastructureHtml.includes("GQ-009 remains <code>researching</code>")) errors.push("docs/god-questions-infrastructure.html: GQ-009 answer-maturity boundary is missing");
const reconciliationHtml = await readFile(path.join(root, "docs/estate-reconciliation.html"), "utf8");
for (const marker of ["d6290c609a6922e14b3faa27019aae31628686cb", "9d17865406419460335bdfbcdacfcc64dcb9cb5f", "0293b671eefd20978f335b03347e30b38e891367", "54088f53c09b4f9764eef2555fdd27bcf9149c10", "link_existing / no_change", "owner_active_deferred / evidence_review", "not_adjudicated", "GQ-009 remains <code>researching</code>"]) {
  if (!reconciliationHtml.includes(marker)) errors.push(`docs/estate-reconciliation.html: missing reconciliation marker: ${marker}`);
}
const programHtml = await readFile(path.join(root, "docs/100-million-token-program.html"), "utf8");
for (const marker of ["The 100 Million Token Program", "No. They should run as a dependency-aware portfolio.", "awaiting operator approval", "question-driven research architecture"]) {
  if (!programHtml.includes(marker)) errors.push(`docs/100-million-token-program.html: missing contract marker: ${marker}`);
}
const operatingPlanHtml = await readFile(path.join(root, "docs/100-million-token-operating-plan.html"), "utf8");
for (const marker of ["Build-first orientation", "Distribute the complete Stack", "P13 · Outside-user distribution", "Foundry discovery campaign", "rights-aware candidate metadata"]) {
  if (!operatingPlanHtml.includes(marker)) errors.push(`docs/100-million-token-operating-plan.html: missing build-first marker: ${marker}`);
}
const foundryAgencyHtml = await readFile(path.join(root, "docs/foundry-agency-intelligence.html"), "utf8");
for (const marker of ["Foundry is the source-intelligence engine", "Source-owned modules", "Foundry does not become the system of record", "SISO Agency OS", "879 adoption records remain unresolved"]) {
  if (!foundryAgencyHtml.includes(marker)) errors.push(`docs/foundry-agency-intelligence.html: missing Agency intelligence marker: ${marker}`);
}
for (const [questionId, slug] of frontierQuestions) {
  const questionPath = path.join(root, "works", slug, "index.html");
  if (!await exists(questionPath)) {
    errors.push(`missing Frontier Question page: works/${slug}/index.html`);
    continue;
  }
  if (!researchIndex.includes(`/works/${slug}/`)) errors.push(`research/index.html: missing ${questionId} link`);
  const questionPage = await readFile(questionPath, "utf8");
  if (!questionPage.includes(`Research contract · ${questionId}`)) errors.push(`works/${slug}/index.html: missing ${questionId} research contract`);
  if (!questionPage.includes("Research sources")) errors.push(`works/${slug}/index.html: missing dereferenceable Research sources`);
  if (!questionPage.includes("Public answer release</span><p>Not released")) errors.push(`works/${slug}/index.html: metadata seed is not explicitly separated from a public answer`);
}
const infrastructureQuestion = await readFile(path.join(root, "works/frontier-question-god-questions-infrastructure/index.html"), "utf8");
for (const marker of ["Steward", "Lifecycle status", "Freshness", "Next useful work", "Decision to change", "Success criteria", "Falsifiers", "Evidence gaps", "Watch triggers", "Research state", "Assumptions · 3", "Evidence connections · 6", "Action and learning lineage · 6", "EC-GQ009-ESTATE-RECONCILIATION", "AL-GQ009-ESTATE-LEARNING", "QA-GQ009-METADATA-VALUE · QA · challenged", "QA-GQ009-OWNER-BOUNDARY · QA · challenged", "execution mandate · approved scope", "observation receipt · observation only", "learning return · learning proposal", "Truth: not adjudicated", "Read the God Questions infrastructure constitution"]) {
  if (!infrastructureQuestion.includes(marker)) errors.push(`GQ-009 page: missing program field ${marker}`);
}
if (infrastructureQuestion.includes("<b>Public answer:</b> released")) errors.push("GQ-009 page: researching metadata is inflated into a released answer");
if (!infrastructureQuestion.includes("https://github.com/sisodias/great-library-of-siso")) errors.push("GQ-009 page: missing the current Great Library source repository");
const foundryPage = await readFile(path.join(root, "works/siso-foundry/index.html"), "utf8");
for (const marker of ["Read README", "Open machine-readable dossier", "Evidence &amp; receipts", "Foundry 0.4.0 publishes the repository-by-use-case-by-route value matrix"]) {
  if (!foundryPage.includes(marker)) errors.push(`SISO Foundry page: missing learning affordance ${marker}`);
}
const knowledgePage = await readFile(path.join(root, "works/siso-knowledge/index.html"), "utf8");
if (!knowledgePage.includes("Foundry is an independently released discovery and source-mining Work")) errors.push("SISO Knowledge page: relationship context was discarded");

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  if (!html.includes("Built by the SISO Open Source Foundation") || !html.includes("Funded by SISO Agency")) {
    errors.push(`${relative}: missing exact public attribution`);
  }
  if (/A SISO Open project/i.test(html)) errors.push(`${relative}: contains retired project wording`);
  if (/(?:google-analytics\.com|googletagmanager\.com|plausible\.io|vercel-insights)/i.test(html)) {
    errors.push(`${relative}: contains an unapproved analytics endpoint`);
  }

  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const target = localTarget(match[1], file);
    if (target && !await exists(target)) errors.push(`${relative}: broken local reference ${match[1]}`);
  }
}

if (errors.length) {
  console.error(`Site check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site check passed: ${htmlFiles.length} HTML pages, ${files.length} published files, base ${basePath}`);
