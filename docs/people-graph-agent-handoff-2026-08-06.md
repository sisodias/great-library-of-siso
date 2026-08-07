# People Graph first-principles program — cross-repository handoff

**Published:** 2026-08-06  
**Status:** three pushed branches and three open draft PRs  
**Purpose:** give a cold agent exact entry points, ownership boundaries, validation receipts, known limitations, and the next safe execution order

---

## 1. Published branches and PRs

### SISO People Graph

```text
repository: sisodias/siso-people-graph
branch:     agent/first-principles-audit-2026-08-06
base:       main @ de048bb3b34bf931b56fd741cb46c1334acdfb98
PR:         https://github.com/sisodias/siso-people-graph/pull/7
head at PR creation: 5943f40ac99cd6e9a6e164e4b9f19f22550984c6
```

Artifacts:

- `AUDIT.md`
- `docs/first-principles/README.md`
- `docs/first-principles/evidence-ledger.json`
- `docs/first-principles/agent-program.md`
- `tools/verify_audit_findings.py`

Scope at PR creation:

```text
5 commits
5 added files
2,938 additions
0 deletions
no production schema, loader, query, or release-asset changes
```

### SISO Book Library

```text
repository: sisodias/siso-book-library
branch:     agent/first-principles-audit-2026-08-06
base:       main @ be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b
PR:         https://github.com/sisodias/siso-book-library/pull/3
head at PR creation: 6cafc7e9484a10788d0f48dd1771eac92ea8555e
```

Artifacts:

- `AUDIT.md`
- `docs/first-principles-audit-2026-08-06.md`
- `docs/release-contract-v2.md`
- `tools/verify_audit_findings.py`

Scope at PR creation:

```text
4 commits
4 added files
1,533 additions
0 deletions
no parser, schema, payload, locator binary, or release-asset changes
```

### Great Library of SISO

```text
repository: sisodias/great-library-of-siso
branch:     agent/first-principles-people-graph-program-2026-08-06
base:       main @ 12f4cc249b2b5dc268d05d1698fe9c5e3079327d
PR:         https://github.com/sisodias/great-library-of-siso/pull/3
```

Artifacts:

- `PEOPLE-GRAPH-PROGRAM.md`
- `docs/people-graph-first-principles-program.md`
- `docs/people-graph-reasoning-ledger-2026-08-06.md`
- `docs/people-graph-agent-handoff-2026-08-06.md`

The Great Library branch contains authored research only. It does not modify registry records, generated `site/`, Releases, Snapshots, Events, or ADRs.

---

## 2. What has been preserved

The Git history now contains:

- the full first-principles derivation;
- all source paths and pinned commits used;
- current observations separated from inference and proposal;
- high-confidence implementation findings;
- bounded SQLite reproductions;
- machine-readable evidence and unknowns;
- rejected alternatives;
- proposed canonical actor and source export models;
- query, evidence, temporal, Work/artifact, and release contracts;
- twelve coordinated implementation/research agent prompts;
- acceptance gates, kill gates, dependency order, and merge order;
- Great Library publication boundaries;
- explicit validation limitations.

The reasoning artifacts are designed so a later agent can challenge and reverse a decision. They do not require accepting chat narration as evidence.

---

## 3. Validation completed

### Repository state

The three branches were compared with their `main` bases before PR creation. Each was strictly ahead and not behind at that moment.

### People Graph bounded reproduction

A synthetic SQLite FTS5 fixture confirmed:

```text
current expression:
WHERE people.person_search MATCH ?

result:
no such column: people.person_search
```

The corrected unqualified FTS table expression returned the expected fixture row.

The identity pair-growth calculation was independently checked:

```text
100 shared values → 100 × 99 / 2 → 4,950 candidate pairs
```

The source inspection verifier records the exact current matcher, build, query, topic, score, and lifetime-overlap markers.

### Book Library bounded reproduction

