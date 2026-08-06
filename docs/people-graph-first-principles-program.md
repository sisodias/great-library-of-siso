# People Graph first-principles research program

**Date:** 2026-08-06  
**Status:** authored research proposal and cross-repository audit record; not an accepted ADR, Answer Release, or selected Snapshot  
**Repositories:** `sisodias/siso-people-graph`, `sisodias/siso-book-library`, `sisodias/great-library-of-siso`  
**Purpose:** preserve the full decision-complete derivation, evidence, uncertainty, target architecture, research portfolio, and implementation sequence for the People Graph and Book Library program

---

## 1. Decision target

Determine how the SISO People Graph and Book Library should evolve into a trustworthy, question-driven map of public knowledge production without becoming:

- a giant biography warehouse;
- an uncalibrated identity-merging system;
- a surveillance graph;
- a collection of unexplained scores;
- a source of inferred beliefs presented as fact;
- a second Great Library registry;
- an evidence system whose claims cannot dereference to source material.

The decision to change is:

> Which identity, source, evidence, temporal, Work/artifact, query, and release contracts must become foundational before the system expands to more source families, relationships, statements, and research products?

---

## 2. Re-derived answer

The People Graph should become the **actor-resolution and attribution plane** of the SISO question-driven research system.

The Book Library should remain a **source-domain data product** that preserves exact upstream records, source actors and roles, classifications, rights, artifacts, and retrieval routes.

The Great Library should remain the **durable public identity, release lineage, decision, and answer memory plane**.

Evidence Engines should own **source-span transformation, claim extraction, contradiction, and synthesis**.

The target system is:

```text
Frontier Question
  → declared evidence universe
  → pinned source snapshots
  → source actors, works, events, and artifacts
  → evidence-backed canonical actor assignments
  → contributions and dated public statements
  → supporting and challenging source spans
  → graded answer
  → immutable Answer Release
  → watch trigger and successor
```

The first milestone is not a target number of people or edges. It is a query that is truthful about identity, source coverage, uncertainty, evidence, truncation, and missing data.

---

## 3. Why this is a Great Library concern

The Great Library already defines the correct high-level separation:

- a Work has durable identity independent of location and category;
- a Release is an immutable evidence boundary for a version;
- a Snapshot selects a current view without rewriting history;
- a Source Inventory maps mixed or external source before promotion;
- Events and Decisions preserve operational motion and architectural rationale;
- Frontier Questions create durable demand while accepted answers move through immutable Releases.

The People Graph and Book Library are data and resolution systems that should be registered and cited through those primitives. Their large operational rows do not belong in the Great Library registry.

The Great Library must be able to say:

- what the People Graph is;
- what the Book Library is;
- which exact source and dataset release was evidenced;
- which artifacts are public and retrievable;
- which distribution and rights claims are supported;
- which Frontier Questions depend on those releases;
- what changed between releases;
- what remains unresolved.

It must not silently absorb their data plane or execution runtime.

---

## 4. First-principles value function

The system should not optimize raw graph size.

A useful approximation is:

```text
value ≈
  consequential questions answerable
  × identity precision
  × source and evidence coverage
  × artifact retrievability
  × freshness
  ÷ (correction cost + false-merge risk + unsupported inference)
```

This explains why ten times more data can reduce value. If added sources create ambiguous source actors, weak provenance, stale metrics, and unsupported inferred relationships, the graph becomes harder to trust and more expensive to correct.

The acquisition priority should therefore maximize expected information gain for active or standing questions per unit of:

- identity risk;
- rights risk;
- privacy risk;
- ingestion cost;
- update cost;
- evidence-addressability cost;
- maintenance burden.

---

## 5. System boundaries

### 5.1 Great Library — identity and public memory

Owns:

- independently addressable Works;
- immutable Releases;
- selected Snapshots;
- Frontier Question identity and answer lineage;
- publication-safe decisions, evidence references, and research contracts.

Does not own:

- hundreds of thousands of graph actor rows;
- raw corpora or operational databases;
- source-specific scraping and normalization;
- canonical identity execution;
- claim extraction runtime;
- private evidence payloads.

### 5.2 Book Library — source-domain truth

Owns:

- pinned Gutenberg snapshots;
- lossless catalog rows;
- source-local items;
- source actors and role-bearing attributions;
- source classifications;
- rights;
- artifact packaging and locators;
- a versioned normalized export.

Does not own:

- cross-domain canonical actor decisions;
- universal book value;
- direct writes into a People Graph internal schema;
- claims about what an actor believes.

### 5.3 People Graph — actor resolution and attribution

