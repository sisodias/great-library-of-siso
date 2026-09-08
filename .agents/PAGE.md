# The Great Library of SISO

The public registry and reading surface for independent SISO research, software,
projects and agent capabilities. Stable Works identify things; Releases preserve
exact evidence; Snapshots select versions; Assemblies describe composition.

Human entry: https://great-library-of-siso.pages.dev/use/
Machine entry: https://great-library-of-siso.pages.dev/llms.txt
Source home: `sisodias/great-library-of-siso`, branch `main`.

Read [delivery and remaining work](../docs/library-delivery.md), then
`node bin/gls tasks`. Inspect one task with `node bin/gls task TASK-NNNN`.
Find source with `node bin/gls search "agent runtime"` and inspect its exact Work.
The owning project retains its private source, execution and acceptance authority.

Verify with Node20: `npm ci` then `npm run verify`. Publication uploads only the
verified `site/` artifact and requires the user's release authority. No registry
entry grants private access, installation or production admission.
