# Current state — The Great Library of SISO

**Verified:** 2026-09-06

## Project spine and publishing sources

Whole Library V39 selects Project OS `0.4.1+bfa88dc`, Skills Hub
`0.2.0+5e33b2b` (publish skill 0.1.1), and the shared shell `0.1.0+adea886`.
Source commits are public and their archives resolve. Project OS is marked as a
GitHub template; its installer materializes the spine into a project. Creating
from GitHub copies the kit and does not automatically execute that installer.

Project OS adds `.agents/PAGE.md`, `HANDOFF.md`, `repos.json`, `owners.log`,
`page.url` and `intake/`. All 46 tests pass at `bfa88dc3060f59b1372c74699fe7f74a2ef1bb36`,
plus schema/self-check, adoption smokes and a fresh public-tag install. Its
separate published v0.5.0 fleet tag is preserved; v0.4.1 extends canonical main.

Publish is canonical at `5e33b2b1e21dfd54e66d9223ece058e7727c2cf8`, with a
128 MiB aggregate input bound, resolved handoff boundary, exact live HTML readback
and receipt append. The 33-skill Hub suite and two focused boundary tests pass;
the installed capability matches source. The earlier frozen pilot is preserved
in commit `7cf036a`. Shell licensing remains pending as its source declares.

The Library itself now uses the compact spine entry files, routing current state
back here. Registry Event `2026-09-06-project-spine-and-publish-released.json`
records source delivery and the new selection; production readback of V39 is a
separate receipt recorded after the verified site is published.

## Library reading pilot

The root one-pager and `siso-foundry` Work page now use the shared static rail
from `sisodias/siso-shell` at `adea8860b50324f283637a596c5a41367ece9776`.
The root has section counts, the eight-node ecosystem loop and five agent entry
files; Foundry has authored reasoning, a relationship map, source highlights and
source entry commands, alongside the existing evidence and distribution states.
`docs/module-page-template.md` describes the source contract. The pilot originally
shipped on V38; V39 adds the source-release selection described above.
The verification Event is `2026-09-05-library-reading-pilot-verified.json`.
Published source: `7713cd8fa97b657744af5782cdee62c5ac9e92be`.
Deployment: https://77550887.great-library-of-siso.pages.dev/ (5 September 2026).
The deployment and stable alias both returned HTTP 200 and exact local hashes for
the root, Foundry HTML/dossier, reading CSS, shell JS, Research and Repo Estate.
Root SHA-256: `3f733658cd276dc0295dde3372ed118f29f24417bec92051de71fd244a2d76f1`.
Foundry HTML SHA-256: `bfe8ef4be772f57fdbaec944e699bd3fddab891bd5ba4301dc15351f6d5f20e0`.
Both pages were captured at 2000×1250 after deployment. Rail click/keyboard/reload
checks passed; the 390px mobile views have no document-level horizontal overflow.
Existing catalog search still filters correctly. The first guarded verify peaked
at 193478656 bytes; final full verification peaked at 185630720 bytes and publish
at 358678528 bytes, all under a two-billion-byte process-group cutoff.

The new `publish` skill is authored, installed and now published through Skills
Hub. The existing Vercel fallback is retained. Industries, live-agent Now and
SISO Source are separate follow-up work.

**Public repository:** https://github.com/sisodias/great-library-of-siso

**Live Library:** https://great-library-of-siso.pages.dev/ (Cloudflare Pages, ADR-0006; Vercel fallback for one cycle)

**Operating status:** Whole Library V39 is the active immutable Snapshot. The
registry is also the sole identity and lineage control plane for the first
verified laptop-estate baseline; exact machine placement remains private.

## Current immutable baseline

- Whole Library V39 is `gls:snapshot:ad689b84-b650-4344-a4d9-1b77d4c0c6a2`
  (6 September 2026). It preserves every V38 selection except the two explicitly
  replaced Project OS and Skills releases, adds the shared-shell Work/Release,
  and preserves the existing Assembly. This does not change the separately
  pinned Stack Distribution installer.
- The prior Whole Library V38 is
  `gls:snapshot:adfaabc8-ee8f-442c-88ba-64c5879bc623` (5 September 2026). It
  preserves every V37 selection and adds three public MIT Releases under the
  Research section: the UNFUCK whole-project ownership prompt with the God
  Questions and skills (`unfuck-the-project` @ 830b1dc), the SISO Component
  Bank of 8,538 21st.dev components (`siso-component-bank` @ 4aa89af), and the
  SISO Repo Bank exported read-only from the Foundry identity database
  (`siso-repo-bank` @ 2d7d35e). Event
  `2026-09-05-unfuck-source-layer-published.json` records the reasoning.
- The registry contains 37 Work records, 85 Releases, two Assemblies, eight
  Source Inventories, 39 Snapshots, six Decisions, and 43 Events. ADR-0006
  (5 September 2026) moves the public reading surface to Cloudflare Pages;
  Event `2026-09-05-cloudflare-pages-hosting-decided.json` records the move.
