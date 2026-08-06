# Complete People Graph audit and decision record

**Observed:** 2026-08-06T23:03:01+07:00  
**Baselines:**

- Great Library: `12f4cc249b2b5dc268d05d1698fe9c5e3079327d`
- People Graph: `de048bb3b34bf931b56fd741cb46c1334acdfb98`
- Book Library: `be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b`

## 1. Question being answered

What are these repositories trying to become, what did the initial People Graph implementation get right, what important abstractions or safety constraints are missing, and which coordinated investments can increase decision value by roughly two orders of magnitude without merely increasing row count?

## 2. Constraints and non-goals

- Oracle is unrelated and was excluded.
- No private client source, credentials, machine paths, raw operational database or rights-unclear corpus may enter the public repository.
- Public repository visibility is not treated as permission to redistribute source or data.
- The Great Library must remain a registry and public reading surface, not a mutable data warehouse.
- The audit distinguishes tracked source code from claims about release assets.
- The full production People Graph SQLite asset was not independently downloaded and audited during the initial pass.
- Hidden model scratchpad text is not evidence. This document records inspectable reasoning, evidence, alternatives and calculations instead.

## 3. Method

### 3.1 Repository orientation

The audit read the three repository READMEs, recent commits, relevant schemas, every tracked People Graph loader, the People Graph query surface, Book Library builders/export/locator/tier queries, and the Great Library's agent guide, current state, registry model, mission, Knowledge boundary, question architecture, source inventory and active snapshot lineage.

### 3.2 Contract extraction

Statements in comments and documentation were converted into invariants:

- one canonical entity must not be silently created by name equality;
- roles belong on contribution edges;
- merges must be reversible;
- source vocabularies stay namespaced;
- BCE dates must remain queryable;
- derived scores must not drift from evidence;
- source provenance and observation time must be retained;
- the Great Library records identity and lineage rather than absorbing raw payloads.

### 3.3 Code-path tracing

For every high-risk conclusion, the write path and read path were followed together. For example, identity risk was not inferred from a single function: `enrich_owners.py` was traced into `external_ids`, then `match_identities.py` was traced over those rows, then `ask.py` was checked to determine whether accepted claims affected normal reads.

### 3.4 Contradiction testing

The audit compared declared design principles with executable behavior. Important contradictions included:

- "identity claims, never silent merges" versus builder-level normalized-name fusion;
- "nothing derived is stored" versus one `rank_score` carrying several incompatible units;
- documented checksum fields versus the tracked locator schema;
- a "deduped" queue versus more rows than distinct Works;
- source observations versus direct mutation of canonical labels and kind.

### 3.5 Architecture decomposition

The system was decomposed into independently owned jobs rather than repository folders:

1. public identity, lineage and selection;
2. source discovery and monitoring;
3. mutable observation/data plane;
4. canonical entity/Work/relationship service;
5. evidence-to-claim transformation and adjudication;
6. decision-facing query and reading surfaces.

### 3.6 Value analysis

The graph was assessed against questions it should answer, not database size. High-value dimensions were defined separately: strong identity bridges, Work coverage, role depth, temporal relationships, claim/evidence depth, rights/removal coverage, source freshness, reproducibility, ambiguity visibility and measured decision impact.

### 3.7 Agent-program design

The first prompt pack used an explicit dependency graph. That was replaced after the user pointed out that ChatGPT/Codex web agents cannot launch or orchestrate other agents. The final pack uses current-main starts, exclusive paths, additive adapters and draft-PR handoffs so all lanes can run simultaneously.


## 4. Reconstructed system thesis

The strongest coherent thesis is:

> The People Graph is an evidence-backed map from a human, organisation or pseudonym to the identities they used, the Works they helped create, the people and institutions around them, and the defensible claims about what they contributed or argued—while preserving source, time, rights, uncertainty and reversibility.

The repositories then have distinct jobs:

