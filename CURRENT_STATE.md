# Current state — The Great Library of SISO

**Verified:** 2026-08-06  
**Public repository:** https://github.com/Lordsisodia/great-library-of-siso  
**Live Library:** https://great-library-of-siso.vercel.app/  
**Operating status:** Whole Library V37 is the active immutable Snapshot. It preserves the V36 portfolio and adds the People Graph 100× public program spine: two independently addressable Research Works, one scoped Frontier Question, exact source-contract Releases, ADR-0005, and one active thirteen-lane initiative Event.

## What is live

- The public registry, generated site, repository estate, machine-readable catalog, promotion surface, God Questions Observatory, and Ecosystem Intelligence projection remain the Great Library's control and reading plane.
- Whole Library V37 (`gls:snapshot:29c1b8ef-d173-4a18-b15b-291412d43fc9`) is the highest-numbered whole-Library Snapshot and therefore the current selection. It contains 28 Works, 28 selected Releases, and the unchanged immutable Agent Stack Assembly.
- The registry now contains 28 Works, 79 total Releases, 37 Snapshots, five immutable Decisions, 29 append-only Events, and one Assembly.
- SISO People Graph is an independent Research Work (`gls:work:2b03baa8-6dab-4e91-ab4c-9b8db4543236`) selected through exact source-contract Release `gls:release:23a94255-5c40-417b-88bc-d1ab6176d81e` at `sisodias/siso-people-graph@de048bb3b34bf931b56fd741cb46c1334acdfb98`.
- SISO Book Library is an independent Research Work (`gls:work:35d3f881-43f3-4da5-87b0-abf694f387ef`) selected through exact source-contract Release `gls:release:bc95af72-cc82-4836-9e7d-2914d05a5fec` at `sisodias/siso-book-library@be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b`.
- GQ-010 (`gls:work:38dfc806-5a03-45ae-84fc-266f3cacd7be`) asks how to increase People Graph research and decision value by 100× while measuring breadth, identity resolution, research depth, decision value, rights and privacy, reproducibility, and cost separately. Seed Release `gls:release:3de55ee0-ec67-433a-b061-5bebabf0cb4e` establishes publication-safe question identity; selected Release `gls:release:f8ddbc97-e795-474a-b9c1-e508bd9e1787` carries the richer question-program metadata. Neither is an Answer Release.
- ADR-0005 (`gls:decision:97c0be80-9ae4-4874-84e9-5f80062f68a8`) assigns stable identity and public lineage to the Great Library; canonical-service governance for durable graph and index semantics to SISO Knowledge; source discovery and evaluation to Foundry; source-grounded transformation and adjudication to Evidence Engines; and mutable databases, source snapshots, restricted observations, payloads, private receipts, and machine-specific locators to an external governed data plane.
- The active initiative Event `gls:event:f7dbd510-879c-405b-9cac-58d3dd598501` records all thirteen simultaneous lanes, their branches, exclusive path zones, current-main starts, no-wait rule, and draft-PR handoffs. This launch Event is immutable; state changes require successor Events.
- `docs/people-graph-program/` publishes the responsibility matrix, `pg-observation-0.1` envelope, lane manifest, and registry handoff.
- The People Graph and Book Library Releases make deliberately narrow claims: exact code and data-contract addressability only. They do not claim a v3 production database, clean installation, current database counts, fresh payload assets, source completeness, byte-range behavior, or production operation.
- Neither pinned source revision contains an accepted repository license. Forkability and general copying, modification, or redistribution remain unavailable until evidenced.
- The reviewed People Graph v2 builder resolves a schema beside the loader while the tracked schema is under `schema/`; GQ-010 records this as a reproducible-build evidence gap rather than presenting a clean-build claim.
- Historical repository links under a different GitHub owner remain an explicit verification and migration question. Do not globally replace them or assume an alias without evidence.
- The V36 Agency OS coverage selection, twenty-five prior Work selections, selected Great Library and Foundry Releases, immutable Agent Stack Assembly, promotion contracts, God Questions infrastructure, and prior Decisions and Events remain unchanged and selected in V37.
- The Library's selected self-release remains `1.4.0+2e9b7c8` (`gls:release:1f8b6c2d-72f4-4b90-9e1f-3d5a7c8b2e64`); V37 adds program records without rewriting the Great Library's prior immutable self-Release.
- The latest active state is always the highest numeric `version` among immutable whole-Library Snapshots. Do not infer current state from filename order alone.

## Operating boundaries

- GitHub and immutable registry records define public identity; local folders do not.
- The Great Library owns stable identity, lineage, Decisions, Events, Snapshots, generated projections, and publication-safe program metadata. It is not the People Graph database or a raw-source mirror.
- SISO Knowledge owns canonical-service governance for durable corpus, graph, index, and retrieval semantics while People Graph and Book Library retain independent repository and Release identity.
- Foundry discovers and evaluates source universes and may emit observations. It does not silently become canonical person, identity, merge, or claim truth.
- Evidence Engines transform and adjudicate source-grounded observations and claims. Transformations must preserve provenance, rights, receipts, and reversibility.
- Mutable SQLite databases, raw source snapshots, restricted or discovery-only observations, payload archives, credentials, personal notes, private receipts, and machine-specific locators stay outside this repository.
- Catalog presence or public repository visibility does not imply download, install, fork, portability, ownership, licensing, or redistribution rights. Those claims require explicit Release evidence.
- Identity links are claims with literal evidence and a reversible decision. Display-name equality is never enough for a silent merge.
- Observation time and effective time remain distinct; source vocabularies and source-native identifiers remain namespaced.
- Rights and privacy state travel with observations and derivatives. Unknown or restricted states block public payload promotion.
- `site/` is generated. Edit registry records, authored docs, or the generator, then run the repository gate.
- Existing immutable Releases, Snapshots, Decisions, and Events are append-only. Correct them through successor records.

## Verification contract

```bash
npm ci
npm run verify
```

The gate validates schemas, referential integrity, immutable history, Release and Snapshot hashes, promotion contracts, Ecosystem Intelligence, research-question contracts, generated site and catalog output, local links, attribution, and publication safety.

## Resume here

1. Read `AGENTS.md`, ADR-0005, Whole Library V37, and `site/intelligence.json`.
2. Read `docs/people-graph-program/README.md`, the control/data-plane matrix, `pg-observation-0.1`, the thirteen-lane manifest, and the registry handoff.
3. Start each source or implementation lane from the current `main` of its owning repository; do not reuse a prior task branch and do not wait on another lane.
4. Keep every lane inside its exclusive path zone and open a draft PR with scope, changed paths, commands, tests, assumptions, compatibility seams, known risks, data and rights notes, and merge considerations.
5. Treat source observations, extracted claims, identity links, temporal relations, and projections as typed evidence until the owning repository explicitly adjudicates and admits them.
6. Establish five pre-registered decision-use baselines before claiming 100× value; more rows or edges alone cannot pass GQ-010.
7. Require a versioned identity benchmark, source-specific rights and privacy rules, reproducible build receipts, and end-to-end observation/adjudication evidence before selecting a production database successor.
8. Preserve stable Work IDs and exact source revisions. Corrections require successor Releases, Events, Decisions, or Snapshots rather than edits to immutable history.
9. Close the active People Graph initiative only through a successor Event that cites reviewed draft handoffs, verification evidence, and the next selected Snapshot.

## Known external action

An OpenRouter credential formerly present in reachable Skills Hub history was removed from published history. Provider-side revocation or rotation remains the only accepted closure; never copy the old value into a task, issue, log, or document.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