The current extraction SQL was run against a synthetic fixture.

A source item with:

```text
LoCC=QA
section=Q
bookcase=QA
```

was omitted from the core view that describes Science as included, because the query checks one-letter values against `bookcase`.

A second source item qualifying as both core and biography produced two extraction-queue rows with different reasons, confirming that complete-row `UNION` does not deduplicate by GID.

The source verifier also records the direct graph write, wall-clock content, locator digest contract, source actor key, packaging visibility, and test/CI checks.

---

## 4. Validation not completed

The following remain explicit unknowns:

- full SQL execution against the published 688 MB People Graph release asset;
- independent row recounts of current release databases;
- current SHA-256 digests of every remote release asset;
- whether any release asset has been replaced beneath an existing tag;
- the exact schema of the currently published locator binary;
- a complete clean payload rebuild from pinned public source;
- full-corpus parser error rates;
- identity method false-positive and false-negative rates;
- source-overlap economics;
- performance of the proposed canonical actor model at full scale;
- rights status of every individual translation, edition, scan, or OCR artifact.

No PR claims these unknowns are resolved.

---

## 5. Immediate next action

Do not begin with bulk source ingestion.

Start with People Graph Lane 00 from:

```text
docs/first-principles/agent-program.md
```

Lane 00 establishes:

- clean-checkout fixtures;
- CI;
- build smoke tests;
- FTS execution tests;
- identity positive and negative fixture scaffolding;
- idempotence checks;
- query golden files.

Then run Lane 01 to close the unsafe identity-matching path before any automated matching or new source population is trusted.

The safe initial order is:

```text
Lane 00 baseline/CI
→ Lane 01 identity safety
→ Lane 02 canonical actors
→ Lane 03 truthful queries
→ time and typed metrics
→ Work/artifact and Book export contracts
→ evidence receipts and immutable releases
→ source economics
→ event and statement pilots
→ Great Library registration and selected releases
```

---

## 6. Rules for updating the audit

When a finding is repaired:

1. keep the original finding ID;
2. change status from current/confirmed to resolved or superseded;
3. attach the exact fixing commit;
4. attach the test or validation receipt;
5. state whether the original reproduction now fails as expected;
6. preserve any remaining migration or release risk;
7. do not delete the historical reasoning.

When a finding is disproved:

1. mark it rejected;
2. attach the counter-evidence;
3. explain which premise failed;
4. update dependent proposals;
5. retain the rejected record so future agents do not repeat the same path.

When adding a source:

1. pin the source snapshot;
2. state rights and privacy boundaries;
3. preserve source actors and source-local IDs;
4. measure answer and identity value, not only rows;
5. publish negative and null results;
6. avoid canonical merges until the resolution policy and benchmark support them.

---

## 7. Great Library integration boundary

This authored branch must not be merged and then treated as if it already created accepted architecture or release lineage.

A future integration pass must:

1. read `AGENTS.md`, `CURRENT_STATE.md`, the latest Snapshot, and `site/intelligence.json`;
2. create an Event reservation before parallel work;
3. verify whether People Graph and Book Library Work records already exist;
4. create or update only source-of-truth registry records;
5. add immutable Releases pinned to exact source and dataset artifacts;
6. record an ADR for the organ boundaries after independent review;
7. generate, never hand-edit, public surfaces;
8. run the full `npm run verify` contract;
9. select releases only through a new immutable Snapshot;
10. close the Event with exact receipts.

Graph actors remain in the graph data plane. They do not become hundreds of thousands of Great Library Works.

---

## 8. Final handoff statement

The reasoning, workings, sources, limitations, alternatives, agent prompts, and cross-repository contracts are now pushed to GitHub in reviewable branches.

The branches intentionally preserve evidence before changing production behavior. That makes the next implementation work safer: agents can inspect why a guardrail exists, reproduce the failure it addresses, and reject or revise the proposal with source-grounded counter-evidence.