- V39 selects 32 exact Releases. A Work or Source Inventory added after its
  selection may be accepted identity or intake without pretending to be a new
  whole-Library Snapshot.
- Existing Releases, Snapshots, Decisions, Source Inventories marked immutable,
  and Events are append-only. Corrections use successor records.

## Sole-registry rule

- Great Library IDs define Work, Release, Source Inventory, Decision, Event,
  Assembly, and Snapshot identity. Local folder names do not.
- The public laptop intake is
  `registry/source-inventories/laptop-estate-2026-08-09.json`.
- Exact local paths live only in ignored
  `.local/private-registry/overlay.json`, joined to resolving Library IDs.
- `npm run audit:laptop` validates the declared physical state and writes a
  redacted deterministic receipt under the ignored local boundary.
- `npm run status:estate` makes no repository mutations and writes a
  deterministic private status projection with repository boundary, commit,
  branch, upstream, remote, dirty-count, and front-door contract facts. It
  reports dirty work without treating it as identity drift and emits no paths.
- No second laptop/workspace identity registry is permitted.

The immutable completion Event preserves the first sixteen-root receipt,
including its temporary implementation worktree. The current ignored overlay
now covers 67 meaningful repositories, containers, data planes, archives,
runtime surfaces, and protected stores with zero drift. An exhaustive prior
scan found 352 Git roots; vendor clones, nested references, ephemeral
worktrees, and runtime tooling are deliberately not promoted into projects.

## Knowledge and data boundaries

- The People Graph is one independently addressable Work and one logical
  assembled answer surface. It uses multiple physical source, identity,
  ingestion, working, recovery, and assembled databases with separate owners.
- Foundry discovers and evaluates sources. It does not silently become
  canonical person, identity, merge, or claim truth.
- SISO Knowledge governs durable corpus, graph, index, and retrieval semantics;
  Evidence Engines transform and adjudicate source-grounded observations.
- Mutable databases, source snapshots, private receipts, credentials, personal
  records, client material, transcript payloads, and machine topology stay
  outside public Git.
- Rights and privacy state travel with observations and derivatives. Unknown or
  restricted state blocks public payload promotion.

## Current placement decisions

- `SISO_People_Graph` is the direct canonical People Graph checkout.
- `siso-stargate-library` is the direct canonical public Stargate research
  checkout at registered revision
  `7f89393c7aff6c1977d29f124d1b194c9dbc40f3`.
- The separate 6.6 GB Black Vault corpus/index data plane is owner-held under
  SISO Research and maps to the declassified-corpus Source Inventory unit
  `blackvault-archive`; it is not the Stargate Work.
- SISO UI Base remains a candidate without a Work ID.
- Local math-bounties material is linked to the accepted SISO Unsolveable
  Mathematics Work but is not asserted equivalent to its selected public
  revision.
- Agency private recovery, raw transcripts, compressed transcript archives,
  Foundry databases, and unique corpus payloads remain protected pending an
  independent backup and restore proof.

## Active initiatives

The generated Ecosystem Intelligence projection is authoritative for active
threads. At this state the long-running public initiatives are:

- SISO Unsolveable Mathematics;
- Remote Viewing Research;
- Declassified Government Records.

The People Graph parallel expansion and laptop-estate canonicalization threads
are closed by successor Events. A branch reservation or start Event is not a
completion claim.

## Project-local agent work

`.agents/tasks/` retains the existing estate-wide engineering task schema and
backlog. `.agents/runs/` and plural `.agents/scratchpads/` add bounded goals,
status, handoffs, artifacts, and resumable agent state without replacing tasks
or the registry. Raw transcripts, browser/auth state, databases, private
topology, and duplicate memory brains do not belong there.

## Verification contract

```bash
npm ci
npm run build:private-overlay
npm run audit:laptop
npm run status:estate
npm run verify
```

`npm run verify` covers immutable history, promotion and research contracts,
laptop-estate and privacy tests, registry validation, generated site/catalog,
local links and identity, and publication safety.

## Resume here

1. Read `AGENTS.md`, this file, ADR-0005, Whole Library V39, and
   `docs/laptop-estate.html`.
2. Read the latest public Event for the initiative you are changing.
3. For machine placement, read the ignored overlay and its latest receipt; do
   not paste either into public docs or prompts.
4. Start implementation from current main, preserve dirty/sole-copy/private
   material, use project-local scratchpads, and finish with a successor Event.
5. Maintain the 67-entry baseline in bounded owner-specific waves; do not
   repeat a laptop-wide archaeology scan merely to answer one path question.

## Known external action

An OpenRouter credential formerly present in reachable Skills Hub history was
removed from published history. Provider-side revocation or rotation remains
the only accepted closure; never copy the old value into a task, issue, log, or
document.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
