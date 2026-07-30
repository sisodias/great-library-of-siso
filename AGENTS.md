# Agent guide — The Great Library of SISO

This repository is the public registry, learning record, and generated reading surface for The Great Library of SISO. GitHub records public truth; a laptop checkout is replaceable infrastructure.

## Cold start

Read these in order:

1. `README.md` — the identity and registry model.
2. `CURRENT_STATE.md` — the latest verified operating state and resume points.
3. The highest-numbered `registry/snapshots/whole-library-v*.json` — the active named view.
4. `docs/onboarding.html` — the human and agent operating map.
5. `CONTRIBUTING.md` and `SECURITY.md` before changing or importing source.

Then run `npm ci && npm run verify`. A cold agent is oriented when it can name the latest Snapshot, explain Work versus Release versus Assembly, and locate the source record behind a generated page.

## Sources of truth

| Question | Read or change |
| --- | --- |
| What is a thing? | `registry/works/` |
| What exact version was evidenced? | `registry/releases/` |
| What is selected now? | latest immutable record in `registry/snapshots/` |
| How do Works operate together? | `registry/assemblies/` |
| Where is mixed source awaiting a decision? | `registry/source-inventories/` |
| Why was a boundary chosen? | `docs/` and evidence linked from records |
| What does the public site show? | generated `site/`; never hand-edit generated Work pages |

The registry data is authoritative. The website, future CLI, and future MCP server are projections over the same contracts—not parallel catalogs.

## Local checkout contract

The preferred machine-neutral checkout is `$SISO_WORKSPACE/SISO_Library/Great_Library_of_SISO`. If `.local/LOCATION.md` exists, it records the exact checkout and compatibility paths for that machine. Never publish those machine-specific paths.

Related source repositories may be checked out anywhere. Their identity comes from stable Work IDs and exact public Release locators, not local directory nesting.

## Change sequence

1. Read and classify source; stop on private, client, credential-bearing, or unclear material.
2. Change the owning source repository and verify it there.
3. Publish an exact source commit.
4. Add a new immutable Release Manifest; never rewrite an accepted Release.
5. Add a new immutable Snapshot that replaces the selected release while preserving the rest of the view.
6. Run `npm run verify`, commit, push, and run `npm run deploy:vercel`.
7. Record receipts in `CURRENT_STATE.md` when the operating state materially changes.

Use one active maintainer for Library work unless Shaan explicitly changes the staffing model. Do not spawn subagents by default.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