| System | Responsibility | Must not become |
| --- | --- | --- |
| Great Library | Stable public Work identities, Releases, Snapshots, Decisions, Events, source inventories and safe reading surfaces. | Mutable graph database, raw corpus store or execution authority. |
| People Graph | Canonical entity/Work/relationship/claim intelligence and evidence-first research queries. | A bag of source rows or one popularity leaderboard. |
| Book Library | Reproducible book-source index, contributors, classifications, rights, locations and versioned graph observations. | The canonical cross-domain identity authority. |
| Foundry | Source discovery, evaluation, acquisition planning and monitoring. | Accepted truth or silent identity merger. |
| SISO Knowledge | Durable corpus/index/graph service governance and retrieval contracts. | Public registry or uncontrolled source scraper. |
| Evidence Engines | Source-grounded transformation, claim extraction, contradiction analysis and adjudication. | Authority to alter source facts without evidence. |
| External data plane | Mutable databases, raw/restricted snapshots, payload archives, deletion queues, caches and private receipts. | Public Git history. |

The exact canonical-service ownership between People Graph and SISO Knowledge was ambiguous in the baselines. Great Library draft PR #1 now proposes ADR-0005; it should be reviewed rather than treated as accepted merely because it exists.

## 5. What the initial implementation got right

- It made creators first-class rather than treating content as anonymous files.
- It preserved contributor roles on edges.
- It recognized organisations separately from humans.
- It retained BCE dates as negative years.
- It used namespaced source identities.
- It introduced explicit identity claims and non-destructive merge intent.
- It kept topic vocabularies separate.
- It added provenance fields to content edges.
- It built a read-only multi-domain query router.
- It stated the structural cross-domain-overlap limitation honestly rather than claiming matching alone could solve it.
- The Book Library separated small indexes from large release assets and demonstrated addressable source retrieval.

Those are valuable foundations. The audit is not an argument to discard them; it is an argument to make the implementation obey its own strongest principles.

## 6. Missing product layers

One membership rule—"produced something"—is useful for coverage but insufficient for product semantics. The project needs three explicit surfaces:

1. **Observed creator universe:** source-native people, organisations, accounts, Works and unresolved records. High recall; no claim of canonical identity.
2. **Resolved People Graph:** accepted entities, identifiers, Works, roles and relationships with conflict-aware reversible identity decisions.
3. **Research dossiers:** deeply evidenced people and organisations with timelines, claims, contradictions, influence paths, source coverage and question relevance.

This prevents millions of shallow account observations from being presented as equivalent to deeply resolved humans.


## 7. Major missing objects and semantics

### 7.1 Immutable source observations

Every source adapter should preserve source ID, snapshot/revision, source-native record ID, acquisition method, observed/retrieved time, raw digest, terms revision, rights state, attribution, removal obligations and a pointer to replayable evidence. Canonicalization must happen later.

### 7.2 Identifier registry

Each scheme needs issuer, scope, uniqueness, mutability, valid time and confidence semantics. Examples:

- GitHub numeric account ID: source-scoped stable account identifier.
- GitHub login: mutable alias.
- ORCID, VIAF, ISNI, Wikidata, ROR and OpenAlex IDs: authority identifiers with issuer-specific contracts.
- Website/domain: potentially strong cross-link evidence, but ownership can change.
- Name, employer, location, biography and topic: non-unique attributes; never exact identity.

### 7.3 First-class Works and versions

A Work cannot remain only a title and source reference inside `person_content`. The graph needs Work, version/expression/edition/release, contribution roles, Work-to-Work citations/dependencies/adaptations/translations/forks and locators.

### 7.4 Temporal relationships

Affiliation, collaboration, funding, mentorship, maintenance, hosting, speaking, authorship and identity aliases need valid-time ranges and evidence. "Worked at X" without source or time is too weak for serious reasoning.

### 7.5 Claims and positions

Topic membership is not belief. A source-grounded claim needs subject, predicate, object/value, Work/version, evidence locator, compliant excerpt when permitted, valid time, extraction method/model, confidence, review decision, support/challenge/contradiction links and rights/publication state.

### 7.6 Named projections

Expertise, influence, centrality, prominence, momentum and topic affinity should be versioned projections over declared inputs. They should never be one mutable canonical score.

### 7.7 Correction and deletion lineage

