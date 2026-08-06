# People Graph reasoning ledger

**Date:** 2026-08-06  
**Status:** reproducible research ledger; safe to cite as the derivation behind the authored program, but not an accepted architectural decision  
**Companion program:** [`people-graph-first-principles-program.md`](people-graph-first-principles-program.md)

---

## 1. Why this ledger exists

The goal is to let a cold agent reconstruct how the People Graph conclusions were reached without trusting a summary or inheriting unexplained doctrine.

This ledger records:

- the question being answered;
- the repositories and revisions inspected;
- the order of investigation;
- observations separated from inference;
- bounded executable reproductions;
- alternatives considered;
- confidence and uncertainty;
- changes from the earlier growth-oriented recommendation;
- the decision sequence that produced the final program.

A private token-by-token scratchpad is not used as an authority. The durable chain of reasoning is expressed as premises, evidence, tests, counterarguments, decisions, and falsifiers.

---

## 2. Original question reconstructed

The practical user intent was:

1. understand the Great Library, People Graph, and Book Library as one project;
2. ignore Oracle as unrelated;
3. determine what the People Graph is trying to become;
4. find what was forgotten or missed;
5. identify deep research programs that can create enormous value;
6. prepare coordinated agents that can push safe work back to GitHub;
7. preserve enough context that later agents can continue without repeating the investigation.

The first answer emphasized source expansion, identity resolution, relationships, beliefs, events, institutions, and a viewer.

The re-derivation asked a stricter question:

> Before expanding, do the current source, identity, query, evidence, and release contracts support the truth claims the system wants to make?

That changed the priority order.

---

## 3. Research method

### 3.1 Evidence classes

Every material statement was assigned one of these types:

- **Observation:** directly visible in pinned repository source or history.
- **Reproduction:** behavior executed with a bounded synthetic fixture.
- **Inference:** conclusion derived from named observations.
- **Proposal:** future architecture or action, not current truth.
- **Unknown:** evidence unavailable or not yet measured.

### 3.2 Research rule

The work followed this sequence:

```text
read stated purpose
  → inspect schema
  → trace write paths
  → trace read paths
  → compare stated guarantees with implementation
  → reproduce bounded behaviors
  → identify category collapses
  → derive minimum correct model
  → test alternatives
  → prioritize by corruption and decision risk
```

### 3.3 What was not assumed

The audit did not assume:

- README claims and checked-in implementation always match;
- a field named `confidence` is calibrated;
- a table named `person` contains only humans;
- a graph edge represents an evidenced relationship;
- a release asset is immutable because a Git tag is immutable;
- an indexed source universe represents complete output;
- a model-generated summary is evidence;
- more cross-domain matches are necessarily better.

---

## 4. Investigation timeline

### Step 1 — Resolve the actual system boundary

**Action:** locate and inspect the three repositories named by the user:

- `sisodias/great-library-of-siso`
- `sisodias/siso-people-graph`
- `sisodias/siso-book-library`

**Observation:** the Great Library is a registry and learning surface, the Book Library is a source-domain index and payload system, and the People Graph is a cross-domain actor/content index.

**Inference:** the systems should not be collapsed into one repository or schema. Their value depends on clear interfaces.

**Sources:** Great Library `README.md`, `docs/registry-model.md`, `docs/question-driven-research.html`; People Graph `README.md`; Book Library `README.md`.

### Step 2 — Start from the Great Library’s question-driven architecture

**Action:** inspect the Work/Release/Snapshot model and Frontier Question research loop.

**Observation:** the Great Library explicitly separates identity, source discovery, corpus custody, evidence transformation, and execution. It treats questions as durable and answers as changing immutable Releases.

**Observation:** GQ-009 measured that whole-corpus claim extraction exceeds its stated token budget by orders of magnitude.

**Inference:** the People Graph should be optimized as a question-driven research substrate, not as a warehouse whose success is total rows or total extracted claims.

**Decision:** use consequential question value, evidence addressability, identity precision, and correction cost as primary design criteria.

### Step 3 — Inspect the People Graph’s stated ontology

**Action:** read the README and `schema/people_schema_v2.sql`.

**Positive findings:**

- roles are placed on contribution edges;
- source provenance and observation time were added to content edges;
- identity claims are explicit rather than intended as silent merges;
- merges are intended to be reversible;
- BCE years are supported;
- source topic vocabularies are kept distinct;
- tracked-but-unlinked state is expressible;
- FTS and cross-domain views exist.

**Question raised:** do the loaders and query surface actually enforce those guarantees?

### Step 4 — Trace the complete write path

**Action:** inspect:

