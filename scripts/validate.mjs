#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (message) => errors.push(message);
if (Number(process.versions.node.split(".")[0]) < 20) fail(`Node 20+ required; found ${process.versions.node}`);

async function jsonFiles(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

async function load(file) {
  const raw = await readFile(file, "utf8");
  try { return { file, raw, value: JSON.parse(raw) }; }
  catch (error) { fail(`${path.relative(root, file)}: invalid JSON: ${error.message}`); return { file, raw, value: null }; }
}

const schemaEntries = await Promise.all((await jsonFiles("schemas")).map(load));
const schemaByFile = new Map(schemaEntries.filter((entry) => entry.value).map((entry) => [entry.file, entry.value]));
for (const { file, value } of schemaEntries) {
  if (!value) continue;
  if (value.$schema !== "https://json-schema.org/draft/2020-12/schema") fail(`${path.relative(root, file)}: must declare JSON Schema 2020-12`);
  if (typeof value.$id !== "string") fail(`${path.relative(root, file)}: missing $id`);
}

function resolvePointer(document, pointer) {
  return pointer.split("/").slice(1).reduce((value, token) => value?.[token.replaceAll("~1", "/").replaceAll("~0", "~")], document);
}

function resolveRef(ref, schemaFile) {
  const [filePart, fragment = ""] = ref.split("#");
  const targetFile = filePart ? path.resolve(path.dirname(schemaFile), filePart) : schemaFile;
  const document = schemaByFile.get(targetFile);
  return { schema: fragment ? resolvePointer(document, fragment) : document, schemaFile: targetFile };
}

function validateValue(value, schema, location, schemaFile) {
  if (!schema) return fail(`${location}: unresolved schema reference`);
  if (schema.$ref) {
    const target = resolveRef(schema.$ref, schemaFile);
    return validateValue(value, target.schema, location, target.schemaFile);
  }
  if (Object.hasOwn(schema, "const") && value !== schema.const) fail(`${location}: expected constant ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) fail(`${location}: expected one of ${schema.enum.join(", ")}`);
  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return fail(`${location}: expected object`);
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) fail(`${location}: missing required property ${key}`);
    if (schema.additionalProperties === false) for (const key of Object.keys(value)) if (!Object.hasOwn(schema.properties ?? {}, key)) fail(`${location}: unexpected property ${key}`);
    for (const [key, child] of Object.entries(schema.properties ?? {})) if (Object.hasOwn(value, key)) validateValue(value[key], child, `${location}.${key}`, schemaFile);
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return fail(`${location}: expected array`);
    if (schema.minItems !== undefined && value.length < schema.minItems) fail(`${location}: expected at least ${schema.minItems} items`);
    value.forEach((item, index) => validateValue(item, schema.items ?? {}, `${location}[${index}]`, schemaFile));
  } else if (schema.type === "string") {
    if (typeof value !== "string") return fail(`${location}: expected string`);
    if (schema.minLength !== undefined && value.length < schema.minLength) fail(`${location}: string is too short`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) fail(`${location}: does not match ${schema.pattern}`);
    if (schema.format === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(`${location}: expected YYYY-MM-DD`);
    if (schema.format === "date-time" && Number.isNaN(Date.parse(value))) fail(`${location}: expected date-time`);
    if (schema.format === "uri") { try { new URL(value); } catch { fail(`${location}: expected URI`); } }
  } else if (schema.type === "integer") {
    if (!Number.isInteger(value)) return fail(`${location}: expected integer`);
    if (schema.minimum !== undefined && value < schema.minimum) fail(`${location}: expected >= ${schema.minimum}`);
  } else if (schema.type === "boolean" && typeof value !== "boolean") fail(`${location}: expected boolean`);
}

const recordGroups = {
  work: { directory: "registry/works", schema: path.join(root, "schemas/work.schema.json") },
  release: { directory: "registry/releases", schema: path.join(root, "schemas/release.schema.json") },
  assembly: { directory: "registry/assemblies", schema: path.join(root, "schemas/assembly.schema.json") },
  source_inventory: { directory: "registry/source-inventories", schema: path.join(root, "schemas/source-inventory.schema.json") },
  snapshot: { directory: "registry/snapshots", schema: path.join(root, "schemas/snapshot.schema.json") },
  decision: { directory: "registry/decisions", schema: path.join(root, "schemas/decision.schema.json") },
  event: { directory: "registry/events", schema: path.join(root, "schemas/event.schema.json") }
};
const records = {};
for (const [kind, config] of Object.entries(recordGroups)) {
  const entries = await Promise.all((await jsonFiles(config.directory)).map(load));
  records[kind] = entries.filter((entry) => entry.value);
  for (const entry of records[kind]) {
    const location = path.relative(root, entry.file);
    validateValue(entry.value, schemaByFile.get(config.schema), location, config.schema);
    if (entry.value.record_type !== kind) fail(`${location}: record_type must be ${kind}`);
  }
}

function uniqueMap(entries, label) {
  const map = new Map();
  for (const entry of entries) {
    if (map.has(entry.value.id)) fail(`${label}: duplicate id ${entry.value.id}`);
    map.set(entry.value.id, entry);
  }
  return map;
}

function publicReferenceProblem(value) {
  const reference = String(value ?? "");
  if (/^(?:\/|~\/|[A-Za-z]:[\\/])/.test(reference) || /(?:\/Users\/|\/home\/)/.test(reference)) return "machine-local path";
  if (/^(?:file|unix|data|javascript):/i.test(reference)) return "unsafe URI scheme";
  if (!/^https?:\/\//i.test(reference)) return null;
  let url;
  try { url = new URL(reference); } catch { return "invalid public URL"; }
  if (url.username || url.password) return "URL userinfo";
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host === "::1"
    || /^(?:0|10|127)\./.test(host) || /^169\.254\./.test(host) || /^192\.168\./.test(host)
    || /^172\.(?:1[6-9]|2\d|3[01])\./.test(host) || /^(?:fc|fd|fe8|fe9|fea|feb)/i.test(host)) return "private or local host";
  for (const [key, entry] of url.searchParams) if (/(?:token|key|secret|password|credential|signature)/i.test(key) || /(?:ghp|github_pat|sk)-[A-Za-z0-9_-]{12,}/.test(entry)) return "credential-bearing query";
  return null;
}

function validateAcyclic(items, edgeField, label) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) { fail(`${label}: ${edgeField} cycle includes ${id}`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of byId.get(id)?.[edgeField] ?? []) if (byId.has(dependency)) visit(dependency);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) visit(id);
}

const works = uniqueMap(records.work, "works");
const releases = uniqueMap(records.release, "releases");
const assemblies = uniqueMap(records.assembly, "assemblies");
const sourceInventories = uniqueMap(records.source_inventory, "source inventories");
const snapshots = uniqueMap(records.snapshot, "snapshots");
const decisions = uniqueMap(records.decision, "decisions");
const events = uniqueMap(records.event, "events");
const promotionLifecycle = ["unverified", "read", "candidate", "owner_assigned", "extracted", "verified", "released", "library_indexed", "stack_pinned", "retired"];
const stackDistributionWorkId = "gls:work:b9196c61-901f-4105-93d9-899876d17016";
const artifactIds = new Set();
const questionIds = new Set();
for (const { file, value: work } of records.work) {
  const label = path.relative(root, file);
  if (work.work_type === "module") fail(`${path.relative(root, file)}: module must be a contextual projection role, never a Work type`);
  for (const relation of work.relationships ?? []) if (!works.has(relation.target_work_id)) fail(`${path.relative(root, file)}: relationship target ${relation.target_work_id} does not resolve`);
  if (work.work_type === "research_question" && !work.research_contract) fail(`${path.relative(root, file)}: research_question Work requires research_contract`);
  if (work.research_contract && work.work_type !== "research_question") fail(`${path.relative(root, file)}: research_contract is reserved for research_question Works`);
  for (const sourceWorkId of work.research_contract?.source_work_ids ?? []) if (!works.has(sourceWorkId)) fail(`${path.relative(root, file)}: research source Work ${sourceWorkId} does not resolve`);
  if (work.research_contract) {
    const questionId = work.research_contract.question_id;
    if (questionIds.has(questionId)) fail(`${label}: duplicate question_id ${questionId}`);
    questionIds.add(questionId);
  }
  const program = work.research_contract?.program;
  if (!program) continue;
  const assumptionMap = new Map();
  for (const assumption of program.assumptions) {
    if (assumptionMap.has(assumption.id)) fail(`${label}: duplicate assumption id ${assumption.id}`);
    assumptionMap.set(assumption.id, assumption);
  }
  const evidenceMap = new Map();
  for (const connection of program.evidence_connections) {
    if (evidenceMap.has(connection.id)) fail(`${label}: duplicate evidence connection id ${connection.id}`);
    evidenceMap.set(connection.id, connection);
  }
  const actionMap = new Map();
  for (const link of program.action_learning_links) {
    if (actionMap.has(link.id)) fail(`${label}: duplicate action/learning link id ${link.id}`);
    actionMap.set(link.id, link);
  }
  for (const assumption of program.assumptions) {
    for (const dependency of assumption.depends_on ?? []) {
      if (dependency === assumption.id) fail(`${label}: assumption ${assumption.id} cannot depend on itself`);
      else if (!assumptionMap.has(dependency)) fail(`${label}: assumption ${assumption.id} depends on unknown assumption ${dependency}`);
    }
    if (assumption.supersedes === assumption.id) fail(`${label}: assumption ${assumption.id} cannot supersede itself`);
    else if (assumption.supersedes && !assumptionMap.has(assumption.supersedes)) fail(`${label}: assumption ${assumption.id} supersedes unknown assumption ${assumption.supersedes}`);
    for (const evidenceId of assumption.evidence_connection_ids ?? []) if (!evidenceMap.has(evidenceId)) fail(`${label}: assumption ${assumption.id} references unknown evidence connection ${evidenceId}`);
  }
  validateAcyclic(program.assumptions, "depends_on", `${label}: assumption graph`);
  for (const connection of program.evidence_connections) {
    if (!works.has(connection.owning_work_id)) fail(`${label}: evidence connection ${connection.id} owner Work ${connection.owning_work_id} does not resolve`);
    const supports = connection.supports_assumption_ids ?? [];
    const challenges = connection.challenges_assumption_ids ?? [];
    if (!supports.length && !challenges.length) fail(`${label}: evidence connection ${connection.id} must support or challenge an assumption`);
    for (const assumptionId of [...supports, ...challenges]) if (!assumptionMap.has(assumptionId)) fail(`${label}: evidence connection ${connection.id} references unknown assumption ${assumptionId}`);
    for (const assumptionId of supports) if (challenges.includes(assumptionId)) fail(`${label}: evidence connection ${connection.id} cannot both support and challenge ${assumptionId}`);
    for (const [field, reference] of [["reference", connection.reference], ["provenance_receipt", connection.provenance_receipt], ["revision_or_digest", connection.revision_or_digest]]) {
      const problem = publicReferenceProblem(reference);
      if (problem) fail(`${label}: evidence connection ${connection.id} ${field} contains ${problem}`);
    }
  }
  const actionRules = {
    epistemic_demand: { authority: "demand_only", owners: new Set(["question_steward"]), statuses: new Set(["proposed"]) },
    action_candidate: { authority: "proposal_only", owners: new Set(["operating_architecture"]), statuses: new Set(["proposed", "rejected"]) },
    execution_mandate: { authority: "approved_scope", owners: new Set(["decision_owner"]), statuses: new Set(["approved", "expired"]) },
    observation_receipt: { authority: "observation_only", owners: new Set(["runtime", "independent_verifier"]), statuses: new Set(["executed", "verified"]) },
    learning_return: { authority: "learning_proposal", owners: new Set(["evidence_engine", "question_steward"]), statuses: new Set(["proposed", "no_change", "reopen_proposed"]) }
  };
  const actionOrder = { epistemic_demand: 0, action_candidate: 1, execution_mandate: 2, observation_receipt: 3, learning_return: 4 };
  for (const link of program.action_learning_links) {
    const rule = actionRules[link.object_type];
    if (link.authority_state !== rule.authority) fail(`${label}: ${link.object_type} ${link.id} must use authority_state ${rule.authority}`);
    if (!rule.owners.has(link.owner_role)) fail(`${label}: ${link.object_type} ${link.id} cannot be owned by ${link.owner_role}`);
    if (!rule.statuses.has(link.status)) fail(`${label}: ${link.object_type} ${link.id} cannot use status ${link.status}`);
    if (link.object_type === "execution_mandate" && (!link.expires_at || !link.content_sha256)) fail(`${label}: execution mandate ${link.id} requires expires_at and content_sha256`);
    if (link.object_type !== "execution_mandate" && link.expires_at) fail(`${label}: only an execution mandate may declare expires_at`);
    const problem = publicReferenceProblem(link.reference);
    if (problem) fail(`${label}: action/learning link ${link.id} reference contains ${problem}`);
    for (const predecessorId of link.predecessor_ids ?? []) {
      const predecessor = actionMap.get(predecessorId);
      if (!predecessor) fail(`${label}: action/learning link ${link.id} references unknown predecessor ${predecessorId}`);
      else if (actionOrder[predecessor.object_type] >= actionOrder[link.object_type]) fail(`${label}: action/learning link ${link.id} predecessor ${predecessorId} does not precede ${link.object_type}`);
    }
    for (const assumptionId of link.related_assumption_ids ?? []) if (!assumptionMap.has(assumptionId)) fail(`${label}: action/learning link ${link.id} references unknown assumption ${assumptionId}`);
  }
  validateAcyclic(program.action_learning_links, "predecessor_ids", `${label}: action/learning graph`);
}
for (const { file, value: release } of records.release) {
  const label = path.relative(root, file);
  if (!works.has(release.work_id)) fail(`${label}: work_id ${release.work_id} does not resolve`);
  for (const state of Object.values(release.distribution ?? {})) if (state.state === "verified" && state.evidence.length === 0) fail(`${label}: verified distribution state requires evidence`);
  for (const artifact of release.artifacts ?? []) {
    if (artifactIds.has(artifact.id)) fail(`${label}: duplicate artifact id ${artifact.id}`);
    artifactIds.add(artifact.id);
    if (artifact.integrity.state === "verified" && !artifact.integrity.digest) fail(`${label}: verified artifact integrity requires a digest`);
    if (artifact.ownership === "external" && artifact.owner.toLowerCase().includes("siso")) fail(`${label}: external artifact owner must be preserved`);
  }
}
for (const { file, value: assembly } of records.assembly) {
  const label = path.relative(root, file);
  if (!works.has(assembly.section_work_id)) fail(`${label}: section_work_id ${assembly.section_work_id} does not resolve`);
  const componentIds = new Set();
  for (const component of assembly.components ?? []) {
    if (componentIds.has(component.component_id)) fail(`${label}: duplicate component_id ${component.component_id}`);
    componentIds.add(component.component_id);
    if (!works.has(component.work_id)) fail(`${label}: component Work ${component.work_id} does not resolve`);
  }
  for (const component of assembly.components ?? []) {
    for (const dependency of component.depends_on ?? []) if (!componentIds.has(dependency)) fail(`${label}: component ${component.component_id} depends on unknown component ${dependency}`);
  }
  const steps = new Set();
  for (const stage of assembly.operating_loop ?? []) {
    if (steps.has(stage.step)) fail(`${label}: duplicate operating_loop step ${stage.step}`);
    steps.add(stage.step);
    for (const componentId of stage.component_ids ?? []) if (!componentIds.has(componentId)) fail(`${label}: operating_loop step ${stage.step} references unknown component ${componentId}`);
  }
}
for (const { file, value: inventory } of records.source_inventory) {
  const label = path.relative(root, file);
  const hasSingleSource = Boolean(inventory.source_work_id);
  const hasSourceScopes = Boolean(inventory.source_scopes?.length);
  if (hasSingleSource === hasSourceScopes) fail(`${label}: declare exactly one of source_work_id or source_scopes`);
  if ((!inventory.preservation.dirty_state || inventory.preservation.dirty_state === "known") && !Number.isInteger(inventory.preservation.dirty_entries)) {
    fail(`${label}: known preservation state requires dirty_entries`);
  }
  if (hasSingleSource && !works.has(inventory.source_work_id)) fail(`${label}: source_work_id ${inventory.source_work_id} does not resolve`);
  const scopeIds = new Set();
  for (const scope of inventory.source_scopes ?? []) {
    if (scopeIds.has(scope.scope_id)) fail(`${label}: duplicate source scope ${scope.scope_id}`);
    scopeIds.add(scope.scope_id);
    if (scope.source_type === "work" && !scope.work_id) fail(`${label}: Work source scope ${scope.scope_id} requires work_id`);
    if (scope.work_id && !works.has(scope.work_id)) fail(`${label}: source scope ${scope.scope_id} Work ${scope.work_id} does not resolve`);
  }
  if (inventory.campaign) {
    if (!works.has(inventory.campaign.owner_work_id)) fail(`${label}: campaign owner Work ${inventory.campaign.owner_work_id} does not resolve`);
    if (JSON.stringify(inventory.campaign.lifecycle) !== JSON.stringify(promotionLifecycle)) fail(`${label}: campaign lifecycle must use the canonical ordered stages`);
  }
  if (inventory.inventory_kind === "agent_capabilities") {
    if (inventory.immutable !== true) fail(`${label}: agent capability inventories must be immutable`);
    if (!inventory.campaign) fail(`${label}: agent capability inventories require campaign metadata`);
    if (!hasSourceScopes) fail(`${label}: agent capability inventories require source_scopes`);
  }
  if (inventory.supersedes_inventory_id) {
    const predecessor = sourceInventories.get(inventory.supersedes_inventory_id)?.value;
    if (!predecessor) fail(`${label}: supersedes_inventory_id ${inventory.supersedes_inventory_id} does not resolve`);
    else {
      if (predecessor.id === inventory.id) fail(`${label}: inventory cannot supersede itself`);
      if (predecessor.inventory_kind !== inventory.inventory_kind) fail(`${label}: successor inventory_kind must match its predecessor`);
      if (predecessor.campaign?.campaign_id !== inventory.campaign?.campaign_id) fail(`${label}: successor campaign_id must match its predecessor`);
      if (predecessor.observed_at >= inventory.observed_at) fail(`${label}: successor observed_at must be later than its predecessor`);
    }
  }
  const unitIds = new Set();
  for (const unit of inventory.units ?? []) {
    if (unitIds.has(unit.unit_id)) fail(`${label}: duplicate unit_id ${unit.unit_id}`);
    unitIds.add(unit.unit_id);
    if (hasSourceScopes && !scopeIds.has(unit.source_scope_id)) fail(`${label}: unit ${unit.unit_id} references unknown source scope ${unit.source_scope_id}`);
    for (const logicalPath of unit.paths ?? []) {
      if (logicalPath.startsWith("/") || logicalPath.includes("..") || logicalPath.includes("\\")) fail(`${label}: unit ${unit.unit_id} path must be a machine-neutral logical path`);
    }
    if (inventory.inventory_kind === "agent_capabilities" && !unit.promotion) fail(`${label}: agent capability unit ${unit.unit_id} requires promotion metadata`);
    if (unit.promotion) {
      for (const targetWorkId of unit.promotion.target_work_ids ?? []) {
        if (!works.has(targetWorkId)) fail(`${label}: unit ${unit.unit_id} promotion target Work ${targetWorkId} does not resolve`);
      }
      const stage = unit.promotion.stage;
      const stageRank = promotionLifecycle.indexOf(stage);
      const isRetired = stage === "retired";
      const evidenceByReference = new Map(unit.evidence.map((entry) => [entry.reference, entry]));
      if (!isRetired && stageRank >= promotionLifecycle.indexOf("verified")) {
        if (!unit.promotion.verification_evidence_refs?.length) fail(`${label}: verified-or-later unit ${unit.unit_id} requires bound verification_evidence_refs`);
        for (const reference of unit.promotion.verification_evidence_refs ?? []) {
          const evidence = evidenceByReference.get(reference);
          if (!evidence || !["integration_check", "registry_validation", "release_receipt"].includes(evidence.kind)) fail(`${label}: unit ${unit.unit_id} verification reference ${reference} must resolve to executable or receipt evidence`);
        }
      }
      let owningRelease;
      if (!isRetired && stageRank >= promotionLifecycle.indexOf("released")) {
        owningRelease = releases.get(unit.promotion.release_id)?.value;
        if (!owningRelease) fail(`${label}: released-or-later unit ${unit.unit_id} requires a resolving release_id`);
        else if (!unit.promotion.target_work_ids.includes(owningRelease.work_id)) fail(`${label}: unit ${unit.unit_id} release Work must be one of its target Works`);
      }
      let selectedSnapshot;
      if (!isRetired && stageRank >= promotionLifecycle.indexOf("library_indexed")) {
        selectedSnapshot = snapshots.get(unit.promotion.snapshot_id)?.value;
        if (!selectedSnapshot) fail(`${label}: library-indexed-or-later unit ${unit.unit_id} requires a resolving snapshot_id`);
        else if (!selectedSnapshot.releases.some((pin) => pin.release_id === unit.promotion.release_id)) fail(`${label}: unit ${unit.unit_id} snapshot must select its release_id`);
      }
      if (stage === "stack_pinned") {
        const stackPin = unit.promotion.stack_pin;
        if (!stackPin) {
          fail(`${label}: stack-pinned unit ${unit.unit_id} requires a structured stack_pin receipt`);
          continue;
        }
        const stackRelease = releases.get(stackPin.stack_release_id)?.value;
        if (!stackRelease || stackRelease.work_id !== stackDistributionWorkId) fail(`${label}: stack-pinned unit ${unit.unit_id} requires a SISO Agent Stack Distribution release_id`);
        else if (!selectedSnapshot?.releases.some((pin) => pin.release_id === stackRelease.id)) fail(`${label}: unit ${unit.unit_id} snapshot must select its Stack Distribution release`);
        if (stackPin.component_release_id !== unit.promotion.release_id || stackPin.component_work_id !== owningRelease?.work_id) fail(`${label}: unit ${unit.unit_id} stack pin must bind the selected component Work and Release`);
        if (!owningRelease?.artifacts.some((artifact) => artifact.revision === stackPin.component_revision)) fail(`${label}: unit ${unit.unit_id} stack pin component_revision must match its Release artifact`);
        const stackRevision = stackRelease?.artifacts.find((artifact) => artifact.revision)?.revision;
        if (!stackRevision || !stackPin.manifest_locator.includes(stackRevision)) fail(`${label}: unit ${unit.unit_id} stack manifest locator must be pinned to the Stack Release revision`);
        const manifestArtifact = stackRelease?.artifacts.find((artifact) => artifact.locator === stackPin.manifest_locator
          && artifact.revision === stackRevision
          && artifact.integrity.state === "verified"
          && artifact.integrity.algorithm === "sha256"
          && artifact.integrity.digest === stackPin.manifest_sha256);
        if (!manifestArtifact) fail(`${label}: unit ${unit.unit_id} stack manifest locator and digest must match a verified Stack Release artifact`);
        const stackEvidence = evidenceByReference.get(stackPin.evidence_reference);
        if (!stackEvidence || stackEvidence.kind !== "release_receipt" || stackPin.evidence_reference !== stackPin.manifest_locator) fail(`${label}: stack-pinned unit ${unit.unit_id} requires a release_receipt bound to its manifest locator`);
        if (stackEvidence && (!stackEvidence.summary.includes(stackPin.component_revision) || !stackEvidence.summary.includes(stackRevision))) fail(`${label}: unit ${unit.unit_id} stack receipt summary must bind component and Stack revisions`);
      }
    }
  }
}
const capabilityCampaigns = new Map();
for (const { value: inventory } of records.source_inventory.filter((entry) => entry.value.inventory_kind === "agent_capabilities")) {
  const campaignId = inventory.campaign.campaign_id;
  if (!capabilityCampaigns.has(campaignId)) capabilityCampaigns.set(campaignId, []);
  capabilityCampaigns.get(campaignId).push(inventory);
}
for (const [campaignId, inventories] of capabilityCampaigns) {
  const supersededIds = new Set(inventories.map((inventory) => inventory.supersedes_inventory_id).filter(Boolean));
  const heads = inventories.filter((inventory) => !supersededIds.has(inventory.id));
  if (heads.length !== 1) fail(`agent capability campaign ${campaignId}: expected exactly one active inventory head, found ${heads.length}`);
  const successorCounts = new Map();
  for (const inventory of inventories) {
    if (!inventory.supersedes_inventory_id) continue;
    successorCounts.set(inventory.supersedes_inventory_id, (successorCounts.get(inventory.supersedes_inventory_id) || 0) + 1);
  }
  for (const [predecessorId, count] of successorCounts) if (count > 1) fail(`agent capability campaign ${campaignId}: inventory ${predecessorId} has ${count} successors`);
  for (const inventory of inventories) {
    if (!inventory.supersedes_inventory_id) continue;
    const predecessor = sourceInventories.get(inventory.supersedes_inventory_id).value;
    const currentById = new Map(inventory.units.map((unit) => [unit.unit_id, unit]));
    for (const previousUnit of predecessor.units) {
      const currentUnit = currentById.get(previousUnit.unit_id);
      if (!currentUnit) {
        fail(`agent capability campaign ${campaignId}: successor ${inventory.id} drops unit ${previousUnit.unit_id}; retain it and mark it retired instead`);
        continue;
      }
      if (currentUnit.name !== previousUnit.name || currentUnit.source_scope_id !== previousUnit.source_scope_id) {
        fail(`agent capability campaign ${campaignId}: successor ${inventory.id} repurposes stable unit ${previousUnit.unit_id}`);
      }
      const previousStage = previousUnit.promotion.stage;
      const currentStage = currentUnit.promotion.stage;
      if (previousStage === "retired" && currentStage !== "retired") fail(`agent capability campaign ${campaignId}: retired unit ${previousUnit.unit_id} cannot be reopened under the same identity`);
      if (currentStage !== "retired" && promotionLifecycle.indexOf(currentStage) < promotionLifecycle.indexOf(previousStage)) {
        fail(`agent capability campaign ${campaignId}: unit ${previousUnit.unit_id} regresses from ${previousStage} to ${currentStage}`);
      }
    }
  }
}

const decisionKeys = new Set();
const decisionSuccessorCounts = new Map();
for (const { file, value: decision } of records.decision) {
  const label = path.relative(root, file);
  validateScope(decision.scope, label);
  if (decisionKeys.has(decision.decision_key)) fail(`${label}: duplicate decision_key ${decision.decision_key}`);
  decisionKeys.add(decision.decision_key);
  if (decision.supersedes_decision_id) {
    const predecessor = decisions.get(decision.supersedes_decision_id)?.value;
    if (!predecessor) fail(`${label}: supersedes_decision_id ${decision.supersedes_decision_id} does not resolve`);
    else {
      if (predecessor.id === decision.id) fail(`${label}: decision cannot supersede itself`);
      if (predecessor.decided_at >= decision.decided_at) fail(`${label}: superseding decision must be later than its predecessor`);
      decisionSuccessorCounts.set(predecessor.id, (decisionSuccessorCounts.get(predecessor.id) || 0) + 1);
    }
  }
}
for (const [predecessorId, count] of decisionSuccessorCounts) if (count > 1) fail(`decision ${predecessorId} has ${count} successors; ADR history must not fork`);

function validateScope(scope, label) {
  const groups = [
    ["work_ids", works], ["release_ids", releases], ["snapshot_ids", snapshots],
    ["assembly_ids", assemblies], ["source_inventory_ids", sourceInventories], ["decision_ids", decisions]
  ];
  for (const [field, registry] of groups) {
    const seen = new Set();
    for (const id of scope?.[field] ?? []) {
      if (seen.has(id)) fail(`${label}: duplicate ${field} reference ${id}`);
      seen.add(id);
      if (!registry.has(id)) fail(`${label}: ${field} reference ${id} does not resolve`);
    }
  }
}

const eventStatusByType = {
  initiative_started: new Set(["planned", "active"]),
  initiative_updated: new Set(["active"]),
  initiative_blocked: new Set(["blocked"]),
  initiative_resumed: new Set(["active"]),
  initiative_completed: new Set(["completed"]),
  decision_recorded: new Set(["completed", "informational"]),
  change_published: new Set(["completed"]),
  verification_completed: new Set(["completed"]),
  correction_recorded: new Set(["completed"])
};
const eventsByThread = new Map();
const referencedDecisionIds = new Set();
for (const { file, value: event } of records.event) {
  const label = path.relative(root, file);
  validateScope(event.scope, label);
  for (const id of event.scope.decision_ids ?? []) referencedDecisionIds.add(id);
  if (Date.parse(event.recorded_at) < Date.parse(event.occurred_at)) fail(`${label}: recorded_at cannot precede occurred_at`);
  if (!eventStatusByType[event.entry_type]?.has(event.status)) fail(`${label}: entry_type ${event.entry_type} cannot use status ${event.status}`);
  if (event.entry_type === "decision_recorded" && !(event.scope.decision_ids?.length)) fail(`${label}: decision_recorded Event requires at least one decision_id`);
  for (const reservedPath of event.coordination.reserved_paths) {
    if (reservedPath.startsWith("/") || reservedPath.includes("..") || reservedPath.includes("\\")) fail(`${label}: reserved path must be machine-neutral: ${reservedPath}`);
  }
  if (["planned", "active", "blocked"].includes(event.status) && event.coordination.reserved_paths.length === 0) fail(`${label}: live initiative requires at least one reserved path`);
  if (!eventsByThread.has(event.thread.id)) eventsByThread.set(event.thread.id, []);
  eventsByThread.get(event.thread.id).push(event);
}
for (const decision of records.decision.map((entry) => entry.value).filter((value) => value.status === "accepted")) {
  if (!referencedDecisionIds.has(decision.id)) fail(`accepted decision ${decision.decision_key} must be referenced by at least one Event`);
}

const activeThreadHeads = [];
for (const [threadId, threadEvents] of eventsByThread) {
  const predecessorCounts = new Map();
  const predecessorIds = new Set();
  for (const event of threadEvents) {
    if (!event.predecessor_event_id) continue;
    const predecessor = events.get(event.predecessor_event_id)?.value;
    if (!predecessor) {
      fail(`event thread ${threadId}: predecessor ${event.predecessor_event_id} does not resolve`);
      continue;
    }
    predecessorIds.add(predecessor.id);
    predecessorCounts.set(predecessor.id, (predecessorCounts.get(predecessor.id) || 0) + 1);
    if (predecessor.thread.id !== threadId) fail(`event thread ${threadId}: predecessor ${predecessor.id} belongs to ${predecessor.thread.id}`);
    if (predecessor.thread.name !== event.thread.name || predecessor.thread.kind !== event.thread.kind) fail(`event thread ${threadId}: stable thread identity was repurposed`);
    if (predecessor.occurred_at >= event.occurred_at) fail(`event thread ${threadId}: successor must occur after predecessor ${predecessor.id}`);
    if (["completed", "cancelled"].includes(predecessor.status) && ["planned", "active", "blocked"].includes(event.status)) fail(`event thread ${threadId}: terminal status ${predecessor.status} cannot transition to ${event.status}`);
  }
  for (const [predecessorId, count] of predecessorCounts) if (count > 1) fail(`event thread ${threadId}: predecessor ${predecessorId} has ${count} successors`);
  const roots = threadEvents.filter((event) => !event.predecessor_event_id);
  const heads = threadEvents.filter((event) => !predecessorIds.has(event.id));
  if (roots.length !== 1) fail(`event thread ${threadId}: expected exactly one root, found ${roots.length}`);
  if (heads.length !== 1) fail(`event thread ${threadId}: expected exactly one head, found ${heads.length}`);
  if (heads[0] && ["planned", "active", "blocked"].includes(heads[0].status)) activeThreadHeads.push(heads[0]);
}

function reservationsOverlap(left, right) {
  const a = left.replace(/^\.\//, "");
  const b = right.replace(/^\.\//, "");
  return a === b || (a.endsWith("/") && b.startsWith(a)) || (b.endsWith("/") && a.startsWith(b));
}
for (let left = 0; left < activeThreadHeads.length; left += 1) {
  for (let right = left + 1; right < activeThreadHeads.length; right += 1) {
    for (const leftPath of activeThreadHeads[left].coordination.reserved_paths) {
      for (const rightPath of activeThreadHeads[right].coordination.reserved_paths) {
        if (reservationsOverlap(leftPath, rightPath)) fail(`active event threads ${activeThreadHeads[left].thread.id} and ${activeThreadHeads[right].thread.id} reserve overlapping paths ${leftPath} and ${rightPath}`);
      }
    }
  }
}

const snapshotIdsWithEvents = new Set(records.event.flatMap((entry) => entry.value.scope.snapshot_ids ?? []));
for (const snapshot of records.snapshot.map((entry) => entry.value)) {
  const majorVersion = Number.parseInt(String(snapshot.version).split(".")[0], 10);
  if (majorVersion >= 24 && !snapshotIdsWithEvents.has(snapshot.id)) fail(`Snapshot ${snapshot.version} must be referenced by an ecosystem Event`);
}

for (const { file, value: snapshot } of records.snapshot) {
  const label = path.relative(root, file);
  const pinnedWorks = new Set();
  const pinnedReleases = new Set();
  for (const pin of snapshot.releases ?? []) {
    if (pinnedReleases.has(pin.release_id)) fail(`${label}: release ${pin.release_id} is pinned more than once`);
    pinnedReleases.add(pin.release_id);
    const entry = releases.get(pin.release_id);
    if (!entry) { fail(`${label}: release ${pin.release_id} does not resolve`); continue; }
    if (pinnedWorks.has(entry.value.work_id)) fail(`${label}: Work ${entry.value.work_id} is pinned by more than one release`);
    pinnedWorks.add(entry.value.work_id);
    const digest = createHash("sha256").update(entry.raw).digest("hex");
    if (digest !== pin.manifest_sha256) fail(`${label}: hash mismatch for ${pin.release_id}; expected ${digest}`);
  }
  const pinnedAssemblies = new Set();
  for (const pin of snapshot.assemblies ?? []) {
    const entry = assemblies.get(pin.assembly_id);
    if (!entry) { fail(`${label}: assembly ${pin.assembly_id} does not resolve`); continue; }
    pinnedAssemblies.add(pin.assembly_id);
    const digest = createHash("sha256").update(entry.raw).digest("hex");
    if (digest !== pin.manifest_sha256) fail(`${label}: hash mismatch for ${pin.assembly_id}; expected ${digest}`);
  }
  if (snapshot.metadata_completeness?.state === "complete") {
    if (snapshot.metadata_completeness.work_count !== pinnedWorks.size) fail(`${label}: work_count does not match the ${pinnedWorks.size} Works pinned by this immutable snapshot`);
    if (snapshot.metadata_completeness.release_count !== snapshot.releases.length) fail(`${label}: release_count does not match pins`);
    if (snapshot.metadata_completeness.assembly_count !== undefined && snapshot.metadata_completeness.assembly_count !== pinnedAssemblies.size) fail(`${label}: assembly_count does not match the ${pinnedAssemblies.size} Assemblies pinned by this immutable snapshot`);
  }
  for (const rootId of snapshot.projection?.root_work_ids ?? []) if (!pinnedWorks.has(rootId)) fail(`${label}: projection root ${rootId} is not pinned`);
  for (const edge of snapshot.projection?.edges ?? []) {
    if (!pinnedWorks.has(edge.from_work_id) || !pinnedWorks.has(edge.to_work_id)) fail(`${label}: projection edge references unpinned Work`);
    if (edge.contextual_role === "module" && !edge.context.trim()) fail(`${label}: module role requires context`);
  }
  if (snapshot.artifact_materialization?.state === "not_materialized" && snapshot.artifact_materialization.receipts.length) fail(`${label}: not_materialized snapshot cannot contain receipts`);
}

const publicationText = Object.values(records).flat().map((entry) => entry.raw).join("\n");
for (const pattern of [/\/Users\//, /\/home\//, /file:\/\//, /BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY/, /(?:ghp|github_pat|sk)-[A-Za-z0-9_-]{16,}/]) {
  if (pattern.test(publicationText)) fail(`publication-safe registry check matched ${pattern}`);
}

if (errors.length) {
  console.error(`FAIL registry validation (${errors.length} error${errors.length === 1 ? "" : "s"})`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`PASS registry validation: ${schemaEntries.length} schemas, ${works.size} Works, ${releases.size} Releases, ${assemblies.size} Assemblies, ${sourceInventories.size} Source Inventories, ${records.snapshot.length} Snapshots, ${decisions.size} Decisions, ${events.size} Events`);
