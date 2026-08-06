# Registry-lane handoff

## Scope

Create the Great Library public program spine for the People Graph 100× expansion: stable independent Works, exact source-contract Releases, ADR-0005, one thirteen-lane `initiative_started` Event, GQ-010, V37, public interfaces, and current-state guidance.

## Changed paths

- `registry/works/siso-people-graph.json`
- `registry/works/siso-book-library.json`
- `registry/works/frontier-question-gq-010.json`
- `registry/releases/siso-people-graph-de048bb.json`
- `registry/releases/siso-book-library-be9ab08.json`
- `registry/releases/frontier-question-gq-010-program-v1.json`
- `registry/decisions/adr-0005-people-graph-ownership-and-data-plane.json`
- `registry/events/2026-08-06-people-graph-parallel-program-started.json`
- `registry/snapshots/whole-library-v37.json`
- `docs/people-graph-program/**`
- `CURRENT_STATE.md`
- generated `site/**` only through repository tooling

## Commands

```bash
npm ci
npm run verify
```

The pull-request workflow is the authoritative execution environment for this connector-created branch. The verification command validates schemas and immutable history, executes contract tests, regenerates the site and catalog, checks links and attribution, and scans publication output.

## Tests

- Registry and schema validation for three new Works, three Releases, ADR-0005, the program Event, and V37.
- Immutable-history protection: no existing Release, Snapshot, Decision, or Event is modified.
- Research-question contract validation for GQ-010.
- Snapshot manifest SHA-256 checks for all selected Release files.
- Generated-site and catalog checks.
- Publication-safety scans for credentials, private locators, machine paths, and unsafe references.

## Assumptions

- `sisodias/siso-people-graph@de048bb3b34bf931b56fd741cb46c1334acdfb98` and `sisodias/siso-book-library@be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b` are the exact public source revisions available at program launch.
- Repository visibility proves addressability, not a license, clean build, data availability, installation, or production operation.
- SISO Knowledge can own canonical-service governance while People Graph and Book Library retain independent Work and repository identity.
- All future lanes can start from current main and publish draft contracts without waiting for this PR to merge.

## Compatibility seams

- Stable Work IDs: People Graph `gls:work:2b03baa8-6dab-4e91-ab4c-9b8db4543236`, Book Library `gls:work:35d3f881-43f3-4da5-87b0-abf694f387ef`, GQ-010 `gls:work:38dfc806-5a03-45ae-84fc-266f3cacd7be`.
- Source revisions: People Graph `de048bb3b34bf931b56fd741cb46c1334acdfb98`, Book Library `be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b`.
- Cross-lane observation envelope: `pg-observation-0.1`.
- Control-plane decision: `ADR-0005`.
- Current selection after merge: Whole Library V37 `gls:snapshot:29c1b8ef-d173-4a18-b15b-291412d43fc9`.
- Generated `site/` remains tooling-owned; source records and authored docs are the edit surfaces.

## Known risks

- The reviewed People Graph v2 builder resolves a schema beside the loader while the tracked schema is under `schema/`; this lane makes no clean-build claim.
- Neither source revision contains an accepted repository license, so forkability and general reuse remain unavailable.
- Source READMEs describe Foundry affiliation more broadly than ADR-0005; source-owning lanes must reconcile prose without erasing history.
- Historical links using a different GitHub owner remain an evidence-backed migration question, not an assumed alias.
- Current database counts, data quality, Book Library payload assets, byte-range behavior, external APIs, and production operations were not independently verified.
- GQ-010 has no baseline decision-use measurements or accepted Answer Release.

## Data and rights notes

- No database, raw source snapshot, restricted observation, payload archive, credential, private receipt, or machine-specific locator is committed.
- Rights are source- and jurisdiction-specific. Unknown and restricted states block public payload promotion.
- Living-person collection must be purpose-limited, minimized, correctable, and tied to public or authorized evidence.
- Public GitHub source visibility is not treated as a copying or redistribution grant.
- Book public-domain claims must remain jurisdiction-scoped and source-evidenced.

## Suggested merge considerations

1. Review ADR-0005 before accepting source-repository changes that redefine canonical ownership.
2. Preserve the exact Work and Release IDs; use successor immutable records for corrections.
3. Require all thirteen draft handoffs before selecting a production schema or database migration.
4. Treat lane outputs as proposals until their owning repositories pass tests and rights review.
5. Recompute V37 Release hashes after any Release-file edit.
6. Keep generated `site/` changes subordinate to `npm run verify`.
7. Close the active Event only with a successor Event that cites reviewed handoffs, verification evidence, and the next selected Snapshot.
