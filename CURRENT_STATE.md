# Current state — The Great Library of SISO

**Verified:** 2026-08-09

**Public repository:** https://github.com/sisodias/great-library-of-siso

**Live Library:** https://great-library-of-siso.vercel.app/

**Operating status:** Whole Library V37 is the active immutable Snapshot. The
registry is also the sole identity and lineage control plane for the first
verified laptop-estate baseline; exact machine placement remains private.

## Current immutable baseline

- Whole Library V37 is
  `gls:snapshot:29c1b8ef-d173-4a18-b15b-291412d43fc9`.
- The registry contains 32 Work records, 79 Releases, two Assemblies, eight
  Source Inventories, 37 Snapshots, five Decisions, and 35 Events.
- V37 selects 28 exact Releases. A Work or Source Inventory added after its
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
- No second laptop/workspace identity registry is permitted.

The first baseline covers sixteen high-value roots with zero drift. This is a
verified starting set, not a claim that every nested repository is already
declared.

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
npm run verify
```

`npm run verify` covers immutable history, promotion and research contracts,
laptop-estate and privacy tests, registry validation, generated site/catalog,
local links and identity, and publication safety.

## Resume here

1. Read `AGENTS.md`, this file, ADR-0005, Whole Library V37, and
   `docs/laptop-estate.html`.
2. Read the latest public Event for the initiative you are changing.
3. For machine placement, read the ignored overlay and its latest receipt; do
   not paste either into public docs or prompts.
4. Start implementation from current main, preserve dirty/sole-copy/private
   material, use project-local scratchpads, and finish with a successor Event.
5. Expand the laptop baseline in bounded owner-specific waves; do not repeat a
   laptop-wide archaeology scan merely to answer one path question.

## Known external action

An OpenRouter credential formerly present in reachable Skills Hub history was
removed from published history. Provider-side revocation or rotation remains
the only accepted closure; never copy the old value into a task, issue, log, or
document.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
