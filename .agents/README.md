# .agents/

Agent infrastructure for the Great Library.

- `tasks/` — open engineering work (org `.agents/tasks/` convention). See its README
  for why tasks live here rather than in `registry/`.
- `scratchpad/` — temporary agent writes. Contents gitignored; use this rather than
  `/tmp` so work survives a session and stays attributable to the repo.

`registry/` remains the catalog: Works, Releases, Decisions, Events, Snapshots.