- `build_people_graph_books.py`
- `build_people_graph_v2.py`
- `load_owners_into_people_graph.py`
- `load_owner_topics.py`
- `enrich_owners.py`
- `match_identities.py`

**Observation:** the V2 schema path is constructed as `loaders/people_schema_v2.sql`, while the file is in `schema/`.

**Finding:** documented clean rebuild is broken in a clean checkout.

**Observation:** V2 book ingestion silently reuses an existing person ID on normalized-name equality.

**Finding:** the build bypasses the explicit identity-claim design.

**Observation:** GitHub enrichment writes real name, website, company, and location into the same `external_ids` table as issuer identifiers.

**Observation:** the matcher loops over every repeated `(platform, value)` and calls it `shared_external_id` at `0.98`.

**Finding:** descriptive attributes can become near-certain identity evidence.

**Observation:** `rank_score` receives work count, inherited rank, summed stars, model-rated value, and followers across different loaders.

**Finding:** the field has no stable unit, source, or interpretation. One loader adds to it on every run.

### Step 5 — Quantify the shared-attribute risk

The matcher creates every pair within a repeated external-id group.

For `n` records:

```text
pairs = n × (n - 1) / 2
```

For 100 people at the same company or in the same city:

```text
100 × 99 / 2 = 4,950 pairs
```

Because the current method assigns confidence `0.98`, the risk is not merely a weak candidate queue. It can flood the highest-trust path with false pairs.

**Decision:** issuer semantics must be explicit. Stable issuer IDs, mutable handles, and descriptive attributes are different evidence classes.

### Step 6 — Trace the query path

**Action:** inspect `loaders/ask.py`.

**Observation:** `who()` attempts FTS, catches any SQLite error, and falls back to `LIKE`.

**Observation:** `works()` chooses the raw matching row with the greatest content count.

**Observation:** `identity_claim` is never queried.

**Observation:** `works()` limits to 200 rows and reports `count = len(rows)` without total count or truncation.

**Finding:** accepted identity decisions are dormant and partial source coverage can be narrated as complete output.

### Step 7 — Reproduce the FTS behavior

A minimal SQLite database was created with:

```sql
CREATE TABLE person(person_id TEXT PRIMARY KEY, name TEXT);
CREATE VIRTUAL TABLE person_search
USING fts5(person_id UNINDEXED, name, aliases);
```

The current query form:

```sql
WHERE people.person_search MATCH ?
```

returned:

```text
no such column: people.person_search
```

The corrected form:

```sql
WHERE person_search MATCH ?
```

returned the expected fixture row.

Because the application catches the exception, the bug is silent and appears as a working query that actually uses the fallback scan.

**Decision:** query tests must prove which execution path ran, not merely that a result was eventually returned.

### Step 8 — Inspect Book Library source semantics

**Action:** inspect the catalog builder, source actor parser, graph integration, locator, text probe, and tier SQL.

**Positive findings:**

- every upstream catalog field is preserved;
- source membership is relational;
- roles are distinct;
- BCE dates are parsed;
- artifacts have direct and range retrieval concepts;
- rights are limited to `public_domain_us` rather than overstated globally;
- body sampling catches image-only or partial PDFs.

**Observation:** the Book Library directly writes to a People Graph database and normalized-name matches canonical people.

**Finding:** source-domain code owns a cross-domain identity decision and duplicates integration logic.

**Observation:** the README says the locator stores per-book SHA-256, but the checked-in locator schema has no digest column.

**Finding:** the checked-in build path cannot reproduce the documented locator contract as written.

**Observation:** the catalog builder writes the current clock into every row.

**Finding:** byte-for-byte rebuild claims require qualification or a pinned clock and environment.

### Step 9 — Reproduce extraction profile SQL semantics

A synthetic source item was classified as:

```text
LoCC = QA
section = Q
bookcase = QA
```

The core policy says Science is included but filters `bookcase IN (..., 'Q', ...)`.

**Result:** the `QA` fixture is omitted.

A second fixture qualified as both core and biography.

The extraction queue uses `UNION` on rows containing different `reason` values.

**Result:** the same GID appears in more than one queue row.

**Decision:** section policy must filter `section`, and reasons must be preserved separately from the one-row-per-item queue projection.

### Step 10 — Compare release claims with Great Library release semantics

**Action:** inspect the Great Library release schema.

**Observation:** the Great Library expects immutable releases, exact artifact revisions, integrity state, and evidence-backed distribution claims.

**Observation:** data repository comments emphasize that release assets can be replaced.

**Inference:** operational replaceability conflicts with evidentiary immutability unless replacement creates a successor release and new digest.

