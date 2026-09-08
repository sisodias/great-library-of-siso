# The Great Library of SISO

The public registry and reading surface for SISO research, software and agent
systems. Works hold stable identity; Releases preserve evidenced versions;
Snapshots select a named view; Assemblies describe how Works operate together.

Current review work: [reramp continuation](runs/library-reramp-20260908/CONTINUE.md).
Use `node bin/gls tasks` and `node bin/gls task TASK-0007` for canonical scope.
The shared frame and read CLI are implemented on the review branch; public
publication and remaining visual acceptance are separate gates.

Current verified published work and exact source/publication receipts
are in [CURRENT_STATE.md](../CURRENT_STATE.md). Start with [AGENTS.md](../AGENTS.md)
and the [onboarding map](../docs/onboarding.html).

Run `npm ci` and `npm run verify`. Build with `npm run build`. Publish only the
verified `site/` directory using the installed publish skill or the documented
Cloudflare deploy command. On constrained machines use a process-group memory
guard and keep builds below 2 GB; no dev server is needed.

Repository and Library identity are in [repos.json](repos.json), the public URL
is in [page.url](page.url), and [HANDOFF.md](HANDOFF.md) routes to owner state.
Raw conversations, credentials, client intake and machine placement remain
outside this public repository.