The system needs source-specific tombstones/removal handling, canonical-decision reversals, impacted-projection invalidation and a public-safe correction receipt. Retaining historic evidence does not imply retaining content whose removal terms require deletion.


## 8. Findings register

The machine-readable register is [`findings.json`](findings.json).


| ID | Severity | Finding | Blocks |
| --- | --- | --- | --- |
| `PG-AUDIT-001` | P0 | Non-unique attributes can be promoted to near-certain identity evidence | bulk identity auto-accept, production canonical clustering |
| `PG-AUDIT-002` | P0 | Accepted identity claims are not a complete canonical resolution mechanism | claiming one canonical person per human |
| `PG-AUDIT-003` | P0 | The v2 build path silently merges by normalized name despite the stated identity policy | fresh production rebuild from mixed domains |
| `PG-AUDIT-004` | P0 | Clean-checkout v2 schema path appears inconsistent with repository layout | reproducible release claim |
| `PG-AUDIT-005` | P1 | rank_score mixes incompatible units and can drift on rerun | trustworthy cross-domain ranking |
| `PG-AUDIT-006` | P1 | Source enrichment mutates canonical identity fields | — |
| `PG-AUDIT-007` | P1 | GitHub enrichment and topic loaders are coupled to origin and ID prefix | — |
| `PG-AUDIT-008` | P1 | A Work is embedded in person_content rather than represented as a first-class entity | 100x research-depth goal |
| `PG-AUDIT-009` | P1 | Observation, canonical decision and derived projection are not consistently separated | safe 10x ingestion |
| `PG-AUDIT-010` | P1 | Book Library reruns can retain stale relational metadata | incremental refresh trust |
| `PG-AUDIT-011` | P1 | The documented extraction queue is not one row per Work | — |
| `PG-AUDIT-012` | P1 | Locator documentation and tracked locator schema are not fully aligned | independent payload-integrity verification |
| `PG-AUDIT-013` | Governance | Repository ownership and system responsibility were ambiguous | — |

### PG-AUDIT-001 — Non-unique attributes can be promoted to near-certain identity evidence

**Severity:** P0  
**Status:** source-proven; independently fixture-tested by draft PR  
**Reasoning:** An employer, city, display name or website string is an attribute, not a source-issued unique identifier. If two people share such a value, the matcher can generate a near-certain same-person claim. The schema does not encode identifier uniqueness semantics, so the error is structural rather than a single bad threshold.  
**Blast radius:** Any auto-accept or downstream clustering based on shared_external_id can fuse unrelated humans or organisations.  
**Recommended action:** Introduce an identifier registry with issuer, uniqueness scope, stability and lifecycle. Exclude non-unique attributes from exact-identifier rules; retain them only as weak positive or negative evidence.

Evidence:

- `loaders/enrich_owners.py` — Stores company, location and real_name values in external_ids.
- `loaders/match_identities.py` — Treats any duplicated external_ids platform/value pair as shared_external_id confidence 0.98.
- `https://github.com/sisodias/siso-people-graph/pull/1` — Red-team lane reports executable fixtures for current identity failure modes.


### PG-AUDIT-002 — Accepted identity claims are not a complete canonical resolution mechanism

**Severity:** P0  
**Status:** source-proven  
**Reasoning:** Pairwise claims are evidence, not a canonical entity. Normal read paths can still return several records for one human, select an empty record, or miss Works and dates held by a duplicate. Accepted claims need conflict-aware transitive resolution, a canonical redirect, and reversible decision lineage.  
**Blast radius:** Core who/works/topic/contemporary queries can remain fragmented even after review work is completed.  
**Recommended action:** Separate evidence claims from accepted cluster decisions; add conflict guards, deterministic cluster export, canonical redirects and undo receipts. Make all query surfaces use the resolved view explicitly.

Evidence:

- `loaders/match_identities.py` — Writes proposed/accepted pairwise claims but does not materialize a safe transitive cluster.
- `loaders/ask.py` — Queries person rows directly and does not resolve accepted claims or redirects.


### PG-AUDIT-003 — The v2 build path silently merges by normalized name despite the stated identity policy