**Decision:** every graph and book data release needs a manifest binding source snapshots, source and builder commits, policy versions, row counts, rights, validation, and checksums.

### Step 11 — Inspect the evidence transformation gap

**Action:** inspect GQ-009’s latest watch-trigger evaluation.

**Observation:** question-addressable exports existed, but their evidence records were model summaries with no URL, quote, or citation.

**Finding:** addressability by question is insufficient when the evidence cannot dereference to an exact artifact and relevant span.

**Decision:** all accepted identity, attribution, relationship, and statement claims require evidence receipts.

### Step 12 — Identify category collapses

The audit found these recurring collapses:

```text
source actor → canonical person
account → actor
owner → creator
work subject → person topic → possible belief
lifespan overlap → contemporaneity → actual conversation
shared attribute → shared identity
heuristic score → probability
popularity metric → universal value
source item → abstract Work
reference → evidence
indexed result → complete output
```

**Inference:** the architecture needed a source/decision/projection separation rather than isolated bug fixes.

### Step 13 — Derive the minimum model

The model was rebuilt from irreducible requirements:

1. preserve source assertions;
2. attach exact evidence;
3. create source-independent canonical actor identity;
4. make resolution an assignment decision;
5. distinguish Work, version, artifact, locator, and contribution;
6. model events and participation;
7. model dated public statements, not inner belief;
8. store typed observations;
9. derive projections with version and assumptions;
10. publish immutable releases.

### Step 14 — Test alternatives

Alternatives considered and rejected:

- **better name normalization plus direct merge:** improves candidates but cannot make names unique;
- **keep account IDs as canonical actor IDs:** breaks on handle changes, many accounts, and shared accounts;
- **put all actors in the Great Library:** turns the registry into an operational warehouse;
- **replace SQLite immediately:** engine choice does not repair semantic corruption;
- **extract claims from everything:** fails measured token economics and relevance;
- **build the viewer first:** risks making uncertain data look authoritative;
- **one global importance score:** collapses incompatible dimensions and biases.

### Step 15 — Reorder the program

Earlier growth priorities were retained but moved behind the truth kernel.

New order:

```text
build and test
→ identity safety
→ canonical assignments
→ truthful queries
→ time and metrics
→ Work/artifact semantics
→ evidence receipts
→ immutable releases
→ source economics
→ event and statement pilots
→ API and viewer
```

---

## 5. What changed from the earlier answer

### Earlier emphasis

- more source families;
- complete public-output graph;
- person relationships;
- beliefs and predictions;
- communities and institutions;
- under-recognized actors;
- topic ontology;
- viewer and API.

### Re-derived correction

Those remain valuable, but only after foundational contracts prevent false identity, false attribution, unsupported belief inference, hidden truncation, and unreproducible releases.

Specific changes:

1. **Identity safety moved from one research track to the first engineering priority.**
2. **Evidence quality moved from a late concern to a system-wide prerequisite.**
3. **The “belief graph” became a source-grounded public statement model.**
4. **The “person graph” became an internal actor graph with accounts modeled separately.**
5. **Person-to-person relations became derived from contributions and events unless explicitly evidenced.**
6. **Events moved earlier because they are high-signal modern overlap sources.**
7. **The viewer moved later because presentation can amplify false certainty.**
8. **Row-count goals were replaced by question and trust metrics.**
9. **The Book Library became an export-producing source owner rather than a direct graph writer.**
10. **Great Library integration became exact Work/Release/Decision lineage rather than mass actor registration.**

---

## 6. Decision ledger

### D1 — Optimize trust density over row density

**Premises:** false merges and unsupported inference increase correction cost and reduce answer credibility.  
**Decision:** success is defined by consequential, evidenced queries rather than graph size.  
**Status:** proposed program principle.

### D2 — Separate source actors and canonical actors

**Premises:** sources observe accounts and strings; canonical identity is a cross-source decision.  
**Decision:** preserve source actors and assign them to opaque canonical actors.  
**Status:** proposed architecture.

### D3 — Restrict automatic identity to documented issuer semantics

**Premises:** current shared attribute path includes names, companies, locations, and websites.  
**Decision:** only explicitly allowlisted issuer-unique identifiers can enter deterministic acceptance.  
**Status:** urgent proposed safety fix.

### D4 — Make accepted resolution operational

**Premises:** current accepted claims do not affect queries.  
**Decision:** queries must consume a canonical projection built from accepted assignments.  
**Status:** proposed architecture.

### D5 — Replace universal score with typed observations

**Premises:** `rank_score` mixes incompatible values and rerun behavior.  
**Decision:** observations carry metric type, unit, source, time, and method; rankings are named projections.  
**Status:** proposed architecture.