Owns:

- source actor ingestion;
- opaque canonical actors;
- evidence-backed assignments;
- aliases and identifiers through time;
- contributions and event participation;
- organizations and affiliations;
- reversible corrections;
- truthful cross-domain query contracts;
- portable read snapshots.

Does not own:

- source-domain parsing truth;
- accepted research answers;
- universal importance scores;
- unsupported psychological profiles;
- de-anonymization as a default objective.

### 5.4 Evidence Engines — source-grounded transformation

Owns:

- exact source-span extraction;
- candidate propositions;
- support and contradiction;
- interpretation status;
- evidence grading;
- question-specific synthesis.

Does not own:

- question identity;
- source artifact custody;
- canonical actor identity;
- approval or execution authority.

---

## 6. Category distinctions that must remain explicit

| Do not collapse | Reason |
| --- | --- |
| source record and human | Accounts, catalog strings, organizations, projects, and bots are source actors, not automatically humans. |
| account and actor | Control can change; one actor can have many accounts; one account can represent a group. |
| repository owner and creator | Ownership, authorship, maintenance, and contribution are distinct roles. |
| subject and belief | Classification of output does not prove endorsement or inner belief. |
| possible lifespan overlap and relationship | Temporal coexistence does not prove contact or influence. |
| shared attribute and identity | Names, employers, cities, topics, and generic websites are not issuer-unique IDs. |
| heuristic confidence and probability | Calibration requires a labelled benchmark. |
| popularity and value | Stars, followers, citations, dependency, pedagogy, and maintenance are different dimensions. |
| source reference and evidence | Evidence must dereference to a versioned artifact and exact relevant span. |
| indexed output and complete output | Completeness is always relative to a declared source universe and observation date. |
| Gutenberg item and abstract Work | Editions, translations, compilations, and artifacts require separate semantics when evidence supports them. |
| public data and ethical necessity | The graph should map public knowledge production, not aggregate every discoverable personal attribute. |

---

## 7. High-confidence implementation findings

The detailed evidence is preserved in the People Graph and Book Library audit branches. The following findings are high confidence because they are directly visible in source or reproduced with bounded SQLite fixtures.

### PG-P0-001 — Broken clean-build schema path

The V2 builder resolves `people_schema_v2.sql` from the `loaders/` directory, while the file lives under `schema/`.

### PG-P0-002 — Unsafe shared-attribute identity path

GitHub enrichment writes real names, company, location, and generic websites into `external_ids`. The matcher treats every repeated `(platform, value)` pair as `shared_external_id` at confidence `0.98` without an issuer-unique allowlist.

For 100 records sharing one employer or city, the pairwise loop can create 4,950 near-certain candidates.

### PG-P0-003 — Accepted claims do not affect queries

The schema records accepted identity claims, but `ask.py` does not read them. It chooses a raw same-name row with the most content.

### PG-P0-004 — Silent name merging still occurs

The V2 build maps book people into existing graph rows on lowercased, whitespace-normalized name equality. The Book Library also contains an older direct graph-write integration using normalized names.

### PG-P0-005 — Universal rank field has incompatible units

`rank_score` has represented work count, inherited rank, summed repository stars, model-rated repository value, and follower count. One loader adds to the existing value, making repeat runs non-idempotent.

### PG-P1-006 — FTS path fails and silently falls back

The qualified FTS expression used by `ask.py` raises `no such column: people.person_search` in a minimal SQLite reproduction. The exception is caught and the query falls back to `LIKE`.

### PG-P1-007 — “Everything produced” hides heuristic identity and truncation

The works query selects one name match, limits to 200 rows, reports the returned length as count, and exposes no truncation or source-universe completeness state.

### PG-P1-008 — Work classifications are rolled directly onto people

LCSH subjects, GitHub topics, and programming languages become `person_topic` rows. They are useful output-profile inputs but do not establish belief, expertise, or endorsement.

### PG-P1-009 — Lifetime overlap is stronger in language than evidence

The contemporaries view computes possible lifespan overlap and estimates unknown death as birth plus 80, while examples describe an actual historical conversation.

### PG-P1-010 — The canonical object is broader than a person

The schema and loaders already contain humans, organizations, pseudonyms, and unknown accounts, while some migrations hardcode humans. The correct internal abstraction is an actor, with accounts modeled separately.

### BL-P0-001 — Book Library directly mutates graph identity

The Book integration opens a graph database, normalized-name matches existing people, and writes canonical person and content rows.

### BL-P0-002 — Locator digest claim and builder schema diverge