**Severity:** P0  
**Status:** source-proven  
**Reasoning:** The README and schema commentary correctly say name matching must create reviewable identity claims. The builders bypass that invariant and mutate canonical membership directly. At scale, common names and transliteration collisions make silent false fusion inevitable.  
**Blast radius:** A rebuild can permanently assign Works, dates and topics to the wrong canonical row before the review layer runs.  
**Recommended action:** Import source-native observations first. Generate identity candidates separately. Rebuild canonical tables only from accepted decisions.

Evidence:

- `loaders/build_people_graph_v2.py` — Reuses an existing person ID when lowercased normalized names match.
- `sisodias/siso-book-library:scripts/load_into_people_graph.py` — Old Book export also matches canonical people by normalized name.


### PG-AUDIT-004 — Clean-checkout v2 schema path appears inconsistent with repository layout

**Severity:** P0  
**Status:** source-proven; red-team fixture exists in draft PR  
**Reasoning:** A deterministic rebuild contract starts with a clean checkout. A path that only works in an untracked local layout means the published source is not yet the complete build recipe.  
**Blast radius:** External agents cannot independently reproduce the graph from the tracked repository.  
**Recommended action:** Fix path resolution, add a clean-checkout fixture build and publish exact input manifests and digests.

Evidence:

- `loaders/build_people_graph_v2.py` — Resolves people_schema_v2.sql relative to the loaders directory.
- `schema/people_schema_v2.sql` — Tracked schema is under schema/, not loaders/.
- `https://github.com/sisodias/siso-people-graph/pull/1` — Clean-checkout path is one of the executable red-team cases.


### PG-AUDIT-005 — rank_score mixes incompatible units and can drift on rerun

**Severity:** P1  
**Status:** source-proven  
**Reasoning:** Work count, stars, followers and model-rated value have different dimensions, bias profiles and time semantics. Adding or overwriting them creates a number with no stable interpretation. A repeated additive loader can also change the value without new evidence.  
**Blast radius:** Ordering, enrichment priority and any downstream tiering can be arbitrary or non-reproducible.  
**Recommended action:** Store timestamped metric observations by scheme. Publish named/versioned projections with method cards; do not keep one universal canonical score.

Evidence:

- `loaders/build_people_graph_v2.py` — Book work count enters rank_score.
- `loaders/load_owners_into_people_graph.py` — Summed repository stars enter rank_score.
- `loaders/load_owner_topics.py` — Model-rated repository value is added to rank_score on apply.
- `loaders/enrich_owners.py` — GitHub follower count overwrites rank_score.


### PG-AUDIT-006 — Source enrichment mutates canonical identity fields

**Severity:** P1  
**Status:** source-proven  
**Reasoning:** A GitHub profile name is one source observation and can be a project name, joke, stale value or organisation label. It should not silently replace a reviewed canonical label. Source facts, canonical decisions and build metadata need separate tables.  
**Blast radius:** Canonical names and entity kind can change due to source refresh without review or history.  
**Recommended action:** Write immutable profile observations and aliases. Derive or review canonical labels separately with provenance.

Evidence:

- `loaders/enrich_owners.py` — Updates person.kind, person.name, person.rank_score and person.built_at from one GitHub response.


### PG-AUDIT-007 — GitHub enrichment and topic loaders are coupled to origin and ID prefix

**Severity:** P1  
**Status:** source-proven  
**Reasoning:** A canonical human first discovered in books or a registry may later acquire a GitHub identity. Origin and canonical ID namespace should not determine which source observations can attach to the entity.  
**Blast radius:** The exact cross-domain people the graph values most can miss GitHub enrichment and topics.  
**Recommended action:** Join source adapters through source-scoped identifier observations and accepted identity clusters, not canonical ID prefixes or first-origin fields.

Evidence:

- `loaders/enrich_owners.py` — Only selects person.origin='github'.
- `loaders/load_owner_topics.py` — Builds known owners from person_id LIKE 'gh:%'.


### PG-AUDIT-008 — A Work is embedded in person_content rather than represented as a first-class entity

