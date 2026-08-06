> **Current launch pack:** All thirteen prompts are independently launchable and must not wait for one another.

# SISO People Graph — Parallel-Slam GPT-5.6 Agent Prompts

Date: 2026-08-06

Repositories:

- `sisodias/siso-people-graph`
- `sisodias/siso-book-library`
- `sisodias/great-library-of-siso`

`oracle` is unrelated and explicitly out of scope.

## Launch mode

**Launch every prompt at the same time. There is no required order and no prompt may wait for another prompt, branch, schema, ADR, or PR.**

The dependency graph has been replaced with four coordination mechanisms that work in the ChatGPT/Codex web UI:

1. **Current-main rule:** every agent starts from the latest canonical `main` available when it begins.
2. **One owner per hot path:** every lane has exclusive paths and must not edit another lane's paths.
3. **Additive compatibility rule:** when an ideal interface does not exist, the agent builds a lane-local adapter, fixture, or compatibility shim and records the exact future seam. It does not stop and it does not ask the user to merge another PR first.
4. **Draft-PR handoff:** every agent pushes its own branch and opens a draft PR containing an explicit integration manifest.

## Rules shared by every prompt

Each prompt below is self-contained, but these are the operating principles behind all of them:

- Inspect repository instructions, latest `main`, and currently open PRs before editing.
- Use the exact branch in the prompt. If it already exists, append `-2`, `-3`, and so on rather than reusing another agent's branch.
- Never commit directly to `main`, merge your own PR, force-push, delete branches/releases, or rewrite accepted immutable registry history.
- Do not commit production SQLite databases, compressed corpora, credentials, private paths, client data, personal notes, or rights-unclear payloads.
- Do not wait for another agent. Do not declare yourself blocked because a proposed v3 schema or interface is not merged.
- Preserve existing behavior by default. Prefer new versioned modules and compatibility adapters over destructive renames.
- Do not edit `README.md`, shared root configuration, or generated surfaces unless the prompt explicitly assigns them to your lane.
- Before the final push, update from `main`, resolve only conflicts inside your reserved paths, run tests, and inspect the complete diff.
- Add a unique handoff file at the exact path assigned by the prompt. It must contain: scope, changed paths, commands, tests, assumptions, compatibility seams, known risks, data/rights notes, and suggested merge considerations.
- Open a **draft PR**. The PR description must include:

```text
Parallel lane:
Branch:
Owned paths:
Behavior changed:
Compatibility preserved:
Tests and measurements:
External sources and rights:
Integration seams:
Known risks:
```

## Parallel observation exchange envelope v0.1

Source and ingestion lanes must emit replayable fixture records using this interim envelope. It is deliberately an observation contract, not a canonical ontology, so agents can work independently without silently resolving identities.

```json
{
  "envelope_version": "pg-observation-0.1",
  "source": {
    "source_id": "openalex",
    "snapshot_id": "source-native revision or dated snapshot",
    "record_native_id": "source-native stable identifier",
    "observed_at": "ISO-8601",
    "retrieved_at": "ISO-8601",
    "terms_revision": "URL, revision, or documented unknown",
    "rights_state": "public_metadata|open_data|restricted|discovery_only|pending",
    "payload_sha256": "sha256 of the replayable raw fixture or record"
  },
  "subject": {
    "kind": "person|organisation|account|work|event|venue|place|concept|claim",
    "source_native_id": "source-local identifier",
    "label": "source-observed label",
    "attributes": {}
  },
  "identifiers": [
    {
      "scheme": "orcid",
      "value": "0000-0000-0000-0000",
      "scope": "global|source|organisation",
      "stability": "stable|mutable|unknown",
      "uniqueness": "unique|non_unique|unknown",
      "evidence": "literal source field or locator"
    }
  ],
  "contributions": [],
  "relationships": [],
  "evidence": [],
  "raw_pointer": "fixture path, source locator, or content-addressed receipt"
}
```

Rules:

- Names, companies, locations, biographies, topics, and handles are never globally unique identifiers.
- The envelope never assigns a canonical People Graph ID.
- Model-generated classifications are explicitly marked in `evidence`; they are not source observations.
- Popularity, followers, stars, downloads, and citations are timestamped observations, never a universal canonical person score.
- Full raw payloads remain outside Git unless they are tiny, public-safe test fixtures.

---

## Prompt 1 — Great Library registry, ownership, and public program spine

