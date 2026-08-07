# Parallel swarm GitHub status — 2026-08-06

**Observed:** 2026-08-06T23:03:01+07:00

This is a GitHub-verified status, not a claim about hidden or still-running ChatGPT sessions. A branch that is identical to `main` is marked as an empty reservation, not as pushed work.

| Prompt | Repository | Expected branch | Verified state | Ahead / behind | PR | Head |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `sisodias/great-library-of-siso` | `gls/people-graph-parallel-spine-20260806` | `draft_pr` | 19 / 0 | [#1](https://github.com/sisodias/great-library-of-siso/pull/1) | `4dc971409663` |
| 2 | `sisodias/siso-people-graph` | `pg/red-team-fixtures-20260806` | `draft_pr` | 12 / 0 | [#1](https://github.com/sisodias/siso-people-graph/pull/1) | `89dfec07acc3` |
| 3 | `sisodias/siso-people-graph` | `pg/v3-ontology-schema-20260806` | `draft_pr` | 1 / 0 | [#3](https://github.com/sisodias/siso-people-graph/pull/3) | `2f66fbe1f452` |
| 4 | `sisodias/siso-people-graph` | `pg/identity-resolution-parallel-20260806` | `branch_reserved_empty` | 0 / 0 | — | `de048bb3b34b` |
| 5 | `sisodias/siso-people-graph` | `pg/reproducible-builds-parallel-20260806` | `absent` | — | — | — |
| 6 | `sisodias/siso-people-graph` | `pg/query-surface-parallel-20260806` | `absent` | — | — | — |
| 7 | `sisodias/siso-book-library` | `books/integrity-export-parallel-20260806` | `absent` | — | — | — |
| 8 | `sisodias/great-library-of-siso` | `gls/people-graph-source-research-20260806` | `draft_pr` | 7 / 0 | [#2](https://github.com/sisodias/great-library-of-siso/pull/2) | `20dc000451c2` |
| 9 | `sisodias/siso-people-graph` | `pg/scholarly-authority-pilot-20260806` | `absent` | — | — | — |
| 10 | `sisodias/siso-people-graph` | `pg/software-ai-pilot-20260806` | `draft_pr` | 24 / 0 | [#2](https://github.com/sisodias/siso-people-graph/pull/2) | `b78ff6704783` |
| 11 | `sisodias/siso-people-graph` | `pg/living-creators-media-pilot-20260806` | `branch_reserved_empty` | 0 / 0 | — | `de048bb3b34b` |
| 12 | `sisodias/siso-people-graph` | `pg/claims-temporal-relations-20260806` | `branch_reserved_empty` | 0 / 0 | — | `de048bb3b34b` |
| 13 | `sisodias/siso-people-graph` | `pg/parallel-integration-contract-20260806` | `pushed_no_pr` | 1 / 0 | — | — |

## Interpretation

- Five lanes have open draft PRs.
- Prompt 13 has a substantial pushed integration branch but no PR was observed.
- Prompts 4, 11 and 12 have branch reservations with zero commits beyond `main`.
- Prompts 5, 6, 7 and 9 have no matching GitHub branch or PR.
- Book Library exposes only `main` as of this observation.
- The older `register-graph-and-book-library` branch is one commit ahead and eight behind current Great Library `main`; it overlaps newer registry work and must be reviewed separately.

## Durable rule

Future status reports must compare branch refs to the current base. Do not infer work from a ChatGPT conversation title or branch existence alone.