**Severity:** P1  
**Status:** architecture gap; v3 draft PR addresses it  
**Reasoning:** Without a Work node, the graph cannot reliably represent multi-contributor Works, versions, editions, releases, translations, forks, citations, dependencies, adaptations, podcast show/episode structure, or model–dataset–Space relationships.  
**Blast radius:** Depth cannot grow cleanly; source-specific content references become the de facto ontology.  
**Recommended action:** Adopt first-class Work and Work-version entities, role-bearing contributions and typed Work-to-Work relations.

Evidence:

- `schema/people_schema_v2.sql` — person_content stores domain, content_ref, role and title on the contribution edge but has no canonical Work table.
- `https://github.com/sisodias/siso-people-graph/pull/3` — Draft v3 ontology adds first-class Works, versions and contribution relationships.


### PG-AUDIT-009 — Observation, canonical decision and derived projection are not consistently separated

**Severity:** P1  
**Status:** architecture gap; parallel branches converge on a replacement contract  
**Reasoning:** Trustworthy correction requires retaining what a source said, what was proposed, what was accepted and what was derived. Collapsing those layers makes refreshes and corrections destructive and obscures authority.  
**Blast radius:** Every source expansion increases correction cost and weakens auditability unless the separation is established first.  
**Recommended action:** Stabilize the observation envelope and accepted-decision interfaces before any large ingest.

Evidence:

- `schema/people_schema_v2.sql` — Canonical person rows mix origin facts, names, state, tiers and rank.
- `https://github.com/sisodias/great-library-of-siso/pull/1` — Program-spine PR publishes pg-observation-0.1 and an ownership/data-plane decision.
- `https://github.com/sisodias/siso-people-graph/pull/2` — Software/AI pilot emits observation envelopes and explicitly refuses canonical IDs and universal scores.
- `https://github.com/sisodias/siso-people-graph/pull/3` — V3 schema draft separates observations, entities, identity, assertions and projections.


### PG-AUDIT-010 — Book Library reruns can retain stale relational metadata

**Severity:** P1  
**Status:** source-proven; dedicated Book lane has not pushed a branch as of this record  
**Reasoning:** If upstream removes or corrects a classification, rebuilding into an existing database can retain the old edge. Deterministic source snapshots require replacement semantics or rebuilding from an empty database.  
**Blast radius:** Topic, shelf, extraction and People Graph exports can contain stale facts.  
**Recommended action:** Build from empty outputs or delete/reinsert all source-owned relations per record/snapshot; publish logical digests and changed-snapshot tests.

Evidence:

- `scripts/build_books_module.py` — Main book row is replaced, while subject/shelf/class rows are inserted with INSERT OR IGNORE and are not source-replaced per book.


### PG-AUDIT-011 — The documented extraction queue is not one row per Work

**Severity:** P1  
**Status:** source-proven  
**Reasoning:** SQL UNION removes only identical complete rows. Different reason values preserve duplicates, contradicting the stated deduplication claim.  
**Blast radius:** Extraction planning can double-count Works and distort token/cost estimates.  
**Recommended action:** Aggregate reasons per gid and select priority in a separate deterministic step.

Evidence:

- `index/tier_queries.sql` — UNION rows retain different reason/tier values for the same gid.
- `https://github.com/sisodias/siso-book-library/commit/3a5d1875b395342730205100e99443308d3263e3` — Commit reports 19,532 queue rows for 17,750 distinct books.


### PG-AUDIT-012 — Locator documentation and tracked locator schema are not fully aligned

**Severity:** P1  
**Status:** source/documentation contradiction  
**Reasoning:** A release can contain a richer generated locator than the tracked builder, but then the public source is not yet the complete recipe. The mismatch must be resolved before claiming independent reproducibility.  
**Blast radius:** Agents cannot know whether integrity receipts are reproducible from tracked code.  
**Recommended action:** Version the locator schema and ship a fixture packer/checksum verifier that reproduces the documented shape.

Evidence:

- `scripts/build_locator.py` — Tracked location table has offset and length but no per-book sha256 column.
- `https://github.com/sisodias/siso-book-library/commit/be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b` — README claims locator.sqlite maps every gid to asset, offset, length and sha256.


### PG-AUDIT-013 — Repository ownership and system responsibility were ambiguous