The README says `locator.sqlite` maps GID to asset, offset, length, and SHA-256. The checked-in locator schema has no digest column and its builder scans offsets and lengths.

### BL-P0-003 — Rebuild content embeds an unpinned wall clock

The catalog builder writes current `fetched_at` values, which conflicts with a byte-for-byte deterministic rebuild claim unless the clock and environment are pinned.

### BL-P1-006 — Section-level policy filters the wrong semantic field

A class such as `QA` is stored as section `Q` and bookcase `QA`, while core policy compares one-letter values to `bookcase`, omitting intended subclasses.

### BL-P1-007 — Queue “deduplication” retains multiple reasons as rows

`UNION` deduplicates complete rows, so differing reason values preserve several queue rows for one GID. The commit’s own row and distinct-book counts demonstrate the gap.

### GQ-009 evidence finding — addressable summaries are not dereferenceable evidence

A Great Library watch-trigger evaluation found question-addressable exports whose records contained model summaries but no URL, quotation, or citation. They could not replace manual evidence links.

---

## 8. Re-derived canonical data model

The foundational pipeline is:

```text
observation → evidence → hypothesis → decision → projection
```

### 8.1 Source observations

```text
source_snapshot
source_actor
source_account
source_work_or_item
source_artifact
source_event
source_identifier
source_attribution
source_classification
```

These preserve what the source said.

### 8.2 Evidence receipts

```text
evidence_receipt
  source snapshot
  artifact identity and digest
  exact locator or span
  observation and event time
  assertion or extraction method
  method version
  rights state
  support/challenge direction
  review status
```

A URL alone is not enough. A summary alone is not enough.

### 8.3 Canonical actors

```text
actor
  opaque actor ID
  kind
  public label
  state
```

Suggested kinds:

```text
human
organization
collective
pseudonym_or_persona
automated_agent
unknown
```

### 8.4 Resolution assignments

```text
actor_resolution
  source actor
  canonical actor
  status
  policy version
  method
  score model
  score
  valid time
  decision provenance
```

Supporting and challenging evidence remain separate. Source rows are never destroyed by canonicalization.

### 8.5 Work, version, artifact, and contribution

```text
Work
  → expression or version
      → artifact or edition
          → locator

actor → contribution role → target level
```

The model should permit an unknown level when the source cannot support a stronger distinction.

### 8.6 Events and participation

```text
event series
event occurrence
session or episode
participation role
recording/transcript artifacts
```

Collaboration and co-appearance can be derived from shared structures. Friendship, influence, or intellectual relationship needs stronger evidence.

### 8.7 Public statements and positions

```text
actor
  → expressed | endorsed | rejected | questioned | predicted
  → proposition
  in exact source span
  at time
  with context and modality
```

A belief profile is an uncertain projection over public statements, not a primitive fact.

### 8.8 Typed metric observations

```text
metric_observation
  subject
  metric type
  value
  unit
  source
  observed time
  valid time
  method version
```

Named rankings derive from selected metrics. There is no universal stored importance score.

---

## 9. Query truth contract

Every agent-facing response should state:

- exact release or source snapshots;
- observation date;
- sources searched;
- expected but unavailable sources;
- identity resolution status;
- source actors participating;
- evidence supporting and challenging resolution;
- asserted versus derived fields;
- total and returned result counts;
- truncation or pagination;
- artifact retrieval routes;
- rights state;
- known coverage gaps.

No query may use “all” or “everything” without a declared source universe and completeness state.

---

## 10. Immutable release contract

Both data products should publish immutable bundles with:

```text
manifest.json
source snapshots
schema version
source repository commit
builder commit
policy versions
row counts
rights states
known gaps
validation report
checksums.sha256
portable SQLite snapshot
open interchange exports
```

The Book payload release additionally needs:

- checked-in packager;
- artifact and shard digests;
- locator built from final shard bytes;
- local range retrieval receipts;
- remote range retrieval receipts;
- immutable version-bound URIs.

Corrections create successor releases. Existing evidentiary bytes are not replaced beneath one version.

The Great Library should then register:

- SISO Book Library as a Work;
- SISO People Graph as a Work;
- exact software and dataset Releases;
- evidence-backed distribution state;
- a selected release through a new Snapshot only after validation.

Graph actors do not become individual Great Library Works.

---

## 11. Research portfolio

### R1 — Identity-resolution safety benchmark

Build labelled positive and negative source-actor pairs, multilingual and pseudonym fixtures, contradiction cases, calibrated policies, and split tests.

**Falsifier:** no automatic method achieves an acceptable measured false-merge rate on representative held-out cases.

