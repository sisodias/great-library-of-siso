# Great Library agent workspace

Agent infrastructure for bounded Great Library work. This directory never
replaces the Great Library registry or public Event history.

- `tasks/` — the existing estate-wide engineering task convention; see its
  README for why tasks live here rather than in `registry/`.
- `runs/<run-id>/` — goal, status, handoffs, and evidence artifacts for a
  durable run.
- `scratchpads/<run-or-task>/<agent>/` — resumable working state using bounded
  `NOW.md`, `NOTES.md`, and `receipts/`.
- `scratchpad/` — retained singular compatibility tree for older sessions.

Machine-local registry placement belongs only under ignored `.local/`. Raw
transcripts, credentials, browser profiles, databases, legal material, private
topology, and duplicate memory brains do not belong here.

`registry/` remains the catalog: Works, Releases, Assemblies, Source
Inventories, Decisions, Events, and Snapshots.
