> **Historical record:** This dependency-ordered pack was superseded for ChatGPT/Codex web execution. See `../prompt-evolution.md`.

# SISO People Graph Expansion Program — GPT-5.6 Agent Prompts

Date: 2026-08-06

Repositories in scope:

- `sisodias/siso-people-graph`
- `sisodias/siso-book-library`
- `sisodias/great-library-of-siso`

`oracle` is explicitly out of scope.

## Launch order

1. Run Prompt 0 first. Merge its small coordination/reservation PR before parallel implementation begins.
2. Run Prompts 1, 6, and 7 in parallel.
3. Run Prompt 2 after Prompt 1's findings are available.
4. Run Prompts 3 and 4 after the v3 schema contract from Prompt 2 is merged.
5. Run Prompts 5, 8, 9, 10, and 11 after the relevant v3 identity/build interfaces are merged.
6. Run Prompt 12 last, after the preceding implementation PRs selected for the release have merged.

Every agent must create a dedicated branch, make intentional commits, push the branch, and open a draft PR. No agent may force-push, delete branches/releases, commit directly to `main`, commit database or corpus payloads, expose credentials, or merge its own PR.

---

## Prompt 0 — Program coordinator, ownership ADR, and reservations

```text
You are the coordinating GPT-5.6 Pro agent for the SISO People Graph expansion program.

REPOSITORIES
- Read/write: sisodias/great-library-of-siso
- Read-only for this lane: sisodias/siso-people-graph, sisodias/siso-book-library
- Oracle is unrelated and must not be inspected or mentioned.

AUTHORITY AND SAFETY
You may create a branch, commit, push, and open a draft PR. Do not commit to main, merge the PR, force-push, delete anything, publish large release assets, or touch secrets/private data. Prefer the connected GitHub app; use local git/gh only for connector gaps.

BRANCH
`gls/people-graph-program-20260806`

READ BEFORE WRITING
In great-library-of-siso, read README.md, AGENTS.md, CURRENT_STATE.md, the latest whole-Library Snapshot, site/intelligence.json, docs/onboarding.html, docs/registry-model.md, docs/siso-knowledge-model.html, docs/question-driven-research.html, docs/research-question-model.html, CONTRIBUTING.md, SECURITY.md, and the full GQ-009 Work record. In the People Graph and Book Library, read every tracked source file; both are small enough that partial onboarding is not acceptable.

MISSION
Create the canonical coordination spine for a multi-agent program to turn the People Graph into a provenance-first creator-intelligence graph without turning the Great Library into a database warehouse.

WORK
1. Publish an append-only `initiative_started` Event that defines every lane in this prompt pack, its branch, exact reserved paths, dependencies, non-goals, and expected handoff. The Event must make conflicts visible on canonical main before parallel work begins.
2. Draft an ADR resolving the ownership boundary that is currently ambiguous: the People Graph README places the graph in Foundry, while the Great Library's Knowledge model assigns durable indexes and graphs to SISO Knowledge. Decide whether People Graph is an independent Research Work, a Knowledge-owned Work/component, or another explicit arrangement. Preserve these invariants:
   - Great Library owns stable Work/Release/Snapshot identity and public-safe lineage.
   - large databases, source snapshots, and live state stay in a governed data plane.
   - Foundry discovers and evaluates sources rather than silently becoming canonical truth.
   - evidence transformation and accepted conclusions retain separate ownership.
3. Create or update a Frontier Question Work for “How do we 100× the value of the People Graph?” with a decision target, measurable success criteria, falsifiers, evidence gaps, watch triggers, privacy/rights boundary, and phased next work. Do not invent a question number if the registry has a numbering rule; derive it from current state.
4. Record the current repository-owner/locator discrepancy (`sisodias` versus older `Lordsisodia` references) as a verification task, not an assumed correction.
5. Generate site projections only through the repository generator. Never hand-edit generated item pages.

ACCEPTANCE
- The coordination Event is schema-valid and explicitly reserves non-overlapping paths in all three repositories.
- The ADR is evidence-led and resolves the Foundry/Knowledge/independent-Work question.
- The research contract can guide later source selection and kill low-value ingestion.
- `npm ci` and `npm run verify` pass.
- Commit and push the branch, then open a draft PR titled `Program: coordinate People Graph v3 expansion`.
- Final response must include branch, commits, draft PR, verification output, reservations, dependencies, and exactly what later agents may start after this PR is merged.
```

---

## Prompt 1 — Forensic red-team and executable failure fixtures