```text
You are the Great Library registry agent for the SISO People Graph expansion. You are running in parallel with every other agent. Do not wait for their branches or PRs.

REPOSITORIES
- Read/write: sisodias/great-library-of-siso
- Read-only context: sisodias/siso-people-graph, sisodias/siso-book-library
- Oracle is unrelated and must not be inspected or mentioned.

BRANCH
`gls/people-graph-parallel-spine-20260806`
If it exists, append `-2` rather than reusing it.

EXCLUSIVE PATH OWNERSHIP
You are the only parallel lane allowed to change:
- new People Graph / Book Library Work records under `registry/works/`
- their new Release records under `registry/releases/`
- a new People Graph program Decision under `registry/decisions/`
- new People Graph program Events under `registry/events/`
- a new People Graph Frontier Question Work and its seed/program Release records
- the next whole-Library Snapshot if required by repository policy
- generated `site/**` resulting from these records
- relevant generator/check changes, `CURRENT_STATE.md`, and authored `docs/people-graph-program/**`
Do not rewrite existing immutable Releases, Snapshots, Events, or Decisions.

PARALLEL RULE
Start from current `main`. Inspect open PRs, but do not wait for them. Record the parallel lanes as independent branches, not as a dependency graph. Other agents do not need this PR merged before working.

READ FIRST
Read `README.md`, `AGENTS.md`, `CURRENT_STATE.md`, the highest numeric whole-Library Snapshot, `site/intelligence.json`, `docs/onboarding.html`, `docs/registry-model.md`, `docs/siso-knowledge-model.html`, `docs/question-driven-research.html`, `docs/research-question-model.html`, `CONTRIBUTING.md`, `SECURITY.md`, and the full GQ-009 record. Read all tracked files in the People Graph and Book Library sufficiently to make exact, evidenced registry claims.

MISSION
Create the public-safe registry and ownership spine for the People Graph and Book Library without claiming that any unbuilt production v3 database or source pilot has already shipped.

WORK
1. Resolve the current ownership ambiguity through a new ADR: the People Graph README describes the graph as part of Foundry, while the Great Library Knowledge model assigns durable indexes and graphs to SISO Knowledge. Decide whether People Graph is an independent Research Work, a Knowledge-owned component, or another explicit arrangement. Preserve these boundaries:
   - Great Library owns stable Work/Release/Snapshot identity and public-safe lineage.
   - large databases and source snapshots remain in a governed external data plane.
   - Foundry discovers/evaluates source universes rather than silently becoming canonical truth.
   - Evidence Engines own source-grounded transformation and adjudication.
2. Register `sisodias/siso-people-graph` and `sisodias/siso-book-library` as independently addressable Works if the ADR supports that conclusion. Use exact current repository locators. Treat older `Lordsisodia` references as a verification question, not a blind global replacement.
3. Add immutable code/data-contract Release Manifests pinned to the exact current commits that you can verify. Do not claim a v3 production database, fresh asset, installation path, or payload state that you did not independently test.
4. Create a Frontier Question equivalent to “How do we 100× the value of the People Graph?” using the repository's numbering and identity rules. Include decision target, measurable success criteria, falsifiers, evidence gaps, rights/privacy boundary, refresh triggers, and a distinction between breadth, resolution quality, research depth, and actual decision value.
5. Publish one append-only `initiative_started` Event that records the simultaneous parallel program. List all lanes, their branch names and exclusive path zones, but explicitly state that no lane waits for another. The coordination mechanism is path ownership plus draft-PR handoffs.
6. Add authored program documentation explaining the control-plane/data-plane split and the interim observation-envelope contract.
7. Generate site projections only through repository tooling. Update the next valid Snapshot and `CURRENT_STATE.md` only where current repository policy requires it.

ACCEPTANCE
- The ADR is explicit enough that later agents know where source discovery, canonical identity, data storage, evidence transformation, and public registry records belong.
- Work and Release records make only claims supported by exact commits and evidence.
- The Frontier Question can kill low-value row-count expansion.
- The Event describes parallel launch, not dependencies.
- `npm ci` and `npm run verify` pass.
- Commit, push, and open a draft PR titled `Program: register and govern the People Graph expansion`.
- Add `docs/people-graph-program/handoff-registry.md` with the required handoff fields.
- Final response: branch, commits, draft PR, verification output, new IDs, exact claims made, and unresolved locator/ownership risks.
```

---

## Prompt 2 — People Graph forensic red-team and executable failure fixtures

```text
You are the forensic red-team agent for sisodias/siso-people-graph. You are running simultaneously with the architecture, identity, build, query, source, and reasoning agents. Do not wait for any of them and do not modify their code.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/red-team-fixtures-20260806`

EXCLUSIVE PATH OWNERSHIP
- `tests/red_team/**`
- `docs/audits/**`
- `docs/handoffs/red-team.md`
- one lane-local test runner under `tests/red_team/run.py`
Do not edit schema, loaders, query code, README, or root configuration. Use Python stdlib tooling if necessary to remain isolated.

PARALLEL RULE
Base all findings on current `main`. Inspect open PRs for awareness only. Do not rely on their code. A finding must be reproducible against current main with a tiny local fixture.

MISSION
Turn the dangerous assumptions in the current People Graph into executable fixtures and a severity-ranked audit. Diagnose only; do not fix production behavior.

REQUIRED TESTS
Create tiny offline SQLite/JSON fixtures that demonstrate or falsify:
1. Whether `build_people_graph_v2.py` finds its schema from a clean checkout.
2. Whether the builder silently merges unrelated people on normalized name.
3. Whether `shared_external_id` can treat company, location, real name, or another non-unique attribute as near-certain identity evidence.
4. Whether accepted identity claims affect canonical query results or remain inert.
5. Whether each loader is idempotent across two runs: no repeated rank additions, duplicate claims, stale edges, or unrelated-field mutation.
6. Whether topics/enrichment work for a canonical entity whose ID is not `gh:*` or whose origin is not `github`.
7. Unicode/non-Latin name preservation and collision behavior.
8. Whether aliases/raw variants reach FTS search.
9. GitHub account rename and repository-transfer behavior when stable numeric IDs exist.
10. Ambiguous common names, shared employers, shared locations, organisations with human-looking names, and pseudonyms.
11. Whether `rank_score` currently mixes incompatible units.
12. Whether the current `v_contemporaries` assumptions create implausible results for unknown death years.
13. Whether query inventory and missing-domain behavior can mislead a caller.
14. Cross-repo assumptions from the Book Library export that can corrupt People Graph attribution or roles.

DELIVERABLES
- Offline test suite with explicit pass, expected-failure, and invariant labels.
- `docs/audits/people-graph-v2-red-team-2026-08-06.md` containing stable finding IDs, severity, file/function, reproduction, violated invariant, blast radius, and suggested owning lane.
- `docs/audits/people-graph-v2-findings.json` with the same stable IDs.
- No speculative claim without exact source evidence or a fixture.

ACCEPTANCE
- Tests run from a clean checkout with no database asset and no network.
- Preserve expected failures honestly rather than weakening assertions to make CI green.
- Commit, push, and open a draft PR titled `Test: codify current People Graph failure modes`.
- Final response: branch, commits, PR, command, counts, P0/P1 findings, and what must block bulk ingestion.
```

---

## Prompt 3 — Additive People Graph v3 ontology and schema

```text
You are the ontology and schema agent for sisodias/siso-people-graph. You are running in parallel and must produce a complete standalone proposal from current main. Do not wait for the red-team or identity agents.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/v3-ontology-schema-20260806`

EXCLUSIVE PATH OWNERSHIP
- `schema/v3/**`
- `docs/architecture/**`
- `tests/schema_v3/**`
- `docs/handoffs/schema-v3.md`
Do not modify existing v2 schema, loaders, `ask.py`, README, or shared root config.

PARALLEL RULE
Use current main as evidence. Independently audit existing code. If another lane later reaches a different conclusion, your handoff must make the disagreement easy to adjudicate. Do not create a dependency on another PR.

MISSION
Define an additive v3 model that can grow 10× in observations and 100× in research usefulness without confusing source observations, canonical entities, identity decisions, claims, or projections.

REQUIRED MODEL
Create versioned SQLite DDL, constraints, sample data, compatibility notes, and tests covering:
- `source` and `source_snapshot`: terms revision, rights state, snapshot/revision, digests, acquisition method, observation time, and deletion/tombstone obligations;
- append-oriented source observations retaining source-native identifiers and raw evidence pointers;
- canonical entity IDs independent of handles/names, with person, organisation, account, pseudonym, Work, event, venue, place, and concept types;
- identifier definitions declaring scope, uniqueness, mutability, trust class, and source authority;
- first-class Works, versions/editions/expressions, contribution roles/order/time, venues, citations, dependencies, and locators;
- identity candidate claims, positive/negative evidence, decisions, conflicts, canonical clusters/redirects, reversibility, and review lineage;
- generic evidence-backed assertions with subject, predicate, object/value, confidence, status, valid time, observed time, extraction method, and deciding authority;
- typed temporal relationships;
- aliases plus Unicode-safe search;
- rights/privacy/publication state at source, Work, evidence, and claim levels;
- named derived projections with method/version/scope metadata rather than one canonical rank/tier/influence number.

INTERIM EXCHANGE CONTRACT
Map the following standalone observation envelope into v3 tables and document the mapping. Do not change its fields in this lane:
- envelope version `pg-observation-0.1`
- source snapshot and record-native ID
- subject kind/source-native ID/label/attributes
- identifiers with scope, stability, uniqueness, and literal evidence
- contributions, relationships, evidence, and raw pointer
The envelope never assigns a canonical ID.

INVARIANTS
- No silent name merge.
- Handles are aliases; stable platform IDs are identifiers.
- Company, location, topic, biography, and real name are attributes, not unique IDs.
- Every accepted fact has provenance and observed time.
- Corrections and merges are reversible while source observations survive.
- Source vocabularies stay namespaced; crosswalks are explicit.
- A Work is not embedded only as a title string on a person edge.
- Model inference never masquerades as source observation.

DELIVERABLES
- `docs/architecture/people-graph-v3.md` with diagrams, invariants, example records/queries, rejected alternatives, scale strategy, and v2 compatibility limits.
- Versioned schema under `schema/v3/`.
- Import mapping for `pg-observation-0.1`.
- Synthetic tests for foreign keys, uniqueness scopes, conflicting stable IDs, reversible identity decisions, rights coverage, and Unicode search.
- A rebuild/migration strategy that prefers source reconstruction and never rewrites the current production asset in this PR.

ACCEPTANCE
- All lane-local schema tests pass offline.
- Existing v2 files are untouched.
- Commit, push, and open a draft PR titled `Architecture: add the People Graph v3 evidence ontology`.
- Final response: branch, commits, PR, tests, schema summary, disputed decisions, and compatibility seams.
```

---

## Prompt 4 — Safe identity resolution and canonical clusters

```text
You are the identity-resolution agent for sisodias/siso-people-graph. Work immediately from current main; do not wait for a v3 schema PR. Build a self-contained identity module and preserve current CLI compatibility where you touch existing files.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/identity-resolution-parallel-20260806`

EXCLUSIVE PATH OWNERSHIP
- `identity_v3/**`
- `loaders/match_identities.py`
- `loaders/enrich_owners.py`
- `tests/identity_v3/**`
- `docs/handoffs/identity-resolution.md`
Do not edit core schema files, build loaders, query files, README, or shared root config.

PARALLEL RULE
No dependency on the schema agent. Put any required lane-local fixture DDL under `identity_v3/fixtures/` and expose a narrow interface that can later map onto either v2 or v3. Do not ask the user to merge another branch first.

MISSION
Eliminate unsafe near-certain matches and provide an evidence-calibrated, reversible canonical-cluster engine.

REQUIRED WORK
1. Create an identifier registry that declares scheme, scope, uniqueness, mutability, and auto-resolution eligibility. GitHub numeric account ID, ORCID, VIAF, ISNI, Wikidata QID, and equivalent authority IDs may be strong. Names, company, location, topic, biography, follower count, and real name must never be globally unique identifiers.
2. Fix current matching so `shared_external_id` only considers identifier schemes explicitly eligible for identity resolution.
3. Make name normalization Unicode-preserving and comparison-only. Never generate canonical IDs by deleting non-ASCII characters.
4. Model usernames/handles as time-bounded aliases linked to stable account identifiers, including rename history.
5. Generate candidates with method version, positive evidence, negative evidence, conflict reasons, confidence, and review state. Exact-name and surname-initial signals remain review-only.
6. Build deterministic canonical clusters for accepted decisions, including transitive closure, stable canonical selection, redirect lookup, conflicting-identifier detection, and one-command undo. Preserve all source rows and aliases.
7. Provide adapters that can read current v2 `external_ids`/`identity_claim` tables and `pg-observation-0.1` fixture records without treating attributes as IDs.
8. Fix enrichment semantics: collect each missing field independently; never let one field block other enrichment; never overwrite a canonical name, build timestamp, or unrelated rank; store GitHub profile values as source observations/attributes.
9. Keep network calls injectable and replayable. Tests use recorded tiny fixtures only.

ADVERSARIAL FIXTURES
Common names, shared employers, shared cities, organisation accounts with personal-looking labels, renamed GitHub users, pseudonyms, non-Latin names, one human with several platforms, two humans sharing a personal name, and one impossible cluster with conflicting stable IDs.

DELIVERABLES
- Identity library plus CLI: inspect, propose, review, accept, reject, resolve, undo, and audit.
- Updated backward-compatible matcher/enricher behavior.
- Offline tests and a method card describing thresholds, automatic acceptance policy, and known blind spots.
- A mapping note showing how your interface can attach to the additive v3 schema without requiring it now.

ACCEPTANCE
- No fixture with shared company/location/name auto-resolves.
- Accepted decisions create queryable canonical redirects in the lane-local interface.
- Undo restores the prior cluster deterministically.
- All tests pass offline.
- Commit, push, and open a draft PR titled `Identity: make People Graph resolution safe and reversible`.
- Final response: branch, commits, PR, tests, automatic/review-only precision measurements, and integration seams.
```

---

## Prompt 5 — Reproducible builds and source manifests

```text
You are the build/release agent for sisodias/siso-people-graph. Start now from current main. Do not wait for schema or identity work; build compatibility around what exists and isolate new contracts under your owned paths.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/reproducible-builds-parallel-20260806`

EXCLUSIVE PATH OWNERSHIP
- `build_v3/**`
- `manifests/**`
- `loaders/build_people_graph_v2.py`
- `loaders/load_owner_topics.py`
- `loaders/load_owners_into_people_graph.py`
- `tests/build_v3/**`
- build-specific `.github/workflows/**`
- `docs/handoffs/reproducible-builds.md`
Do not edit identity files, query files, core schema files, README, or unrelated loaders.

PARALLEL RULE
When a future schema would help, emit versioned manifests and adapters instead of blocking. Preserve current CLI flags where practical. No hidden requirement on another PR.

MISSION
Make a clean checkout able to rebuild, validate, fingerprint, and package the graph from declared source snapshots without hidden local topology or non-idempotent mutation.

REQUIRED WORK
1. Fix clean-checkout schema/path resolution and test it from a temporary directory.
2. Replace hard-coded/private path policy with an explicit config/manifest layer and environment overrides. Do not publish vault topology.
3. Define source manifests recording source ID, exact snapshot/revision, acquisition URI class, source digest, terms/rights revision, acquisition time, loader version, schema version, and expected row contract.
4. Add validation/import support for `pg-observation-0.1` without assigning canonical identity.
5. Make owned loaders idempotent and source-replaceable: a rerun must not add value repeatedly, retain stale source edges, duplicate observations, or overwrite unrelated canonical fields.
6. Remove incompatible universal rank mutation from loading. Keep stars, followers, work count, repository ratings, and similar values as named timestamped observations or named projections.
7. Separate run/build metadata from canonical facts so logical reproducibility is measurable.
8. Produce deterministic logical digests over sorted exports and per-table counts. Measure binary SQLite reproducibility honestly; require logical equivalence if byte identity is not stable.
9. Add staged validation: schema/foreign keys, source coverage, orphan edges, duplicate eligible identifiers, impossible clusters, rights coverage, and query smoke tests.
10. Add release-packaging tools that generate compressed fixture DBs, checksums, a manifest, and provenance receipt. Do not upload a production asset.
11. Add offline CI using tiny fixtures and a documented full-build command.

DELIVERABLES
- One-command clean fixture build.
- Versioned source/build manifests.
- Two-run logical reproducibility proof.
- Validation report and release-packaging scripts.
- Migration note for existing release assets and current v2 loaders.

ACCEPTANCE
- Run two clean fixture builds in separate directories and show equal logical digest and row counts.
- Owned loaders pass stale-source and double-run tests.
- No SQLite/corpus asset is committed.
- Commit, push, and open a draft PR titled `Build: make People Graph construction reproducible`.
- Final response: branch, commits, PR, commands, digests, validation counts, and remaining non-reproducible inputs.
```

---

## Prompt 6 — Read-only query library, API/MCP, and explorer

```text
You are the query-surface agent for sisodias/siso-people-graph. Work from current main and create a capability-detecting read layer that functions against current v2 fixtures while remaining ready for additive v3 tables. Do not wait for another PR.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/query-surface-parallel-20260806`

EXCLUSIVE PATH OWNERSHIP
- `query_v3/**`
- `api/**`
- `mcp/**`
- `viewer/**`
- `loaders/ask.py`
- `tests/query_v3/**`
- `docs/handoffs/query-surface.md`
Do not edit schema, identity, build, source-adapter, claims, README, or root config unless a lane-local file can avoid it.

PARALLEL RULE
Do not reimplement identity resolution. Build a resolver interface with adapters:
- current v2 mode: expose accepted/proposed claim state and ambiguity honestly;
- additive v3 mode: detect canonical redirects/clusters if present;
- envelope mode: inspect `pg-observation-0.1` fixtures as observations only.
Missing capabilities must be explicit in output, not hidden and not blocking.

MISSION
Turn the graph into a safe read-only research instrument whose results expose provenance, time, identity ambiguity, rights state, and routes to underlying evidence.

REQUIRED CAPABILITIES
- `who`: entity candidates, canonical status, aliases, identifiers, ambiguity, kinds, and source coverage;
- `works`: contributions, roles, source-native Works, versions/editions where available, and fetch routes;
- `relationships`: typed, temporal, evidenced neighbours;
- `path`: explainable graph paths with edge provenance;
- `timeline`: works, affiliations, appearances, grants, and identity/handle changes;
- `topics`: namespaced vocabularies and explicit crosswalks only;
- `claims`: evidence-backed assertions where present, with review/inference state;
- `compare`: side-by-side evidence without manufacturing one universal score;
- `multi-domain`: overlap, unresolved identity, and missing-source diagnostics;
- `source`/`inventory`: source snapshots, rights, freshness, row counts, and build digest.

IMPLEMENTATION
- One versioned Python query library is the source of truth.
- CLI, minimal read-only HTTP API, MCP surface, and optional viewer call that library.
- Replace machine-specific path guessing with explicit configuration while preserving a simple local default for fixtures.
- Version JSON outputs and test schemas.
- Enforce parameter binding, pagination, query budgets, timeouts, and read-only SQLite mode.
- Distinguish source observation, accepted identity decision, derived relation, and model inference.
- No write endpoint, arbitrary SQL endpoint, or full-corpus payload proxy.

ACCEPTANCE
Demonstrate offline fixtures for a multi-source person, ambiguous common name, organisation, historical figure, missing database, and relationship path. All outputs include provenance/capability metadata. Commit, push, and open a draft PR titled `Query: add an evidence-first People Graph read surface`. Final response: branch, commits, PR, commands, sample outputs, benchmarks, and unsupported capabilities.
```

---

## Prompt 7 — Book Library integrity and parallel graph export

```text
You are the sole Book Library implementation agent in this parallel program. Work immediately and independently from current main.

REPOSITORIES
- Read/write: sisodias/siso-book-library
- Read-only context: sisodias/siso-people-graph, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`books/integrity-export-parallel-20260806`

EXCLUSIVE PATH OWNERSHIP
Within the Book Library you own:
- `scripts/**`
- `index/**`
- new `tests/**`, `manifests/**`, and `docs/**`
- `.github/workflows/**`
Do not commit index/payload SQLite, tar, gzip, or corpus assets.

PARALLEL RULE
Do not wait for a People Graph v3 schema. Export the exact `pg-observation-0.1` envelope described below so the People Graph can ingest it later without silent canonical merges.

INTERIM EXPORT CONTRACT
Each author/contributor/Work observation must include:
- envelope version `pg-observation-0.1`;
- source snapshot, Gutenberg native IDs, source timestamps, terms/rights state, and payload digest;
- source-observed subject kind/label/attributes;
- identifiers with explicit uniqueness/mutability semantics;
- Work/contribution roles and order;
- relationships, evidence, and raw pointer;
- no canonical People Graph ID and no name-only merge.

MISSION
Make the Book Library metadata index, contributor graph, locator, extraction queue, and People Graph export honest, reproducible, and versioned.

REQUIRED WORK
1. Prove source replacement and rerun idempotency. Changed upstream rows must remove stale subjects, shelves, classes, person-work edges, and locators.
2. Reconcile deterministic-rebuild claims with timestamps and SQLite behavior. Publish measured logical digests and source hashes rather than unsupported byte-for-byte claims.
3. Correct/test LoCC parsing, including letter-plus-digit codes; make comments, code, and outputs agree.
4. Make the extraction queue one row per Work at its highest priority while retaining an auditable reason list. Prove tier overlap behavior.
5. Reconcile locator documentation and implementation: tracked tooling must reproduce the documented individually compressed members, tar assets, exact offsets/lengths, and per-book SHA-256. Add missing pack/index/verify tooling rather than documenting hidden steps.
6. Replace silent canonical name merging with a versioned observation export using `pg-observation-0.1`.
7. Preserve all contributor roles, aliases, institutional contributors, pseudonyms, and Unicode. Human/organisation classification remains an evidenced attribute, not a name heuristic promoted to truth.
8. Record source digest, retrieval metadata, rights basis, row counts, loader version, and release manifest.
9. Add tiny offline fixtures and CI.
10. Document a future Work/Expression/Edition model and modern-book bridge through Open Library/Crossref/authority IDs without turning this PR into a full ingest.

ACCEPTANCE
- Two clean fixture builds have equal logical digests.
- Stale-edge, queue-deduplication, locator-checksum, role-preservation, and envelope-export tests pass.
- No large asset is committed or uploaded.
- Commit, push, and open a draft PR titled `Books: make the index and People Graph export reproducible`.
- Add `docs/handoff-parallel-people-graph.md`.
- Final response: branch, commits, PR, commands, digests, changed contracts, and assets requiring later regeneration.
```

---

## Prompt 8 — External-source research, GitHub landscape, internet, and rights matrix

```text
You are the external-source and landscape research agent. You are running in parallel and your lane is research-only: do not wait for implementation schemas and do not ingest production data.

REPOSITORIES
- Read/write: sisodias/great-library-of-siso
- Read-only context: sisodias/siso-people-graph, sisodias/siso-book-library
- Oracle is out of scope.

BRANCH
`gls/people-graph-source-research-20260806`

EXCLUSIVE PATH OWNERSHIP
- `research/people-graph-sources/**`
Do not touch `registry/**`, `site/**`, `CURRENT_STATE.md`, generator code, existing authored docs, or Snapshots. The Great Library registry agent owns those paths.

PARALLEL RULE
Produce a standalone research package against current public documentation. Do not depend on another lane's ADR or schema. Write recommendations that can map to any provenance-first observation model.

MISSION
Find the public data sources, APIs, dumps, protocols, communities, and open-source systems that can 10× People Graph breadth and 100× its decision/research value. Search official sites, current technical documentation, public GitHub repositories, research papers, and public discussion—including Reddit only within its current permitted-access and retention boundaries.

RESEARCH QUESTIONS
- Which sources add strong stable identifiers and cross-domain joins rather than just more names?
- Which sources add Works, contributors, citations, affiliations, funding, events, packages, models, datasets, media appearances, claims, and temporal history?
- Which sources have lawful/reproducible bulk access and usable update/delete semantics?
- Which public GitHub projects solve entity resolution, record linkage, authority reconciliation, graph provenance, temporal knowledge graphs, source archiving, and data quality better than current code?
- What should be discovered but not persisted because of terms, deletion obligations, privacy, or lack of bulk rights?

SOURCES TO ASSESS
At minimum:
- scholarly/authority: OpenAlex, Crossref, ORCID public data, DBLP, OpenCitations, ROR, Wikidata, VIAF, Library of Congress authorities, Open Library;
- software/AI: GitHub REST/GraphQL, GH Archive, Software Heritage, ecosyste.ms, PyPI, npm, crates.io, Hugging Face Hub;
- creators/media: Podcast Index/open RSS, YouTube Data API, OpenReview, conference schedule systems, public personal-site metadata/`sameAs`;
- public discourse: Stack Exchange, Hacker News, AT Protocol/Bluesky, Mastodon;
- institutions/economic activity: USPTO current open-data plane, NIH RePORTER/ExPORTER, SEC EDGAR, open company registries;
- restricted/high-risk: Reddit, X, LinkedIn, Goodreads, Google Scholar, Crunchbase, and sources without a permitted bulk/reuse path.

GITHUB LANDSCAPE
Search and evaluate relevant public repositories, including but not limited to probabilistic record linkage, entity resolution, knowledge-graph provenance, temporal graphs, authority reconciliation, data observability, and graph APIs. Record license, maintenance state, architecture, scale evidence, reusable ideas, and whether adoption is preferable to reinvention. Do not copy code without license review.

FOR EACH SOURCE
Record owner, current official access method, source-native stable IDs, entity/Work/relation types, scale, freshness, snapshot/delta support, terms revision, data/license state, attribution, rate limits, deletion/removal requirements, personal-data risk, reproducibility, overlap hypothesis, expected information gain, pilot cost, failure/kill condition, and recommended state:
- `pilot_now`
- `research_more`
- `discovery_only`
- `do_not_ingest`

DELIVERABLES
- `research/people-graph-sources/source-matrix.json`
- `research/people-graph-sources/source-matrix.md`
- `research/people-graph-sources/github-landscape.md`
- `research/people-graph-sources/rights-and-deletion-matrix.md`
- `research/people-graph-sources/100x-value-theses.md`
- `research/people-graph-sources/pilot-portfolio.md` with 30/90/180-day cohorts, costs, metrics, and kill gates
- `research/people-graph-sources/handoff.md`

QUALITY BAR
Use current primary/official sources for terms and APIs. Separate observed facts from inference. Do not recommend Reddit or another restricted source as a persistent corpus merely because it is publicly viewable. Rows are not the objective; strong joins, evidence depth, and decision value are.

ACCEPTANCE
Run any repository-safe checks available without generating or committing `site/**`. Commit, push, and open a draft PR titled `Research: map the 100x People Graph source universe`. Final response: branch, commits, PR, top sources, rejected/restricted sources, reusable GitHub projects, and highest-value pilot sequence.
```

---

## Prompt 9 — Scholarly and authority-source pilot

```text
You are the scholarly/authority adapter agent for sisodias/siso-people-graph. Work now from current main. Do not wait for a v3 schema; emit the shared observation envelope and keep adapters isolated.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/scholarly-authority-pilot-20260806`

EXCLUSIVE PATH OWNERSHIP
- `sources/scholarly/**`
- `tests/sources_scholarly/**`
- `docs/source-methods/scholarly/**`
- `docs/handoffs/scholarly-pilot.md`
Do not edit core schema, identity, build, query, claims, README, or root config.

PARALLEL RULE
Your output is `pg-observation-0.1` NDJSON plus metrics. It must not assign canonical IDs or require another branch.

OBSERVATION ENVELOPE
For every record emit:
- source snapshot/native record ID/observed and retrieved times/terms revision/rights state/payload hash;
- subject kind/native ID/label/attributes;
- identifiers with scope, mutability, uniqueness, and literal evidence;
- contributions, relationships, evidence, raw pointer;
- no canonical ID and no name-only merge.

MISSION
Test which scholarly and authority sources materially improve modern-author coverage, stable identity, Works, affiliations, citations, topics, and historical-author reconciliation.

SOURCES
Evaluate a bounded combination of OpenAlex, Crossref, ORCID public data/API, DBLP, OpenCitations, ROR, Wikidata, VIAF, Library of Congress authorities, and Open Library. Use current official access paths. Start with the smallest set that can answer the cohort question.

COHORT
Build a reproducible pilot of roughly 500–2,000 living technical authors/engineers seeded from existing GitHub/YouTube/registry labels plus a smaller historical-author control group. Prefer explicit ORCID, DOI authorship, verified website, OpenAlex/DBLP authority link, VIAF/LoC/Wikidata ID, or another strong bridge. Names alone generate review candidates only in metrics; they never become accepted identity.

IMPLEMENTATION
- Source adapters output observations and source-native Works/organisations only.
- Capture DOI, ORCID, OpenAlex author/work IDs, DBLP person/publication IDs, citations, concepts, ROR affiliations, VIAF/LoC/Wikidata links, dates, roles, source revision, and conflicts where available.
- Preserve disagreements rather than silently choosing one date, affiliation, title, or authorship split.
- Make acquisition resumable, rate-aware, cached, and replayable.
- Network collection may create a tiny public-safe pilot manifest; tests use mocked fixtures only.
- Review public GitHub adapters/libraries that could reduce custom code; record license and adoption decision.

MEASURE
Per source: cohort coverage, strong-ID bridge rate, review-candidate rate, manually reviewed precision sample, conflict rate, new Works/person, affiliations/citations/topics added, calls/bytes/time, rights coverage, and projected full-scale size. Compare against a no-source baseline and include a kill recommendation.

DELIVERABLES
Adapters, fixture recordings, NDJSON envelope exporter, reproducible pilot command, metrics report, source method cards, and promote/revise/kill verdict per source.

ACCEPTANCE
- Tests run offline.
- Every identity bridge remains inspectable as evidence; no silent canonical merge.
- No production database or bulk dump is committed.
- Commit, push, and open a draft PR titled `Pilot: add scholarly and authority observations`.
- Final response: branch, commits, PR, commands, metrics, reviewed precision, rights notes, and sources worth scaling.
```

---

## Prompt 10 — Software, packages, and AI-creator pilot

```text
You are the software/AI ecosystem adapter agent for sisodias/siso-people-graph. Work immediately from current main and use the shared observation envelope; do not wait for another schema.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/software-ai-pilot-20260806`

EXCLUSIVE PATH OWNERSHIP
- `sources/software/**`
- `sources/ai/**`
- `tests/sources_software_ai/**`
- `docs/source-methods/software-ai/**`
- `docs/handoffs/software-ai-pilot.md`
Do not edit core schema, identity, build, query, claims, README, or root config.

PARALLEL RULE
Emit `pg-observation-0.1` records. Never assign canonical IDs. A missing v3 table is not a blocker.

MISSION
Move beyond “repository owner plus stars” to a source-native graph of accounts, repositories, packages, releases, models, datasets, Spaces/apps, maintainers, contributors, dependencies, organisations, transfers, and history.

SOURCES
Use a bounded, current, bulk-friendly subset of GitHub REST/GraphQL, GH Archive, Software Heritage, ecosyste.ms, PyPI, npm, crates.io, and Hugging Face Hub. Prefer public snapshots/indexes to expensive per-item calls when available. Evaluate relevant public GitHub projects before reinventing ingestion or entity-resolution components.

IDENTITY/WORK RULES
- GitHub numeric account/repository/node IDs are source-scoped stable identifiers; logins/full names are mutable aliases.
- Software Heritage IDs identify archived source artifacts/history.
- Package coordinates are Work identifiers; registry maintainers are contribution relationships, not person aliases.
- Hugging Face models, datasets, and Spaces are distinct Work types with versions, licenses, organisations, and relationships.
- Organisations remain first-class observations.
- Stars, downloads, followers, dependent counts, likes, and citations are timestamped metrics only.

OBSERVATION ENVELOPE
Every fixture/pilot record must include source snapshot/native ID/times/terms/rights/hash; subject kind/native ID/label/attributes; identifiers with scope/stability/uniqueness/evidence; contributions, relationships, evidence, and raw pointer; no canonical People Graph ID.

COHORT
Sample high-signal current GitHub labels plus multi-registry maintainers and AI creators. Include account rename, repository transfer, organisation account, co-maintainers, package dependency, archived repository, model-dataset-Space relationship, and abandoned Work cases.

MEASURE
New stable IDs, Work types, contribution/maintainership edges, dependencies, archived-history links, cross-platform identity evidence, temporal events, source conflicts, API cost, rights/license coverage, and projected scale. Compare API-heavy methods with snapshots/ecosyste.ms/registry dumps.

DELIVERABLES
Adapters, replayable fixtures, envelope exporter, pilot metrics, source method cards, and at least five evidence-first example questions whose answers are impossible from star rankings alone.

ACCEPTANCE
Offline tests pass; no canonical rank mutation or silent identity merge; no bulk repository cloning or large dataset commit. Commit, push, and open a draft PR titled `Pilot: add software and AI creator observations`. Final response: branch, commits, PR, metrics, stable-ID strategy, source costs, and recommended scale subset.
```

---

## Prompt 11 — Living writers, podcasts, talks, video, and public-web pilot

```text
You are the living-creators/media adapter agent for sisodias/siso-people-graph. Start immediately from current main. Do not wait for another schema or rights matrix; independently verify current source terms and emit only the shared observation envelope.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/living-creators-media-pilot-20260806`

EXCLUSIVE PATH OWNERSHIP
- `sources/creators/**`
- `sources/media/**`
- `tests/sources_creators_media/**`
- `docs/source-methods/living-creators/**`
- `docs/handoffs/living-creators-pilot.md`
Do not edit core schema, identity, build, query, claims, README, or root config.

PARALLEL RULE
Emit `pg-observation-0.1` records and source-specific update/removal rules. Do not assign canonical IDs or wait for another PR.

MISSION
Attack the structural overlap gap by loading the populations that should bridge books, code, papers, podcasts, talks, video, conferences, and personal websites: living technical authors, founders, researchers, maintainers, hosts, guests, speakers, and their organisations.

SOURCES
Evaluate a bounded combination of Podcast Index/open RSS, YouTube Data API, Open Library modern author/edition metadata, Crossref/OpenAlex technical books/papers, OpenReview, public conference schedule systems, and explicit author/`sameAs` metadata on personal websites. Search public GitHub projects for podcast/feed parsing, conference data, schema.org extraction, and identity evidence; adopt only with license review.

RIGHTS RULES
- Metadata/evidence pointers are the default.
- Transcript/audio/video acquisition is a separate rights-gated capability.
- Do not persist an unlicensed transcript corpus, bypass authentication, or treat public visibility as reuse permission.
- Record current terms revision, attribution, quota, deletion/update method, and source-specific retention boundary.
- Reddit, X, LinkedIn, Goodreads, and similar sources remain discovery-only unless current explicit access/reuse rights support the exact pilot.

OBSERVATION ENVELOPE
Each record includes source snapshot/native ID/times/terms/rights/hash; subject kind/native ID/label/attributes; identifiers with scope/stability/uniqueness/evidence; contributions, relationships, evidence, raw pointer; no canonical ID.

COHORT
Create a reproducible cohort of about 250 high-overlap people seeded from current GitHub creators and modern authors. Include hosts, guests, speakers, authors, editors, interviewers, maintainers, podcasts, episodes, channels, videos, talks, conferences, courses, articles/newsletters where explicitly addressable, and organisations.

MODEL RULES
- Show, channel, podcast, episode, video, talk, event, course, article, and book are distinct source-native Works/Events.
- Host, guest, speaker, author, editor, interviewer, maintainer, and channel-owner are contribution roles.
- Match evidence comes from stable platform IDs, explicit websites, ORCID, linked profiles, feed metadata, or manually reviewable receipts—not name similarity alone.
- Show/channel identity stays separate from the operating human or organisation.

MEASURE
Cross-domain candidates, domain count/person, strong bridge rate, reviewed precision, Works/appearances per person, quota/cost, freshness, removal coverage, and rights completeness. Compare against the current documented three-person stitch baseline without pretending a candidate is an accepted identity.

DELIVERABLES
Adapters, fixtures, envelope exporter, cohort manifest, metrics, identity-evidence review, source method cards, removal/update workflow, and scale verdict.

ACCEPTANCE
Offline tests pass; every bridge has literal evidence; no unlicensed media/transcript corpus is committed. Commit, push, and open a draft PR titled `Pilot: add living creator and media observations`. Final response: branch, commits, PR, cohort metrics, reviewed precision, quota/rights constraints, and best next source.
```

---

## Prompt 12 — Claims, positions, temporal relationships, and derived projections

```text
You are the reasoning-depth agent for sisodias/siso-people-graph. Work now from current main and build a self-contained claims/relationships layer over tiny fixtures and existing v2 data where available. Do not wait for a v3 schema or query PR.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/claims-temporal-relations-20260806`

EXCLUSIVE PATH OWNERSHIP
- `claims/**`
- `projections/**`
- `tests/claims/**`
- `docs/reasoning/**`
- `docs/handoffs/claims-relations.md`
Do not edit core schema, identity, build, query, source adapters, README, or root config. Keep lane-local DDL/fixtures under `claims/fixtures/`.

PARALLEL RULE
Expose import/export interfaces that can later map to v3, but do not require it. A missing canonical Work table is solved with a lane-local adapter, not a dependency.

MISSION
Give the graph depth rather than just breadth. Enable evidence-backed questions about what a person argued, how a position changed, who collaborated with/cited/funded/translated/hosted/mentored whom, and which conclusions are observations, accepted claims, derived structure, or model hypotheses.

CLAIM CONTRACT
Represent separately:
- precise evidence locator and a short rights-compliant evidence span where permitted;
- source-grounded atomic claim/summary;
- subject, predicate, object/value, topic, time, and scope;
- extraction method/model/version and input digest;
- confidence plus proposed/accepted/rejected/contested state;
- supports/challenges/contradicts edges;
- review/decision lineage;
- rights/publication state and removal handling.
A person never “believes topic X” merely because a Work has a topic/classification.

RELATIONSHIPS
Implement/evaluate evidenced temporal relations including co-created, cited, referenced, translated, edited, maintained, depended_on, affiliated_with, funded_by, advised/mentored, appeared_on, hosted, spoke_at, and contemporary_with. Each relation carries source, valid/observed time, confidence, and review state.

PROJECTIONS
Coauthor, influence, expertise, centrality, trajectory, topic affinity, and prominence must be named/versioned projections with method cards, source scope, timestamp, uncertainty, and reproducible inputs. No universal stored score.

PILOT
Use a question-driven sample of about 20 people and three topics. Prefer public-domain Book Library text and clearly licensed sources. For copyrighted material retain compliant excerpts/locators, not full text. Include one changed position, disagreement, translation/editorial role, cross-domain creator, organisation, and ambiguous attribution.

INTERFACES
- Import current `person_content`/Book Library fixtures and `pg-observation-0.1` evidence without canonicalizing identities.
- Export claims/relations in versioned JSON.
- Provide a review CLI and example queries independent of the main query agent.

MEASURE
Claim precision on a manually reviewed sample, evidence-locator completeness, reviewer time, contradiction detection usefulness, projection sensitivity, and rights coverage. State limits clearly.

ACCEPTANCE
Every output traces to evidence and labels observation/accepted claim/derivation/model inference. Offline tests pass. Commit, push, and open a draft PR titled `Reasoning: add claims and temporal relationships`. Final response: branch, commits, PR, pilot results, reviewed precision, rights handling, and integration seams.
```

---

## Prompt 13 — Parallel integration contract and merge-risk sweeper

```text
You are the integration-contract and merge-risk agent for sisodias/siso-people-graph. You are also launched at the same time as all other agents. Do not wait for them. Inspect whatever open PRs exist at the moment you start; if none exist yet, build the integration harness against current main and the shared observation contract.

REPOSITORIES
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

BRANCH
`pg/parallel-integration-contract-20260806`

EXCLUSIVE PATH OWNERSHIP
- `integration/**`
- `tests/integration_parallel/**`
- `docs/integration/**`
- `docs/handoffs/integration-contract.md`
Do not edit schema, loaders, identity, query, claims, source adapters, README, or root config.

PARALLEL RULE
This is not a final-release dependency. Produce a reusable contract/harness now. Review open PRs visible at launch, but do not require them to finish and do not cherry-pick unreviewed branches.

MISSION
Create the compatibility spine that lets independent branches be evaluated and combined later without guessing their assumptions.

REQUIRED WORK
1. Define executable validators for `pg-observation-0.1`, including rights, source snapshot, payload hash, identifier semantics, and prohibition on canonical IDs/name-only merges.
2. Build an adapter interface for:
   - current v2 people/content/topic/external-ID tables;
   - Book Library observation exports;
   - source-pilot NDJSON envelopes;
   - future v3 source-observation/canonical/claim tables when detected.
3. Create a capability matrix that detects which schema/query/identity/build/claim features are present and marks missing capabilities explicitly.
4. Build cross-lane contract tests using tiny fixtures: one source observation should survive import/export without identity resolution; accepted identity should remain separate from source facts; Works/roles/rights/provenance must not be lost; non-unique attributes must not become identifiers.
5. Inspect current open PRs and produce a merge-risk review: overlapping paths, incompatible contracts, duplicated abstractions, migrations, root-config conflicts, security/rights concerns, and suggested resolution. If no PR exists yet, write the review template and current-main baseline.
6. Create `docs/integration/parallel-lane-matrix.md` listing every expected lane, owned paths, expected artifacts, validation commands, and compatibility seam. This is a merge aid, not a launch dependency graph.
7. Define an adversarial release checklist for identity, reproducibility, graph integrity, Book integration, query provenance, rights/deletion, and performance. Do not publish a release or Great Library Snapshot.
8. Provide a repeatable command that a later agent can rerun after any subset of PRs merges.

ACCEPTANCE
- Contract validators and integration tests pass offline against lane-local fixtures.
- Current main's capabilities and failures are reported honestly.
- No other lane's paths are changed.
- Commit, push, and open a draft PR titled `Integration: add the parallel People Graph contract harness`.
- Final response: branch, commits, PR, tests, open-PR review at launch time, merge risks, and rerun command.
```

---

## What the user should expect after launching all prompts

The useful outcome is not thirteen agents all editing the same schema. It is thirteen **draft PRs with narrow ownership**:

- one Great Library control-plane PR;
- one Book Library implementation PR;
- eleven non-overlapping People Graph research/implementation PRs.

Each PR can succeed independently from current `main`. Some will be merge-ready; some will reveal incompatible assumptions or produce pilots that should be killed. That is expected. The integration-contract PR gives a later agent a repeatable way to evaluate any subset without having required a launch order.
