# Great Library — `.agents/tasks/`

Open engineering work for the Great Library and for estate-wide concerns that no
single repository owns.

Adopts the SISO org `.agents/tasks/` convention (see
`SISO_Agency/apps/oracle-streaming/.agents/tasks/`): one task per
`backlog/TASK-NNNN/task.json`, validated against `task_schema.json`, with the
`status` field canonical and the folder mirroring it.

Tasks may move among `backlog/`, `in_progress/`, and `completed/`; the JSON
`status` remains canonical. Lane handoffs use `lane_closure_schema.json` and do
not create a second task shape.

## Why tasks are here and not in `registry/`

The registry is a catalog. `docs/task-state-system-map.html` is an accepted
decision dated 2026-07-30 which rules that **Agent Brain owns shared task
truth** — the Library records what exists and what was decided, and does not own
an engineering task surface. Events record what happened; Frontier Questions
carry research contracts; neither is a backlog. Creating `registry/tasks/` would
contradict that standing decision, so this uses the org convention instead.

Tasks live in the repository that owns the work, per ADR-0005's ownership model.
People Graph tasks are in `sisodias/siso-people-graph`, Book Library tasks in
`sisodias/siso-book-library`, Foundry tasks in `sisodias/siso-foundry`. Only
Great-Library-owned and estate-wide work is tracked here, because this is the
control plane.

## Every task carries its receipt

Each `task.json` names the finding id, file path, branch or commit it came from,
in `evidence` and `spec.context`. A task without provenance becomes folklore
within a week and gets re-derived from scratch — which is the specific waste this
registry exists to prevent.

That failure has already happened here once. `prompt-evolution.md` correctly
identified the empty-branch problem days before this consolidation, wrote it
down accurately, and nobody could reach it because it sat on an unmerged branch.
The findings were never lost; they were unreachable. Same outcome as losing them.

## Durable rationale

`consolidation-source/` holds the two documents behind every task here:

- `ESTATE-STATUS.md` — where each repository, branch and lane actually stood on
  2026-08-07, derived by reading contents rather than filenames.
- `CONSOLIDATION-PLAN.md` — the reasoning, the measured findings, the preserved
  negative results, and what the programme's own record says about itself.

They are copied in deliberately. They were written in a session scratchpad and
would otherwise die with that session.

## Ordering note

`TASK-0005` (pre-register a GQ-010 baseline) is time-critical in a way the others
are not. Once merges land, today's graph is gone and the before-picture cannot be
reconstructed. It does not depend on any other task and should be started first.