```text
You are the red-team GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/great-library-of-siso and sisodias/siso-book-library
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a dedicated branch, intentional commits, push, and a draft PR. Do not merge, force-push, change main, publish data assets, or modify production behavior in this lane. Prefer the GitHub app; use git/gh only for gaps.

BRANCH
`pg/red-team-tests-20260806`

RESERVED PATHS
Only `tests/**`, `docs/audits/**`, and minimal test-runner configuration. Do not edit schema or loaders except when a tiny import seam is strictly necessary for tests; document any such exception.

READ FIRST
Read all tracked files in the People Graph. Also read the Great Library coordination Event and ownership ADR created by Prompt 0. Inspect the Book Library's builders and export contract for cross-repo assumptions.

MISSION
Turn the most dangerous current assumptions into reproducible failing tests and a file:line audit. This lane diagnoses; it does not fix.

REQUIRED FIXTURES
Build tiny synthetic SQLite fixtures that demonstrate or falsify each of the following:
1. `build_people_graph_v2.py` can locate its schema file from a clean checkout.
2. v2 does not silently merge unrelated people on normalized names.
3. `shared_external_id` cannot treat non-unique attributes such as company, location, or real name as identity keys.
4. accepted identity claims actually affect canonical query results, or the test proves they are currently inert.
5. rerunning every loader is idempotent: no duplicate claims, no repeated rank additions, no stale edges, and no mutation of unrelated fields.
6. topics and enrichment work for canonical people whose ID does not begin with `gh:` and whose origin is not `github`.
7. Unicode and non-Latin names survive normalization without collapsing to empty or colliding keys.
8. aliases/raw variants reach FTS search.
9. GitHub login rename and repository transfer do not split or rewrite identity when stable numeric IDs are available.
10. ambiguous common names, shared employers, and shared locations never auto-merge.

Also audit Book Library integration assumptions that directly affect the graph, but leave Book Library fixes to Prompt 6.

DELIVERABLES
- A test suite that runs entirely on tiny fixtures and no network.
- `docs/audits/people-graph-v2-red-team-2026-08-06.md` with severity, file:line, minimal reproduction, invariant violated, blast radius, and recommended owner lane.
- A machine-readable findings file keyed by stable finding IDs.
- No speculative bug claim without an executable fixture or exact source evidence.

ACCEPTANCE
Run the suite and preserve the expected failures clearly. Commit and push, then open a draft PR titled `Test: codify People Graph v2 failure modes`. Report branch, commits, PR, test command, failing/passing counts, and the P0 findings that must block bulk ingestion.
```

---

## Prompt 2 — People Graph v3 architecture and schema contract

```text
You are the architecture GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only: sisodias/great-library-of-siso, sisodias/siso-book-library
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and open a draft PR. Do not merge or modify main. Do not ingest external datasets or commit SQLite files. Honor the Great Library reservation Event. Prefer the GitHub app, with local git/gh only for gaps.

BRANCH
`pg/v3-schema-20260806`

RESERVED PATHS
`docs/architecture/**`, `schema/v3/**`, `migrations/v2_to_v3/**`, and `tests/schema/**`. Do not edit existing loaders or query code in this lane.

DEPENDENCY
Read Prompt 1's audit and executable fixtures. If its PR is not merged, inspect the branch/PR and design against the confirmed findings without editing its paths.

MISSION
Define a v3 model that can safely grow by 10× in rows and 100× in usefulness. The graph must distinguish raw source observations from canonical entities, identity decisions, evidence-backed assertions, typed temporal relationships, and derived projections.

REQUIRED MODEL
Design and implement a SQLite schema, constraints, compatibility views, and migration/rebuild plan covering at least:
- source and source_snapshot, including terms/rights, revision, digest, acquisition method, observed time, and deletion/tombstone obligations;
- immutable or append-oriented source_record/observation rows retaining source-native IDs and raw evidence pointers;
- canonical entity identity independent of handles or source usernames, with explicit person, organisation, pseudonym, work, venue/event, place, and topic/concept types;
- identifiers with declared uniqueness scope and lifecycle, so globally unique IDs are structurally different from names, companies, locations, and handles;
- first-class Works and contribution edges, including roles, order, time, versions/editions/expressions, venues, citations, dependencies, and source locators;
- identity claims, evidence, decisions, conflicts, canonical clusters/redirects, reversibility, and review lineage;
- generic assertions/claims with subject, predicate, object/value, evidence, confidence, status, valid time, observed time, and deciding authority;
- typed relationships with provenance and temporal validity;
- aliases and Unicode-safe search;
- rights/privacy/publication state at the appropriate object level;
- derived projection metadata without storing one universal rank, tier, expertise, or influence score as canonical truth.

DESIGN PRINCIPLES
- No silent name merge.
- Handles are aliases; stable platform IDs are identifiers.
- Every fact says where it came from and when it was observed.
- A correction must be reversible without deleting source evidence.
- Source vocabularies remain namespaced; crosswalks are explicit mappings, not flattened labels.
- The rebuild path from source is primary; in-place migration is only a controlled compatibility path.

DELIVERABLES
- `docs/architecture/people-graph-v3.md` with invariants, entity/edge diagrams, examples, rejected alternatives, migration strategy, and query examples.
- Versioned v3 SQL schema and constraints.
- Compatibility views for the useful v2 query surface where safe.
- Synthetic migration fixtures and schema tests, including foreign-key checks and uniqueness/conflict tests.
- A clear interface contract for source-adapter agents and query agents.

ACCEPTANCE
All schema tests pass. No production loader is changed. Commit, push, and open a draft PR titled `Architecture: People Graph v3 evidence model`. Report branch, commits, PR, schema test output, compatibility limits, and the exact interfaces that unblock Prompts 3, 4, 8, 9, 10, and 11.
```

---

## Prompt 3 — Identity resolution safety and canonicalization

```text
You are the identity-resolution GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/great-library-of-siso and sisodias/siso-book-library
- Oracle is out of scope.

AUTHORITY AND SAFETY
Work on a branch, commit, push, and open a draft PR. Do not merge, force-push, write main, publish production databases, or auto-accept risky matches. Honor the reservation Event.

BRANCH
`pg/identity-v3-20260806`

RESERVED PATHS
`identity/**`, `loaders/match_identities.py`, `loaders/enrich_owners.py`, identity-specific migrations, and `tests/identity/**`.

DEPENDENCY
Base this work on the merged v3 schema contract from Prompt 2. Read Prompt 1's P0 fixtures. Do not invent a parallel schema.

MISSION
Replace unsafe matching with an evidence-calibrated, reversible identity system that produces canonical queryable clusters without silently fusing people.

REQUIRED CHANGES
1. Separate unique identifiers from non-unique attributes. Only allow explicitly declared, source-scoped identifiers such as GitHub numeric account ID, ORCID, VIAF, ISNI, Wikidata QID, DOI-author linkage, verified domain, or equivalent to participate in high-confidence auto-resolution. Company, location, real name, biography text, and topic overlap must never be treated as globally unique IDs.
2. Make Unicode normalization multilingual and comparison-only; never derive canonical IDs by stripping names to ASCII.
3. Model handles/usernames as time-bounded aliases tied to stable account IDs, including rename history.
4. Generate candidate claims with positive and negative evidence, conflict reasons, method version, calibrated confidence, and review state. Exact names and surname initials may create review candidates only.
5. Implement deterministic cluster/canonical resolution for accepted claims, including transitive closure, conflict detection, canonical redirects, and one-step reversible decisions. Prevent impossible clusters such as conflicting stable platform IDs.
6. Ensure accepted claims affect all read paths through a canonical resolution view or library. Preserve every losing source record and alias.
7. Fix partial enrichment semantics: one existing attribute must not block collection of missing fields; enrichment must not overwrite canonical names, creation/build timestamps, or unrelated scores.
8. Make all operations idempotent and provenance-preserving.

VALIDATION
Use adversarial fixtures: common names, spouses sharing locations, hundreds of employees at one company, organisations with human-looking names, renamed GitHub accounts, non-Latin names, pseudonyms, and one person with several domains. Measure precision separately for auto-accepted and review-only candidates. Default to no automatic merge when evidence is ambiguous.

DELIVERABLES
- Identity library and CLI with dry-run, propose, review, accept/reject, resolve, undo, and audit commands.
- Migration from v2 external IDs/claims into v3 semantics without treating attributes as IDs.
- Tests proving all Prompt 1 identity failures are fixed.
- An identity method card documenting thresholds, known blind spots, and review policy.

ACCEPTANCE
All identity tests pass; no network is required. Commit, push, and open a draft PR titled `Identity: safe canonical resolution for People Graph v3`. Report branch, commits, PR, test output, candidate/auto-accept metrics on fixtures, and any schema issue that must return to Prompt 2 rather than being patched ad hoc.
```

---

## Prompt 4 — Reproducible builds, data contracts, and release engineering

```text
You are the build and release GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only: sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and draft PR. Do not merge, publish the production database, commit SQLite/gzip payloads, or expose machine-specific paths or tokens. Honor the coordination Event.

BRANCH
`pg/reproducible-builds-20260806`

RESERVED PATHS
`build/**`, `manifests/**`, `loaders/build_*`, `loaders/load_*` except identity-owned files, `.github/workflows/**`, and `tests/build/**`.

DEPENDENCY
Build against the merged v3 schema and source-adapter contract from Prompt 2. Preserve Prompt 3's identity ownership.

MISSION
Make a clean checkout able to rebuild, validate, fingerprint, and package the graph from declared source snapshots without hidden local state or non-idempotent mutation.

REQUIRED WORK
- Fix clean-checkout path resolution, including the current schema-location assumption.
- Replace implicit local paths with an explicit config/manifest layer and environment overrides. No public hard-coded vault topology.
- Create a source manifest format recording source ID, exact snapshot/revision, URI class, content digest, rights/terms revision, acquisition time, loader version, schema version, and expected row-level contract.
- Make loaders idempotent and source-replaceable: rerunning a snapshot cannot add rank repeatedly, preserve stale edges, duplicate claims, or overwrite unrelated canonical fields.
- Keep build timestamps and run metadata in build manifests, not inside canonical facts where they destroy reproducibility.
- Compute deterministic logical digests over sorted canonical exports and per-table counts. Measure binary SQLite reproducibility rather than claiming it; use logical equivalence as the required invariant if byte identity is not stable.
- Add staged validation: schema checks, foreign keys, source coverage, orphan edges, duplicate unique identifiers, impossible identity clusters, rights coverage, and query smoke tests.
- Add release tooling that creates compressed DB assets, checksums, a signed/attested manifest where practical, and a small provenance receipt. Do not actually upload a large asset in this PR.
- Add CI using tiny fixtures and a documented local full-build command.
- Remove universal rank mutation from canonical loading. Any ranking belongs to named, versioned projection code with method metadata.

DELIVERABLES
A one-command fixture build, a documented full build, versioned manifests, validation reports, CI, and release-packaging scripts. Include a migration note for existing release assets.

ACCEPTANCE
Run the fixture build twice from clean directories and prove equal logical digests and row counts. All tests and CI configuration validate locally. Commit, push, and open a draft PR titled `Build: reproducible People Graph v3 pipeline`. Report branch, commits, PR, commands, digests, validation counts, and any remaining non-reproducible input.
```

---

## Prompt 5 — Read-only query engine, API/MCP surface, and explorer

```text
You are the query-surface GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library and sisodias/great-library-of-siso
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and open a draft PR. Do not merge, write to production databases, or add an unauthenticated write API. Honor all path reservations.

BRANCH
`pg/query-surface-v3-20260806`

RESERVED PATHS
`query/**`, `api/**`, `mcp/**`, `viewer/**`, `loaders/ask.py`, and `tests/query/**`.

DEPENDENCY
Use the merged v3 canonical resolution and build contracts from Prompts 2–4. Do not reimplement identity logic inside queries.

MISSION
Turn the graph into a reliable read-only research instrument. Every result must expose identity ambiguity, source provenance, time, and routes to underlying evidence.

REQUIRED QUERY CAPABILITIES
- `who`: canonical entity, aliases, identifiers, ambiguity, organisations/pseudonyms, and source coverage;
- `works`: all first-class Works with contribution roles, versions/editions, and fetch routes;
- `relationships`: typed, temporal, evidenced neighbours;
- `path`: explainable graph paths between two entities with edge provenance;
- `timeline`: works, affiliations, appearances, grants, and identity changes by time;
- `topics`: namespaced topics and explicit crosswalks;
- `claims`: positions/assertions with evidence state and time;
- `compare`: two or more people across works, topics, claims, and sources without manufacturing a single score;
- `multi-domain`: overlap and missing-source diagnostics;
- `source` and `inventory`: exact data snapshots, counts, rights, freshness, and build digest.

IMPLEMENTATION RULES
- One query library is the source of truth. CLI, read-only HTTP API, MCP server, and optional lightweight explorer call that library rather than duplicating SQL.
- Configuration replaces machine-specific candidate paths. Missing domains are explicit in metadata, not silently misleading.
- JSON output is versioned and schema-tested; human output is a projection.
- Pagination, query budgets, timeouts, and safe parameter binding are mandatory.
- A result must distinguish observed fact, accepted identity decision, derived relation, and model-generated inference.
- No writes, no arbitrary SQL endpoint, and no full-corpus payload proxy.

DELIVERABLES
A documented CLI, a minimal read-only API or MCP surface, example queries, JSON schemas, and performance tests on generated fixtures. Add a human explorer only after the query library is complete and tested.

ACCEPTANCE
Demonstrate at least one person with multiple source identities, one ambiguous name, one organisation, one historical figure, and one relationship path. All outputs include provenance. Commit, push, and open a draft PR titled `Query: evidence-first People Graph v3 surface`. Report branch, commits, PR, commands, response examples, benchmark results, and unsupported query classes.
```

---

## Prompt 6 — Book Library integrity, reproducibility, and graph export contract

```text
You are the Book Library GPT-5.6 Pro agent for sisodias/siso-book-library.

SCOPE
- Read/write: sisodias/siso-book-library
- Read-only context: sisodias/siso-people-graph and sisodias/great-library-of-siso
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and open a draft PR. Do not merge, commit corpus/database assets, republish 10+ GB payloads, or alter rights claims without evidence. Honor the Great Library coordination Event.

BRANCH
`books/integrity-v2-20260806`

RESERVED PATHS
Book Library only: `scripts/**`, `index/**`, `docs/**`, tests, manifests, and CI.

READ FIRST
Read every tracked file and the Gutenberg Source Inventory in the Great Library. Read the People Graph v3 adapter contract when available, but keep this lane independently useful.

MISSION
Make the Book Library's metadata index, payload locator, extraction queue, and People Graph export honest, deterministic, and versioned.

REQUIRED INVESTIGATIONS AND FIXES
1. Prove rebuild idempotency. A rerun against a changed upstream row must remove stale subjects, shelves, classes, people edges, and locators rather than retaining old `INSERT OR IGNORE` state.
2. Reconcile the claim of deterministic/byte-for-byte rebuilding with timestamps and SQLite behavior. Publish measured logical digests and source hashes.
3. Correct and test LoCC parsing, especially codes containing letters plus digits; ensure comments and implementation agree.
4. Make the extraction queue genuinely one row per work at its highest priority, with an auditable reason list. Prove tier-1/tier-2 overlap behavior.
5. Reconcile locator documentation with schema and tooling: the published contract claims per-book SHA-256 and six individually gzipped tar assets, while the tracked locator builder must demonstrably reproduce that format. Add the missing packer/indexer/verification path rather than documenting magic.
6. Version the export to People Graph. Export source-native author/contributor observations, roles, aliases, work/edition identifiers, subjects, rights, and source snapshot—not silent canonical merges or a domain-specific rank score.
7. Preserve every contributor role, institutional author, pseudonym, and Unicode name. Classification as person/organisation remains an evidenced claim.
8. Record source file digest, retrieval metadata, rights basis, row counts, and release manifest.
9. Add tiny-fixture tests and CI. Do not require downloading Gutenberg in CI.

DESIGN NOTE
Document a future Work/Expression/Edition distinction and modern-book enrichment path using Open Library/Crossref/authority IDs, but do not turn this PR into a full modern-books ingest.

ACCEPTANCE
Two clean fixture builds have equal logical digests. The queue is deduplicated, locator checksums verify, stale-edge tests pass, and the graph export is versioned. Commit, push, and open a draft PR titled `Books: reproducible index and v3 graph export`. Report branch, commits, PR, test output, digests, changed contracts, and any production asset that must be regenerated later.
```

---

## Prompt 7 — External source universe, rights matrix, and acquisition portfolio

```text
You are the source-strategy GPT-5.6 Pro research agent.

SCOPE
- Read/write: sisodias/great-library-of-siso
- Read-only: sisodias/siso-people-graph, sisodias/siso-book-library
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and open a draft PR. Do not bulk-ingest data, scrape sites against terms, commit personal data, or turn the Great Library into a warehouse. Use current official documentation and primary sources. Honor the coordination Event.

BRANCH
`gls/people-source-map-20260806`

RESERVED PATHS
`docs/people-graph-sources/**`, new public-safe Source Inventory records, relevant Events, and generated site output produced only by scripts.

MISSION
Build an evidence-backed acquisition portfolio that can 10× graph breadth while maximizing cross-domain joins, depth, rights safety, and reproducibility. Rows alone are not value.

SOURCES TO ASSESS
At minimum assess:
- scholarly/authority: OpenAlex, Crossref, ORCID public data, DBLP, OpenCitations, ROR, Wikidata, VIAF, Library of Congress authorities, Open Library;
- software/AI: GitHub GraphQL/REST, GH Archive, Software Heritage, ecosyste.ms, PyPI, npm, crates.io, Hugging Face Hub;
- creators/media: Podcast Index and open RSS, YouTube Data API, OpenReview, public conference schedule systems, personal websites with explicit metadata/sameAs;
- public discourse: Stack Exchange, Hacker News, AT Protocol/Bluesky, Mastodon;
- institutions/economic activity: USPTO Open Data/PatentsView successor, NIH RePORTER/EXPorter, SEC EDGAR, and open company registries;
- restricted or high-risk: Reddit, X, LinkedIn, Goodreads, Google Scholar, Crunchbase, and any source without a permitted bulk/reuse path.

FOR EACH SOURCE RECORD
Capture source ID, owner, entity/work/relation types, stable identifiers, bulk/API mode, update cadence, snapshot/version support, rate limits, license/terms revision, attribution, deletion/correction obligations, privacy risk, expected overlap with current populations, likely precision, data volume, cost, sample evidence, and recommendation.

CLASSIFICATION
Assign one of:
- Tier A: open, stable, bulk-capable, high join value;
- Tier B: bounded pilot with quotas or rights constraints;
- discovery_only: may identify links but content is not persisted;
- reject/pending agreement.

Reddit must not be accepted as a default bulk source merely because content is public. Evaluate the current Data API terms, retention/deletion requirements, commercial/research permissions, and prohibition on unlicensed model training.

DELIVERABLES
- A human-readable strategy with a 90-day phased acquisition order.
- A machine-readable source registry suitable for future adapters.
- Public-safe Source Inventories for the first approved source families.
- A shortlist of three high-overlap pilot cohorts, not just the largest datasets.
- Explicit kill criteria for sources that produce little identity overlap or too much legal/operational burden.

ACCEPTANCE
Every material claim cites an official source and observed date. `npm ci` and `npm run verify` pass; generated site files are script-produced. Commit, push, and open a draft PR titled `Research: People Graph source acquisition portfolio`. Report branch, commits, PR, verification, Tier A shortlist, restricted sources, and the pilots recommended for Prompts 8–10.
```

---

## Prompt 8 — Scholarly and authority-identity pilot

```text
You are the scholarly-source GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/great-library-of-siso and sisodias/siso-book-library
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and draft PR. Do not merge, download or commit full snapshots, silently merge identities, or store copyrighted full text. Use official APIs/dumps and preserve source terms. Honor the coordination Event.

BRANCH
`pg/source-scholarly-pilot-20260806`

RESERVED PATHS
`sources/scholarly/**`, `tests/sources/scholarly/**`, and scholarly-specific docs/fixtures.

DEPENDENCY
Use the merged v3 source-observation and identity contracts. Read the source portfolio from Prompt 7. If a dependency is not merged, restrict work to adapters against the published interface and tiny fixtures.

MISSION
Test whether scholarly and library authority sources materially improve identity resolution, modern-author coverage, work depth, affiliations, citations, topics, and cross-domain stitching.

PILOT SOURCES
Prioritize OpenAlex, Crossref, ORCID public data/API, DBLP, Wikidata, VIAF, Library of Congress authorities, ROR, and Open Library. Do not use all sources indiscriminately: start with the smallest combination that answers the cohort question.

COHORT
Build a bounded cohort of roughly 500–2,000 living technical authors/engineers seeded from existing GitHub/YouTube/registry people plus a smaller historical-author control group. Prefer people with an ORCID, DOI authorship, verified website, VIAF/Wikidata ID, or other strong bridge.

IMPLEMENTATION
- Each adapter writes source observations and source-native Works/identifiers only.
- Capture DOI, ORCID, OpenAlex author/work IDs, DBLP person/publication IDs, ROR affiliations, VIAF/LoC/Wikidata authority links, dates, roles, citations, concepts, and source revision where available.
- Use cross-source identifiers as evidence; names alone create review candidates.
- Preserve disagreements rather than choosing one birth date, affiliation, title, or author split silently.
- Provide resumable, rate-aware sampling and fixture playback; tests make no network calls.

MEASURE
Report source-by-source coverage, strong-ID link rate, candidate rate, manually reviewed precision sample, conflicting-identity rate, new Works per person, affiliations/citations/topics added, API cost, and projected full-scale size. Compare against a no-source baseline.

DELIVERABLES
Adapters, mocked fixtures, a reproducible pilot command, metrics report, and a recommendation to promote, revise, or kill each source. No production merge is applied.

ACCEPTANCE
All tests pass and every proposed identity is inspectable with literal evidence. Commit, push, and open a draft PR titled `Pilot: scholarly and authority sources for People Graph`. Report branch, commits, PR, commands, metrics, precision review, rights notes, and the exact source combination worth scaling.
```

---

## Prompt 9 — Software, package, and AI-creator pilot

```text
You are the software-ecosystem GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/great-library-of-siso and sisodias/siso-book-library
- Oracle is out of scope.

AUTHORITY AND SAFETY
Work on a dedicated branch, commit, push, and open a draft PR. Do not merge, bulk-clone repositories, commit large datasets, or store popularity as canonical person truth. Use official/bulk-friendly interfaces and respect rate/crawler policies.

BRANCH
`pg/source-software-ai-pilot-20260806`

RESERVED PATHS
`sources/software/**`, `sources/ai/**`, corresponding tests/fixtures, and source-specific docs.

DEPENDENCY
Use the merged v3 source, Work, contribution, relationship, and identity contracts. Read Prompt 7's source classifications.

MISSION
Move beyond “repo owner plus stars” to a durable graph of software and AI creation: stable accounts, repositories, packages, models, datasets, Spaces/apps, maintainers, contributors, dependencies, releases, organisations, and history.

PILOT SOURCES
Use a bounded combination of GitHub GraphQL/REST, GH Archive, Software Heritage, ecosyste.ms, PyPI, npm, crates.io, and Hugging Face Hub. Prefer snapshots/indexes over per-item crawling where available.

IDENTITY AND WORK RULES
- GitHub numeric account and repository/node IDs are stable identifiers; logins/full names are time-bounded aliases.
- Software Heritage IDs identify archived artifacts/history.
- Package coordinates and registry owner/maintainer records become Works and contribution relationships, not person aliases.
- Hugging Face models, datasets, and Spaces are separate Work types with repository/version/license metadata.
- Organisations remain first-class entities; never coerce them into people.
- Stars, downloads, followers, dependent counts, and citations are timestamped observations used only by named derived projections.

COHORT
Sample high-signal existing GitHub people plus multi-registry maintainers and AI creators. Target enough records to expose transfers, renamed accounts, organisations, co-maintainers, package dependencies, model/dataset relationships, and abandoned/archived works without exceeding a small local fixture database.

MEASURE
New stable IDs, new Work types, maintainership/contribution edges, dependency/citation edges, cross-platform identity candidates, temporal events, source conflicts, API calls, and projected scale. Evaluate whether ecosyste.ms or registry dumps can replace expensive per-account API calls.

DELIVERABLES
Adapters, replayable fixtures, pilot metrics, source method cards, and at least five evidence-first queries demonstrating value beyond star rankings.

ACCEPTANCE
No silent identity merge; no canonical rank mutation; tests are offline. Commit, push, and open a draft PR titled `Pilot: software and AI creator graph`. Report branch, commits, PR, metrics, stable-ID strategy, source costs, and the source subset recommended for scale.
```

---

## Prompt 10 — Living writers, podcasts, talks, video, and public-web pilot

```text
You are the living-creators GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library and sisodias/great-library-of-siso
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and draft PR. Do not merge, scrape behind authentication, download copyrighted media/transcripts without permission, or persist social content merely because it is public. Preserve deletion and source terms.

BRANCH
`pg/source-living-creators-pilot-20260806`

RESERVED PATHS
`sources/creators/**`, `sources/media/**`, corresponding tests/fixtures, and source-specific docs.

DEPENDENCY
Use the merged v3 observation, Work, identity, and rights contracts. Follow Prompt 7's source classifications.

MISSION
Attack the graph's structural overlap problem by loading the populations that should genuinely bridge books, code, talks, podcasts, video, papers, and personal websites: living technical authors, founders, researchers, maintainers, hosts, guests, and speakers.

PILOT SOURCES
Evaluate Podcast Index/open RSS, YouTube Data API, Open Library modern author/edition metadata, Crossref/OpenAlex for technical books/papers, OpenReview, public conference schedule systems, and explicit `sameAs`/author metadata from personal websites. Treat transcript acquisition as a separate rights-gated capability.

COHORT
Build a curated but reproducible cohort of approximately 250 high-overlap people, seeded from existing GitHub creators and modern authors. Include hosts and guests, authors and editors, speakers, channels, podcasts, episodes, talks, courses, newsletters/blog posts where explicitly addressable, and organisations.

MODEL RULES
- Podcast, episode, video, talk, event, course, article, and book are first-class Works/Events.
- Host, guest, speaker, author, editor, interviewer, maintainer, and channel-owner roles live on contribution edges.
- Match through explicit websites, ORCID, stable platform IDs, feed owner metadata, linked profiles, or manually evidenced claims—not name similarity alone.
- Keep channel/show identity separate from the human or organisation operating it.
- Store metadata and evidence pointers by default. Store transcript text only when rights and deletion handling are explicit.

MEASURE
Cross-domain people added, domain count per person, strong identity bridges, episode/talk/work depth, false candidate rate, source freshness, quota cost, and rights coverage. Compare the cohort to the current three-person cross-domain stitch baseline.

DELIVERABLES
Adapters, fixtures, a cohort manifest, metrics, identity review report, and a scale recommendation. Include a source-specific removal/update process.

ACCEPTANCE
Offline tests pass; every bridge is evidence-backed; no unlicensed transcript corpus is committed. Commit, push, and open a draft PR titled `Pilot: living creator cross-domain graph`. Report branch, commits, PR, cohort metrics, precision sample, quota/rights constraints, and the best next source.
```

---

## Prompt 11 — Claims, positions, temporal relationships, and influence projections

```text
You are the reasoning-layer GPT-5.6 Pro agent for sisodias/siso-people-graph.

SCOPE
- Read/write: sisodias/siso-people-graph
- Read-only context: sisodias/siso-book-library and sisodias/great-library-of-siso
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create a branch, commit, push, and open a draft PR. Do not merge, extract the entire corpus, present model inference as accepted truth, or store long copyrighted passages. Honor the Great Library evidence/publication boundaries.

BRANCH
`pg/claims-relations-20260806`

RESERVED PATHS
`claims/**`, `projections/**`, `tests/claims/**`, and reasoning-layer documentation. Coordinate any schema extension through the v3 owner rather than editing core tables ad hoc.

DEPENDENCY
Use the merged v3 assertion/evidence/Work/relationship contract and query interfaces. Read GQ-009's measured extraction limits and question-driven evidence guidance.

MISSION
Give the graph depth, not merely breadth. Enable evidence-backed questions such as: What did this person argue? How did their position change? Who collaborated with, cited, funded, translated, hosted, mentored, or influenced whom? Which conclusions are direct evidence, derived structure, or model hypotheses?

CLAIM CONTRACT
Represent separately:
- verbatim evidence span or precise source locator;
- source-grounded summary/claim;
- subject, predicate, object/value, topic, time, and scope;
- extraction method/model/version;
- confidence and review status;
- supports/challenges/contradicts relationships;
- rights/publication state;
- accepted/rejected/contested decision lineage.
A person never “believes topic X” merely because a Work has a topic tag.

RELATIONSHIPS AND PROJECTIONS
Implement or specify evidenced temporal relations including co-created, cited, referenced, translated, edited, maintained, depended_on, affiliated_with, funded_by, advised/mentored, appeared_on, hosted, spoke_at, and contemporary_with. Compute coauthor, influence, expertise, centrality, and trajectory only as named/versioned projections with method cards, source scope, and timestamp. No universal stored score.

PILOT
Use a question-driven sample of roughly 20 people and three topics. Prefer public-domain Book Library text and sources with clear reusable licenses. For copyrighted sources, retain short compliant evidence or locators rather than full text. Include at least one changed position, one disagreement, one translation/editorial role, and one cross-domain creator.

DELIVERABLES
Claim extraction/import interface, review workflow, contradiction/support model, temporal relation projections, tests, method cards, and query examples. Measure claim precision and reviewer effort; do not claim generality from the pilot.

ACCEPTANCE
Queries can trace every claim and relation to evidence and distinguish observation, accepted claim, derivation, and model inference. Commit, push, and open a draft PR titled `Reasoning: claims and temporal relations for People Graph`. Report branch, commits, PR, sample results, review precision, rights handling, and limits.
```

---

## Prompt 12 — Final integration, registry publication, and adversarial release gate

```text
You are the final integration and adversarial QA GPT-5.6 Pro agent across the SISO library system.

REPOSITORIES
- Read/write: sisodias/siso-people-graph, sisodias/siso-book-library, sisodias/great-library-of-siso
- Oracle is out of scope.

AUTHORITY AND SAFETY
Create one integration branch per repository, intentional commits, push each, and open linked draft PRs. Do not merge your own PRs, force-push, delete existing releases, or publish large production assets unless the user separately instructs it. Use the connected GitHub app first.

BRANCHES
- `pg/v3-integration-gate-20260806`
- `books/v2-integration-gate-20260806`
- `gls/people-graph-v3-publication-20260806`

DEPENDENCY
Start from current main only after the selected PRs from Prompts 1–11 have merged. Read every merged handoff and the canonical coordination Event. Do not recreate features from stale branches.

MISSION
Prove that the combined system is coherent, reproducible, rights-aware, and useful before declaring a release. Then publish only public-safe registry metadata and close the coordination loop.

ADVERSARIAL GATES
1. Identity: shared company/location/name never auto-merges; stable-ID conflicts block clusters; decisions are reversible; accepted claims affect all queries.
2. Rebuild: two clean fixture builds produce equal logical digests and row counts; reruns are idempotent; source replacement removes stale rows.
3. Graph integrity: no orphan Works/contributions/evidence; foreign keys pass; source and rights coverage meet documented thresholds.
4. Book integration: versioned export imports roles, aliases, Works, and rights without silent canonical merge; queue and locator contracts verify.
5. Query: ambiguity and provenance are visible; no hard-coded private topology; read-only surfaces enforce budgets and parameter binding.
6. Rights/deletion: every source has terms revision and removal/update behavior; restricted discovery-only sources cannot leak content into releases.
7. Performance: benchmark representative `who`, `works`, `path`, `timeline`, `claims`, and inventory queries and publish measured limits.
8. Regression: run Prompt 1's original failure fixtures and prove the selected P0s are resolved.

GREAT LIBRARY PUBLICATION
- Register the People Graph and Book Library as independently addressable Works if the accepted ADR requires it, with exact current `sisodias` locators or documented aliases.
- Create immutable Release Manifests for the code/data-contract versions actually proven—not for unbuilt production data.
- Update Source Inventories and the People Graph Frontier Question with measured pilot evidence, remaining gaps, and next triggers.
- Create/refresh a whole-Library Snapshot according to repository policy.
- Publish a closing Event that lists merged commits, release IDs, unresolved risks, rejected sources, and the next bounded program.
- Generate the site only through tooling and run the complete Great Library verification/deploy checks without deploying unless authorized.

DELIVERABLES
Linked draft PRs, a cross-repo release-gate report, test/benchmark receipts, registry records, release manifests, snapshot, and closing Event.

ACCEPTANCE
All required checks pass or the release is explicitly blocked with exact failures; do not paper over a red gate. Commit and push all branches, open linked draft PRs, and report every branch/commit/PR, verification command, benchmark, resolved P0, remaining risk, and whether the program is release-ready.
```