### D6 — Separate Work, expression/version, artifact, and locator

**Premises:** source IDs represent editions or artifacts as well as Works.  
**Decision:** add only the minimum distinctions supported by tested queries and source evidence.  
**Status:** proposed contract.

### D7 — Model public statements rather than beliefs

**Premises:** topics and extracted text do not provide direct access to inner belief.  
**Decision:** store dated stances toward propositions with exact source spans and interpretation status.  
**Status:** proposed evidence model.

### D8 — Make releases immutable and verifiable

**Premises:** evidence depends on exact bytes and builder/source identity.  
**Decision:** corrections create successor releases; manifests and digests bind every artifact.  
**Status:** proposed release protocol.

### D9 — Preserve Great Library boundaries

**Premises:** the Great Library is registry and answer lineage, not the data plane.  
**Decision:** register the data products and Releases, not every graph row.  
**Status:** consistent with current Great Library model; exact records not yet created.

### D10 — Use question-driven acquisition and extraction

**Premises:** whole-corpus extraction is arithmetically uneconomic and often low information.  
**Decision:** choose sources and passages by expected decision information gain.  
**Status:** consistent with current Great Library research architecture.

---

## 7. Bounded reproduction details

### 7.1 People Graph verifier

Branch artifact:

```text
sisodias/siso-people-graph
agent/first-principles-audit-2026-08-06
tools/verify_audit_findings.py
```

Checks:

- V2 schema path;
- absence of an issuer-unique matcher allowlist;
- combinatorial pair count;
- accepted claim consumption;
- silent name merge;
- incompatible rank semantics;
- FTS failure and corrected query;
- hidden works truncation;
- direct person-topic derivation;
- lifetime overlap assumption;
- claim-pair uniqueness comment versus constraint.

### 7.2 Book Library verifier

Branch artifact:

```text
sisodias/siso-book-library
agent/first-principles-audit-2026-08-06
tools/verify_audit_findings.py
```

Checks:

- direct canonical graph write;
- locator digest documentation mismatch;
- wall-clock content;
- section/bookcase profile behavior;
- queue duplication;
- lossy source actor key;
- visible payload packaging path;
- checked-in tests and workflows.

---

## 8. Confidence ledger

### High confidence

Direct source or executable reproduction supports:

- schema path mismatch;
- unsafe shared-attribute identity path;
- accepted claims unused by query;
- silent exact-name merge;
- mixed and non-idempotent rank field;
- invalid FTS MATCH qualification;
- hidden works truncation;
- direct work-topic rollup;
- estimated lifetime overlap semantics;
- direct Book-to-graph canonical write;
- locator digest claim mismatch;
- unpinned wall-clock content;
- extraction profile field mismatch;
- queue duplication by reason;
- missing test/CI contract in inspected initial source;
- GQ-009 evidence dereferenceability gap.

### Medium confidence

Strongly reasoned but requires pilots:

- actor assignments are the best long-term canonical model;
- event-rich sources produce the best modern overlap return;
- Work/version/artifact distinctions justify their cost;
- typed observations materially improve ranking research;
- Parquet/NDJSON plus SQLite is the right scale path;
- statement extraction can be reliable enough under a bounded question.

### Unknown

- current remote asset bytes and replacement history;
- full release database contents and row counts;
- identity method error rates;
- full parser error rates;
- measured source-overlap economics;
- actual maintenance cost of the proposed model;
- performance under full-scale canonical assignment queries;
- whether an unpublished payload packager exists elsewhere;
- exact rights of every artifact and translation.

---

## 9. How a future agent should reverse-engineer this work

1. Read the authored program.
2. Read this ledger.
3. Open the repository-specific audit branches.
4. Run both verifier scripts.
5. Inspect each pinned source file and commit.
6. Reproduce the FTS and extraction SQL fixtures independently.
7. Challenge the value function and boundary assumptions.
8. Build negative identity cases before proposing thresholds.
9. Record any finding that no longer reproduces as resolved with exact fixing commit and test receipt.
10. Preserve rejected alternatives and failed experiments.
11. Do not convert this proposal into an accepted Great Library decision without repository validation, Event lineage, and independent review.

---

## 10. Final reasoning summary

The decisive shift was recognizing that the People Graph’s scarce resource is not data. Public data is abundant.

The scarce resources are:

- trustworthy canonical identity;
- source-grounded attribution;
- exact evidence addressability;
- temporal and rights context;
- reversible correction;
- release reproducibility;
- disciplined question demand.

That is why the first 100× improvement is a trust improvement before it is a scale improvement.
