# People Graph 100× parallel program

**Started:** 2026-08-06  
**Great Library branch:** `gls/people-graph-parallel-spine-20260806`  
**Frontier Question:** `GQ-010` / `gls:work:38dfc806-5a03-45ae-84fc-266f3cacd7be`  
**Ownership decision:** `ADR-0005` / `gls:decision:97c0be80-9ae4-4874-84e9-5f80062f68a8`

This directory is the public program spine for increasing the People Graph's research and decision value by 100×. It records identities, governance, interfaces, lanes, and handoff rules. It does **not** contain a production graph database, raw source snapshots, restricted observations, payload archives, private receipts, or a claim that any source pilot has shipped.

## Registered Research Works

| Work | Stable ID | Pinned source contract | Honest state |
| --- | --- | --- | --- |
| SISO People Graph | `gls:work:2b03baa8-6dab-4e91-ab4c-9b8db4543236` | `sisodias/siso-people-graph@de048bb3b34bf931b56fd741cb46c1334acdfb98` | Independently addressable code and data contract; clean build, v3 schema, current database, installation, and production operation are unverified here. |
| SISO Book Library | `gls:work:35d3f881-43f3-4da5-87b0-abf694f387ef` | `sisodias/siso-book-library@be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b` | Independently addressable code and data contract; rebuilt indexes, payload assets, current counts, installation, and production operation are unverified here. |
| GQ-010 | `gls:work:38dfc806-5a03-45ae-84fc-266f3cacd7be` | Great Library registry metadata | Scoped research program; not an Answer Release. |

## Program rule

Value is not row count. GQ-010 evaluates six dimensions separately:

1. breadth of replayable source-native observations;
2. identity-resolution quality and reversibility;
3. research depth from observation to cited claim to adjudication;
4. measured decision value;
5. rights and privacy safety;
6. reproducibility and cost.

A lane can add substantial data and still fail the program if it does not improve a pre-registered decision, cannot preserve evidence, weakens identity precision, violates rights or privacy, or cannot be reproduced.

## Read next

- [Control plane and data plane](control-plane-data-plane.md)
- [`pg-observation-0.1` interchange](observation-envelope-v0.1.md)
- [Thirteen parallel lanes](parallel-lanes.md)
- [Registry-lane handoff](handoff-registry.md)

## Integration posture

All lanes start from the current `main` of their owning repository. They do not wait on other lanes. Each lane stays within its exclusive path zone, opens a draft PR early, and publishes a handoff that names scope, changed paths, commands, tests, assumptions, compatibility seams, risks, data and rights notes, and merge considerations.

Parallel outputs are proposals and evidence until an owning repository accepts them. Great Library registration does not grant source reuse, authorize data collection, adjudicate claims, or promote a database to canonical production state.
