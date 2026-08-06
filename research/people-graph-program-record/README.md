# SISO People Graph program record

**Observed:** 2026-08-06T23:03:01+07:00  
**Scope:** `sisodias/siso-people-graph`, `sisodias/siso-book-library`, and `sisodias/great-library-of-siso`  
**Explicitly out of scope:** Oracle

This directory is the durable, public-safe audit trail behind the People Graph expansion program. It preserves the evidence inspected, the reasoning method, the conclusions and uncertainties, the original and revised agent prompts, and the GitHub state of every parallel lane.

## Reasoning disclosure

This record does **not** publish private token-by-token model chain-of-thought or hidden scratchpad text. Those traces are not a reliable or appropriate project artifact. It publishes the useful equivalent agents need to reproduce and challenge the work:

- exact inputs and source revisions;
- observed facts separated from interpretations and recommendations;
- assumptions, alternatives, calculations and rejected approaches;
- code-path reasoning for every major finding;
- known uncertainty and unverified claims;
- machine-readable findings and source receipts;
- the complete copy/paste prompt history;
- current branch and draft-PR status;
- deterministic local validation.

A capable agent should be able to independently retrace the audit from these receipts without trusting the conclusion merely because it is written here.

## Contents

| File | Purpose |
| --- | --- |
| [`complete-decision-record.md`](complete-decision-record.md) | Full method, architecture reconstruction, findings, alternatives, value model, calculations and gates. |
| [`findings.json`](findings.json) | Stable machine-readable findings with evidence and remediation. |
| [`source-receipts.md`](source-receipts.md) | Human-readable evidence ledger. |
| [`source-receipts.json`](source-receipts.json) | Machine-readable repository, PR and official-source receipts. |
| [`swarm-status-2026-08-06.md`](swarm-status-2026-08-06.md) | Verified lane-by-lane GitHub status. |
| [`swarm-status-2026-08-06.json`](swarm-status-2026-08-06.json) | Machine-readable lane status. |
| [`prompt-evolution.md`](prompt-evolution.md) | Why the dependency-ordered pack was replaced by a simultaneous parallel-slam pack. |
| [`prompts/dependency-ordered-superseded.md`](prompts/dependency-ordered-superseded.md) | Original prompt pack, retained for history and comparison. |
| [`prompts/parallel-slam.md`](prompts/parallel-slam.md) | Current thirteen-agent parallel pack. |
| [`verify_record.py`](verify_record.py) | Offline consistency validation. |
| [`file-manifest.json`](file-manifest.json) | Git-native blob-ID receipt for every record file except the manifest itself. |
| [`HANDOFF.md`](HANDOFF.md) | Scope, limitations and next review actions. |

## Fast verification

From the repository root:

```bash
python3 research/people-graph-program-record/verify_record.py
```

The validator checks JSON integrity, unique IDs, evidence references, all thirteen expected lanes, prompt count, branch-state invariants and internal Markdown links. It performs no network calls and makes no production-data claim.

## Most important conclusions

1. Do not bulk-load another large source into v2 canonical tables until identity semantics, observation separation and reproducible builds are fixed.
2. The People Graph should be an evidence-backed creator/Work/relationship/claim system—not merely a larger person-to-content table.
3. Source observation, identity proposal, accepted canonical decision and derived projection must remain distinct.
4. Stable source-issued IDs need declared uniqueness semantics; employer, location, name and biography are never exact identifiers.
5. Works, versions, contribution roles, temporal relationships, claims and rights/removal state must be first-class.
6. The Great Library is the public identity/lineage/control plane; mutable databases and raw source snapshots remain in a governed external data plane.
7. As of this record, five draft PRs exist, one additional non-empty branch is pushed without a PR, three branches are empty reservations, and four expected branches are absent.

## Truth boundary

The original source-level audit did not independently download and query the full People Graph production SQLite release. Counts quoted from repository documentation are repository claims pinned to exact revisions, not an independent row-by-row production audit. Draft PR test results are claims in those PRs unless separately rerun by a reviewer.
