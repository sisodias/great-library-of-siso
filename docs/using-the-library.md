# Using the Library

The Library supports human browsing and deterministic agent reading without treating all source as one repository.

## Browse and retrieve

| Scope | What a reader receives | Important boundary |
| --- | --- | --- |
| Work | Stable Library detail page and machine record | Upstream docs/demo links are optional; catalog presence is not payload availability |
| Section | A versioned browse projection of Works and relationships | Section placement does not define Work identity or ownership |
| Release | Immutable manifest and any explicitly evidenced artifact state | Fetch or reuse claims are valid only when the manifest and license evidence support them |
| Whole Library | A named, metadata-complete Snapshot | Payloads require separate per-artifact materialization receipts |

The generated hosted site is the common public reading surface. It avoids operating a separate site for every repository while ensuring every accepted Work has an always-on Library page. The current production surface is [great-library-of-siso.vercel.app](https://great-library-of-siso.vercel.app/).

The generated [Repository Estate](https://great-library-of-siso.vercel.app/estate/) and `/estate.json` are operational projections of the latest immutable snapshot. They distinguish repositories carrying a pinned source artifact from linked or staging homes. They never replace stable Work identities.

## Compose and research

Build compositions by following typed relationships and interpreting roles in that context. Do not turn a current view into a permanent ownership or containment claim.

For research, prefer accepted records and Release Manifests over prose summaries. Preserve public evidence for provenance, ownership, license, and distribution claims. Clearly distinguish an observed fact from an inference or project decision.

## Cite

Cite the stable Work ID. Add the Release identifier when a statement depends on a particular version, and add the Snapshot identifier when the surrounding view matters. A repository URL alone is not a durable citation because locators can move.

## Correct and contribute

Correct authored source records, then regenerate the site. Do not patch generated Work pages. Follow [CONTRIBUTING.md](../CONTRIBUTING.md) for clean-room classification, provenance, and verification requirements.

## Planned programmatic access

The near roadmap adds CLI and MCP readers for the same Work, Section, Release, and Snapshot contracts. The first programmatic surfaces are intentionally read-oriented: discovery, inspection, traversal, and retrieval. Registry mutation continues through reviewable source changes and the shared validation gate.

No command name or remote mutation API is promised until it is implemented and documented from the accepted contracts.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