### R2 — Shared evidence receipt contract

Define the minimum cross-system receipt for identity, attribution, participation, statements, relationships, support, and contradiction.

**Falsifier:** useful evidence cannot be referenced without either leaking private payloads or becoming impossible to dereference.

### R3 — Work/expression/artifact model

Find the smallest model that correctly handles translations, editions, releases, artifacts, repositories, videos, and compilations.

**Falsifier:** added distinctions do not change real queries or cannot be supported by source evidence.

### R4 — Query truth contract

Define and fixture actor, output, evidence, coverage, and change queries.

**Falsifier:** a bounded contract cannot express ambiguity and partial source availability without source-specific exceptions.

### R5 — Source-overlap economics

Rank source families by answer value, stable identifiers, event and contribution structure, evidence addressability, rights, privacy, overlap, and maintenance cost.

**Falsifier:** raw record count remains the only reliable predictor of question value after controlled pilots.

### R6 — Event and participation ontology

Pilot podcasts, conferences, talks, interviews, or courses as modern overlap bridges.

**Falsifier:** event sources add rows but do not improve canonical resolution or consequential queries enough to justify maintenance.

### R7 — Temporal and uncertainty semantics

Represent exact, circa, range, before, after, conflicting, and estimated time.

**Falsifier:** the added temporal model cannot improve a tested identity, overlap, or timeline query.

### R8 — Topic and concept crosswalk

Connect LCSH, GitHub topics, languages, conference tracks, and curated concepts with reversible mapping claims.

**Falsifier:** mappings create more false equivalence than cross-domain retrieval value.

### R9 — Immutable data release protocol

Prove clean build, independent verification, artifact checksums, and successor releases.

**Falsifier:** the release cannot be reproduced or validated from pinned public inputs and builder receipts.

### R10 — Public statement and position pilot

Extract dated propositions for one bounded Frontier Question with exact source spans and review gates.

**Falsifier:** the method repeatedly confuses quoted, reported, hypothetical, satirical, or third-party views with speaker endorsement.

---

## 12. Source acquisition order

After correctness contracts exist:

1. authority and stable-identity sources;
2. event-rich modern sources;
3. modern scholarly and technical output;
4. creator-controlled public surfaces;
5. bounded social and forum evidence.

Pseudonymous accounts remain pseudonymous unless the actor explicitly and publicly links the identities. Public availability does not itself justify de-anonymization or invasive aggregation.

---

## 13. Implementation sequence

### Milestone 0 — executable baseline

- fix build path;
- add clean fixtures and CI;
- reproduce current failures;
- pin public release artifact checksums;
- verify documented retrieval routes.

### Milestone 1 — identity safety

- allowlist issuer-unique identifiers;
- separate descriptive attributes;
- restrict auto-acceptance;
- add negative fixtures;
- stop silent name merges.

### Milestone 2 — canonical actors

- source actors;
- opaque actors;
- evidenced assignments;
- challenging evidence;
- accepted projection;
- withdrawal and split tests.

### Milestone 3 — truthful queries and semantics

- identity-aware queries;
- FTS repair;
- source coverage and truncation;
- typed metrics;
- possible lifetime overlap;
- Work/artifact/contribution semantics;
- temporal precision.

### Milestone 4 — evidence and release contracts

- exact evidence receipts;
- versioned Book export;
- checked-in payload packager;
- immutable manifests and checksums;
- Great Library Work and Release registration.

### Milestone 5 — high-information pilots

- event source;
- authority crosswalk;
- modern scholarly/technical source;
- statement extraction for one question;
- topic mapping pilot.

### Milestone 6 — public interface

Only after the truth contract stabilizes:

- read API;
- agent tool;
- graph viewer;
- research dossier surface;
- change and contradiction views.

---

## 14. Program success criteria

The first program is successful when:

1. a clean checkout builds and tests a bounded graph;
2. common names, employers, cities, or websites cannot trigger automatic identity acceptance;
3. source actors and canonical actors are distinct;
4. accepted assignments change queries and remain reversible;
5. queries expose source coverage, identity status, evidence, total counts, and truncation;
6. metrics have type, unit, source, date, and method;
7. Work, version, artifact, locator, and contribution semantics are explicit;
8. one Book export can be consumed without opening a graph DB for writes;
9. all released artifacts have immutable IDs and checksums;
10. one event pilot creates measured cross-domain value without false social inference;
11. one statement pilot produces reviewed source-span-grounded positions;
12. the Great Library cites exact releases without becoming the data warehouse.

### Non-goals for the first program