**Severity:** Governance  
**Status:** identified in audit; draft ADR now exists in Great Library PR #1  
**Reasoning:** Without a named boundary, source discovery, canonical identity, evidence adjudication, public lineage and mutable databases can drift into whichever repository an agent is editing.  
**Blast radius:** Parallel work duplicates abstractions and weakens accountability.  
**Recommended action:** Review and either accept or supersede ADR-0005 before production integration. Keep source repositories independent and mutable data outside the Great Library Git tree.

Evidence:

- `sisodias/siso-people-graph:README.md` — Describes People Graph as part of SISO Foundry.
- `sisodias/great-library-of-siso:docs/siso-knowledge-model.html` — Assigns canonical knowledge records, indexes, graphs and queries to SISO Knowledge.
- `https://github.com/sisodias/great-library-of-siso/pull/1` — Draft ADR-0005 proposes a control-plane/data-plane split.


## 9. Alternatives considered

### Alternative A — Patch v2 in place and immediately ingest more sources

**Rejected as the primary path.** Targeted P0 fixes are necessary, but v2 lacks first-class Works, declared identifier semantics, a source-observation layer and a complete canonical cluster model. Large ingestion would increase correction cost faster than value.

### Alternative B — Put the entire graph and corpus in the Great Library

**Rejected.** It violates the Library's accepted identity/lineage boundary, makes immutable Git history carry mutable data and creates privacy/rights/deletion problems.

### Alternative C — Let Foundry own discovery, canonical identity, evidence transformation and query truth

**Rejected.** It collapses independent authorities and makes a discovery result look like accepted truth. Foundry should emit source observations and watch signals.

### Alternative D — Make People Graph an independently addressable Work/service, governed through SISO Knowledge contracts, with Great Library lineage and external mutable data

**Recommended direction, pending ADR review.** This keeps the source repository independently releasable, lets Knowledge govern durable graph/index service contracts, preserves Great Library identity and lineage, and leaves raw/restricted mutable data in the external plane.

### Alternative E — Replace SQLite immediately with a graph database

**Deferred.** The primary risks are semantics, identity safety, provenance and reproducibility—not SQL syntax. A well-designed relational evidence model can validate the ontology before committing to a serving engine. Physical sharding or a graph-native read projection should follow measured query needs.

## 10. 10× data versus 100× value

Ten times more rows can come from scholarly, authority, software, package, AI, media, public-discussion, patent, grant and institutional sources. That alone is not success.

The value thesis is multiplicative:

`decision value ≈ identity precision × Work/relationship depth × evidence traceability × query relevance × freshness × reversibility × lawful usability`

If any factor is near zero, scale creates a larger but less useful graph.

### Separate scorecard dimensions

- strong source-issued identity bridges;
- manually reviewed precision and candidate recall;
- first-class Works and versions per resolved entity;
- role and contribution coverage;
- temporal relationship coverage;
- claim/evidence locator coverage;
- ambiguity surfaced rather than hidden;
- rights/terms/removal coverage;
- reproducible source snapshots and logical digests;
- query latency and explainability;
- cold-agent answer reconstruction;
- measured changes to a real decision or Frontier Question;
- cost per useful new bridge, Work, relationship and reviewed claim.

### Highest-information early populations

1. Living technical authors already connected to GitHub, papers or talks.
2. Researchers with ORCID/OpenAlex/Crossref/DBLP/ROR identifiers.
3. Package and repository maintainers with stable source IDs and transfer history.
4. Hugging Face model, dataset and Space creators.
5. Podcast hosts/guests and conference speakers with explicit linked profiles.
6. Historical authors with VIAF/LoC/Wikidata/Open Library authority bridges.
7. Inventors, grants and institutional affiliations after the deletion/provenance harness is proven.

### Sources to restrict by default

Reddit, X, LinkedIn, Goodreads, Google Scholar, Crunchbase and any source without a permitted durable reuse path should remain discovery-only, agreement-required or rejected until current terms and removal obligations are satisfied. The current source portfolio is maintained in Great Library draft PR #2 rather than duplicated as an unversioned list here.

