# Current state — The Great Library of SISO

**Verified:** 2026-07-30  
**Public repository:** https://github.com/Lordsisodia/great-library-of-siso  
**Live Library:** https://great-library-of-siso.vercel.app/  
**Operating status:** stable wrap-up point; safe for a cold agent to resume.

## What is live

- The public registry, generated site, repository estate, and machine-readable catalog are deployed.
- Fifteen stable Works span the Library, Agents, Research, and one preserved source inventory.
- The Agents story separates Project OS, Runtime, coordination, integrations, Skills, Playbooks, Agent Brain, and Session Intelligence using typed relationships rather than directory hierarchy.
- The machine-neutral local convention groups those eight independent checkouts flat at `$SISO_WORKSPACE/SISO_Agents`; this placement changes no Work, Release, Snapshot, locator, or public URL.
- SISO Agent Brain `0.3.0` is pinned to `ed50bec86f5cfb86cc5c84ebfce97fad595598b4`.
- SISO Skills Hub `0.2.0` is pinned to `d82cd4468fc5f6017a0d8d9d3827bae441fd11db`.
- Whole Library V17 — Durable Onboarding (`gls:snapshot:0f6eb0cf-0828-4cbb-9eef-110fd189d0c0`) is the wrap-up Snapshot.
- The Library's selected self-release is `0.2.0+468fb41`, pinned to `468fb41a2f59504ff3335f810f8a63061455852b`.
- The latest active state is always the highest-numbered immutable whole-Library Snapshot. Do not infer “current” from filename order alone; compare numeric `version` fields.

## Operating boundaries

- GitHub and immutable registry records define public identity; local folders do not.
- The machine-neutral checkout convention is now `$SISO_WORKSPACE/Great_Library_of_SISO`; the former nested Knowledge/Library checkout is retired. This placement change does not alter any Work ID, Release, Snapshot, or public URL.
- `site/` is generated. Edit registry records, authored docs, or the generator.
- Private client projects, credentials, personal notes, machine paths, raw operational databases, and private topology do not enter this repository.
- Catalog presence does not imply download, install, fork, portability, ownership, or redistribution rights. Those claims require a Release Manifest and evidence.
- Herdr remains an external upstream. The retired Agent Base warehouse remains an extraction source, not an active framework claim.
- Foundry and Evidence Engines are filed as Research Works under the local Knowledge domain; the temporary `SISO_Library_Repos` holding folder is retired.

## Verification contract

```bash
npm ci
npm run verify
```

The gate validates schemas and records, generates the public site and catalog, checks local links and attribution, and scans the publication for obvious credentials and machine-local paths.

## Resume here

1. Read `AGENTS.md`, then the latest whole-Library Snapshot.
2. Use `site/estate.json` to see which public repositories have released source, linked homes, or staging homes.
3. Continue only from evidenced source inventories or a named Work; do not bulk-import the old Agent Base.
4. When adding a module, keep the Work independently addressable and put its contextual role in an Assembly or Snapshot relationship.

## Known external action

An OpenRouter credential formerly present in reachable Skills Hub history was removed from published history. Provider-side revocation or rotation remains the only accepted closure; never copy the old value into a task, issue, log, or document.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