- ten million new actors;
- a universal importance score;
- automatic belief profiles;
- inferred friendship or influence networks;
- a polished viewer over unstable data;
- whole-corpus claim extraction;
- de-anonymization of public pseudonyms.

---

## 15. Falsifiers

The program’s leading architecture should be revisited if:

1. source actor and canonical actor separation adds substantial cost but does not reduce measured false merges or correction cost;
2. a simpler direct-merge policy achieves equal or better benchmarked safety and reversibility;
3. Work/version/artifact distinctions do not improve any tested query;
4. evidence receipts cannot remain dereferenceable under practical rights and privacy constraints;
5. immutable release requirements make the data unusably stale without producing meaningful verification value;
6. event-rich sources fail to create useful modern overlap;
7. question-driven extraction misses decisive evidence more often than a feasible alternative;
8. authoring and maintenance overhead exceeds the repeated identity, attribution, and research errors prevented.

---

## 16. Evidence gaps

- no full-scale labelled identity benchmark exists;
- no current graph release was independently re-counted in this audit;
- current remote release asset checksums and replacement history were not established;
- no complete checked-in Book payload packaging pipeline was found;
- full-corpus parser error rates are unknown;
- source-overlap economics have not been measured across candidate families;
- no standing agent currently operates the question → evidence → answer update loop;
- statement extraction has not been evaluated against adversarial context cases;
- no public viewer has been tested against ambiguity and contradiction semantics;
- Great Library Work/Release registration for these data products requires a separate validated integration pass.

---

## 17. Watch triggers

Reopen or revise this program when:

1. the first identity benchmark reports method-specific error rates;
2. a clean V2 successor graph release is published;
3. a source-domain export replaces direct Book-to-graph writes;
4. the first immutable payload manifest and range-validation report lands;
5. an event pilot materially changes cross-domain resolution yield;
6. a question-driven statement pilot survives independent review;
7. a query cannot express ambiguity, coverage, or contradiction under the proposed contract;
8. a privacy or rights incident reveals an insufficient boundary;
9. measured maintenance overhead exceeds prevented error and research value;
10. a standing agent proposes a change and independent review confirms or rejects it.

---

## 18. Source map

### People Graph

- `https://github.com/sisodias/siso-people-graph/commit/de048bb3b34bf931b56fd741cb46c1334acdfb98`
- `README.md`
- `schema/people_schema_v2.sql`
- `loaders/ask.py`
- `loaders/build_people_graph_books.py`
- `loaders/build_people_graph_v2.py`
- `loaders/load_owners_into_people_graph.py`
- `loaders/load_owner_topics.py`
- `loaders/enrich_owners.py`
- `loaders/match_identities.py`

### Book Library

- `https://github.com/sisodias/siso-book-library/commit/c2f12b1476a2889d125e409e1652c0eb99c75f56`
- `https://github.com/sisodias/siso-book-library/commit/3a5d1875b395342730205100e99443308d3263e3`
- `https://github.com/sisodias/siso-book-library/commit/be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b`
- `README.md`
- `scripts/build_books_module.py`
- `scripts/build_people_graph.py`
- `scripts/load_into_people_graph.py`
- `scripts/build_locator.py`
- `scripts/probe_text_layer.py`
- `index/tier_queries.sql`

### Great Library

- `docs/registry-model.md`
- `docs/question-driven-research.html`
- `docs/research-question-model.html`
- `registry/source-inventories/gutenberg-corpus-2026-08-03.json`
- `registry/works/frontier-question-gq-009.json`
- `schemas/release.schema.json`
- `https://github.com/sisodias/great-library-of-siso/commit/12f4cc249b2b5dc268d05d1698fe9c5e3079327d`

The repository-specific audit packages contain the machine-readable evidence ledgers and executable reproductions.

---

## 19. Publication boundary and status

This document is an authored research proposal. It intentionally does not:

- create a new registry type;
- claim that the architecture is accepted;
- claim that implementation fixes are merged;
- claim that dataset releases are immutable or verified today;
- hand-edit generated site pages;
- select a new release in a Snapshot;
- convert inferred findings into accepted public truth.

A future Great Library integration agent should create the required Event reservation, independently addressable Work and Release records, ADR, and Snapshot only after source branches, validation, and exact release evidence exist.

---

## 20. Final answer

The People Graph project should be judged by whether it can move from a consequential question to a checkable answer while preserving:

- source identity;
- actor uncertainty;
- role and artifact semantics;
- time;
- rights;
- contradiction;
- correction;
- release lineage.

The 100× opportunity is real, but it comes from trust density rather than row density.