## 11. Workings and calculations

### 11.1 Current documented baseline

The pinned People Graph README reports 280,708 people, 564,486 Works/content references, 2,050,629 topic edges and 253,815 platform identities. It reports only three cross-domain stitched people and explains the Gutenberg/GitHub population mismatch. These are source-repository claims, not an independent production database recount.

### 11.2 Why name enrichment cannot solve overlap alone

The source repository measured that most Gutenberg creators are historical while GitHub owners are contemporary. Converting a login to a real name can improve classification and candidate generation, but it cannot create overlapping populations that do not exist. Therefore source strategy must add modern books, papers, packages, talks, podcasts and other living-creator Works.

### 11.3 Why extraction must be question-driven

Great Library GQ-009 records a measured corpus-scale result: extracting claims from every passage would exceed the available token budget by orders of magnitude. The design consequence is to retrieve evidence for specific questions and candidate claims, then extract/review only high-information spans.

### 11.4 Why the extraction queue duplication matters

The Book Library commit reports 19,532 queue rows and 17,750 distinct books. Difference: `19,532 - 17,750 = 1,782` extra queue rows. Those rows may be legitimate multiple reasons, but they are not a one-row-per-Work queue and should be represented as aggregated reasons rather than silently counted as separate extraction units.

### 11.5 Why universal rank is invalid

A dimensional check is sufficient:

- work count: count of authored Works;
- stars: popularity/age-biased repository observation;
- followers: account reach observation at a timestamp;
- model-rated value: model output with a method/version;

Adding these values has no defined unit. Even a numerically deterministic sum is semantically undefined.

## 12. Prompt-program evolution

The original 13-prompt pack used a coordinator and dependency order. It was logically clean but operationally mismatched to the web UI: one ChatGPT/Codex chat cannot launch another and the user wanted to start every lane at once.

The revised pack preserves coordination through:

- exact current-main start rules;
- exclusive non-overlapping paths;
- lane-local adapters and fixtures when a future interface is absent;
- a common `pg-observation-0.1` exchange envelope;
- draft PRs with structured handoffs;
- an integration-contract lane that runs immediately rather than waiting.

Both prompt packs are retained under `prompts/` so future agents can understand the design change rather than seeing only the final state.

## 13. Live swarm interpretation

A branch name is not evidence that work was pushed. The status audit compares every expected branch to `main`:

- `draft_pr`: non-empty branch with an open draft PR;
- `pushed_no_pr`: non-empty branch, no draft PR observed;
- `branch_reserved_empty`: branch exists but is identical to `main`;
- `absent`: expected branch not observed;
- `diverged_unreviewed`: unrelated/older branch that must not be silently mapped to a current prompt.

This corrected an earlier conversational summary that treated every branch as pushed work. The durable status is in `swarm-status-2026-08-06.json`.

## 14. Review and promotion gates

Before production ingestion or a v3 release:

1. Convert every identity P0 fixture relevant to the selected architecture from expected failure to pass.
2. Review and settle the ownership/data-plane ADR.
3. Stabilize a source-observation envelope and deletion drill.
4. Establish an identity benchmark with reviewed positive and negative pairs.
5. Prove clean-checkout fixture builds, source replacement, logical digests and manifests.
6. Select a first-class Work/contribution model and query adapter.
7. Prove ambiguity-aware who/works/path/timeline/claim queries.
8. Run rights/terms/removal review for each promoted source.
9. Pilot high-overlap cohorts before all-source bulk ingestion.
10. Download/rebuild and independently audit the production asset before claiming current counts or quality.
11. Publish exact Release receipts and select them through a successor Great Library Snapshot only after owning-repository verification.

## 15. Uncertainty and limits

- The audit proves source-code paths and documentation contradictions; it does not estimate how often each defect occurs in the production database unless a draft fixture or repository measurement says so.
- Draft PR test counts are contributor claims until a reviewer reruns them.
- Source terms and quotas can change; official pages must be checked at the start of each pilot.
- The source repository currently lacks a reviewed general reuse license at the pinned baseline; public visibility is not a license grant.
- The right physical serving engine for v3 remains open and should follow measured workloads.
