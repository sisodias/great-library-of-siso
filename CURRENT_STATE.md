# Current state — The Great Library of SISO

**Verified:** 2026-09-05

## Library reading pilot

The root one-pager and `siso-foundry` Work page now use the shared static rail
from `sisodias/siso-shell` at `adea8860b50324f283637a596c5a41367ece9776`.
The root has section counts, the eight-node ecosystem loop and five agent entry
files; Foundry has authored reasoning, a relationship map, source highlights and
source entry commands, alongside the existing evidence and distribution states.
`docs/module-page-template.md` describes the source contract. V38 is unchanged.
The verification Event is `2026-09-05-library-reading-pilot-verified.json`.
Production readback and screenshots are recorded separately after publication;
this paragraph alone is not a deployment receipt. The first guarded verify passed
at 193478656 bytes peak under a two-billion-byte process-group cutoff.

The new `publish` skill is authored and installed through Skills Hub. Its source
is frozen for coordinated Hub integration, not yet claimed as a published Hub
commit. The existing Vercel fallback is retained. Industries, live-agent Now,
SISO Source and Project OS template expansion are not completed by this pilot.

**Public repository:** https://github.com/sisodias/great-library-of-siso

**Live Library:** https://great-library-of-siso.pages.dev/ (Cloudflare Pages, ADR-0006; Vercel fallback for one cycle)

**Operating status:** Whole Library V38 is the active immutable Snapshot. The
registry is also the sole identity and lineage control plane for the first
verified laptop-estate baseline; exact machine placement remains private.

## Current immutable baseline

- Whole Library V38 is
  `gls:snapshot:adfaabc8-ee8f-442c-88ba-64c5879bc623` (5 September 2026). It
  preserves every V37 selection and adds three public MIT Releases under the
  Research section: the UNFUCK whole-project ownership prompt with the God
  Questions and skills (`unfuck-the-project` @ 830b1dc), the SISO Component
  Bank of 8,538 21st.dev components (`siso-component-bank` @ 4aa89af), and the
  SISO Repo Bank exported read-only from the Foundry identity database
  (`siso-repo-bank` @ 2d7d35e). Event
  `2026-09-05-unfuck-source-layer-published.json` records the reasoning.
- The registry contains 36 Work records, 82 Releases, two Assemblies, eight
  Source Inventories, 38 Snapshots, six Decisions, and 41 Events. ADR-0006
  (5 September 2026) moves the public reading surface to Cloudflare Pages;
  Event `2026-09-05-cloudflare-pages-hosting-decided.json` records the move.
- V38 selects 31 exact Releases. A Work or Source Inventory added after its
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

1. Read `AGENTS.md`, this file, ADR-0005, Whole Library V38, and
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
