# Thirteen no-wait parallel lanes

All lanes begin from the current `main` of their owning repository. They start simultaneously, do not wait on another lane, stay inside their path zone, open draft PRs early, and communicate through versioned contracts plus handoff files. A lane must not edit another lane's branch or privately coordinate hidden database changes.

| Lane | Mission | Branch | Exclusive path zone |
| ---: | --- | --- | --- |
| 1 | Great Library registry and public program | `gls/people-graph-parallel-spine-20260806` | New People Graph and Book Library Works and Releases; ADR-0005; program Event; GQ-010 and program Release; V37; `CURRENT_STATE.md`; `docs/people-graph-program/**`; generated `site/` and only relevant generator/check changes. |
| 2 | People Graph red-team fixtures | `pg/red-team-fixtures-20260806` | `tests/red_team/**`; `docs/audits/**`; `docs/handoffs/red-team.md`; `tests/red_team/run.py`. |
| 3 | v3 ontology and schema | `pg/v3-ontology-schema-20260806` | `schema/v3/**`; `docs/architecture/**`; `tests/schema_v3/**`; `docs/handoffs/schema-v3.md`. |
| 4 | Identity resolution | `pg/identity-resolution-parallel-20260806` | `identity_v3/**`; `loaders/match_identities.py`; `loaders/enrich_owners.py`; `tests/identity_v3/**`; `docs/handoffs/identity-resolution.md`. |
| 5 | Reproducible builds | `pg/reproducible-builds-parallel-20260806` | `build_v3/**`; `manifests/**`; `loaders/build_people_graph_v2.py`; `loaders/load_owner_topics.py`; `loaders/load_owners_into_people_graph.py`; `tests/build_v3/**`; build-specific `.github/workflows/**`; `docs/handoffs/reproducible-builds.md`. |
| 6 | Query, API, MCP, and explorer | `pg/query-surface-parallel-20260806` | `query_v3/**`; `api/**`; `mcp/**`; `viewer/**`; `loaders/ask.py`; `tests/query_v3/**`; `docs/handoffs/query-surface.md`. |
| 7 | Book Library integrity and export | `books/integrity-export-parallel-20260806` | In the Book Library: `scripts/**`; `index/**`; new `tests/**`; `manifests/**`; `docs/**`; `.github/workflows/**`. |
| 8 | Source research | `gls/people-graph-source-research-20260806` | `research/people-graph-sources/**`. |
| 9 | Scholarly authority pilot | `pg/scholarly-authority-pilot-20260806` | `sources/scholarly/**`; `tests/sources_scholarly/**`; `docs/source-methods/scholarly/**`; `docs/handoffs/scholarly-pilot.md`. |
| 10 | Software and AI pilot | `pg/software-ai-pilot-20260806` | `sources/software/**`; `sources/ai/**`; `tests/sources_software_ai/**`; `docs/source-methods/software-ai/**`; `docs/handoffs/software-ai-pilot.md`. |
| 11 | Living creators and media pilot | `pg/living-creators-media-pilot-20260806` | `sources/creators/**`; `sources/media/**`; `tests/sources_creators_media/**`; `docs/source-methods/living-creators/**`; `docs/handoffs/living-creators-pilot.md`. |
| 12 | Claims, temporal model, and projections | `pg/claims-temporal-relations-20260806` | `claims/**`; `projections/**`; `tests/claims/**`; `docs/reasoning/**`; `docs/handoffs/claims-relations.md`. |
| 13 | Parallel integration contract | `pg/parallel-integration-contract-20260806` | `integration/**`; `tests/integration_parallel/**`; `docs/integration/**`; `docs/handoffs/integration-contract.md`. |

## Shared operating contract

- **Current-main start:** branch from the latest available `main`; do not reuse a prior task branch.
- **No waits:** unresolved dependencies become assumptions, interface proposals, fixtures, or explicit blockers in the draft handoff.
- **Exclusive writes:** source repositories are writable only by their owning lanes. This registry lane treats both source repositories as read-only.
- **Draft handoffs:** each lane opens a draft PR and records scope, changed paths, commands, tests, assumptions, compatibility seams, known risks, data and rights notes, and merge considerations.
- **Observation exchange:** cross-lane source evidence uses `pg-observation-0.1` or a documented compatible successor.
- **No silent truth promotion:** source observations, extracted claims, identity links, and derived projections remain typed and evidenced until adjudicated.
- **No production overclaim:** a lane may ship fixtures, schemas, adapters, manifests, or contracts without claiming a current production database or complete source corpus.
- **Integration authority:** the owning repository resolves conflicts after reviewing all relevant draft handoffs. No lane rewrites another lane's history.
