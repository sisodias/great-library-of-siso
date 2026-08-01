# Agent guide — The Great Library of SISO

This repository is the public registry, learning record, and generated reading surface for The Great Library of SISO. GitHub records public truth; a laptop checkout is replaceable infrastructure.

## Cold start

Read these in order:

1. `README.md` — the identity and registry model.
2. `CURRENT_STATE.md` — the latest verified operating state and resume points.
3. The highest-numbered `registry/snapshots/whole-library-v*.json` — the active named view.
4. `site/intelligence.json` — active initiatives, recent events, ADRs, reservations, and automatic Release/Snapshot history.
5. `docs/onboarding.html` — the human and agent operating map.
6. `CONTRIBUTING.md` and `SECURITY.md` before changing or importing source.

Then run `npm ci && npm run verify`. A cold agent is oriented when it can name the latest Snapshot, explain Work versus Release versus Assembly, and locate the source record behind a generated page.

## Sources of truth

| Question | Read or change |
| --- | --- |
| What is a thing? | `registry/works/` |
| What exact version was evidenced? | `registry/releases/` |
| What is selected now? | latest immutable record in `registry/snapshots/` |
| How do Works operate together? | `registry/assemblies/` |
| Where is mixed source awaiting a decision? | `registry/source-inventories/` |
| What is active, what changed, and who owns the lane? | `registry/events/` and generated `site/intelligence.json` |
| Why was a boundary chosen? | `registry/decisions/`, `docs/`, and evidence linked from records |
| What does the public site show? | generated `site/`; never hand-edit generated Work pages |

The registry data is authoritative. The website, future CLI, and future MCP server are projections over the same contracts—not parallel catalogs.

## Local checkout contract

The preferred machine-neutral checkout is `$SISO_WORKSPACE/Great_Library_of_SISO`. If `.local/LOCATION.md` exists, it records the exact checkout for that machine. Never publish machine-specific paths.

Related source repositories may be checked out anywhere. Their identity comes from stable Work IDs and exact public Release locators, not local directory nesting.

## Change sequence

1. Read `site/intelligence.json`. Before parallel work, publish an `initiative_started` Event with branch and reserved paths.
2. Read and classify source; stop on private, client, credential-bearing, or unclear material.
3. Change the owning source repository and verify it there.
4. Publish an exact source commit.
5. Add a new immutable Release Manifest; never rewrite an accepted Release.
6. Add a new immutable Snapshot that replaces the selected release while preserving the rest of the view.
7. Close the Event thread with exact evidence and next actions.
8. Run `npm run verify`, commit, push, and run `npm run deploy:vercel`.
9. Record receipts in `CURRENT_STATE.md` when the operating state materially changes.

Use one active maintainer by default. Parallel Library lanes are permitted only when Shaan initiates them and every lane has a non-overlapping reservation Event visible on canonical `main`. Never publish machine-specific worktree paths.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
