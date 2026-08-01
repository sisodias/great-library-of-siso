# Current state — The Great Library of SISO

**Verified:** 2026-08-01
**Public repository:** https://github.com/Lordsisodia/great-library-of-siso  
**Live Library:** https://great-library-of-siso.vercel.app/  
**Operating status:** stable wrap-up point; safe for a cold agent to resume.

## What is live

- The public registry, generated site, repository estate, and machine-readable catalog are deployed.
- Eighteen stable Works span the Library, Agents, and Research, with two preservation-aware source inventories.
- The Agents story separates Project OS, Runtime, coordination, integrations, Skills, Playbooks, Agent Brain, and Session Intelligence using typed relationships rather than directory hierarchy.
- The machine-neutral local convention groups ten independent checkouts flat at `$SISO_WORKSPACE/SISO_Agents`; this placement changes no Work, Release, Snapshot, locator, or public URL.
- SISO Agent Brain `0.3.0` is pinned to `ed50bec86f5cfb86cc5c84ebfce97fad595598b4`.
- SISO Skills Hub `0.2.0` is pinned to `d82cd4468fc5f6017a0d8d9d3827bae441fd11db`.
- SISO Knowledge is an active Research Work whose architecture baseline began at `0a433ce385ae2a2be30a86343b5b494a52728d5e` and whose selected public source, including its generated repository header, is `333447afc7672ff622a5f92f96533662585bdb1f`; its dirty local corpus and nested products are preserved but are not falsely claimed as released.
- Research now separates three independently addressable responsibilities: SISO Knowledge for durable corpus and retrieval, Foundry for source discovery and reuse intelligence, and Evidence Engines for source-grounded transformation.
- The Great Library, SISO Knowledge, Foundry, and Evidence Engines now share one generated repository-header visual family while retaining distinct repository identities and responsibilities.
- SISO Agent Hooks is released at `9125a972b4ba03661bf17ee135790282f246c15f` after 21 tests and a 97/100 adversarial review.
- SISO Agent Stack Distribution is released at `f4a9626c0a1771cd3ee449f25a1ab63c8b297845` after public-source and full non-external clean installs plus a 98/100 adversarial review.
- Immutable SISO Agent Stack Assembly 2.0.0 expands the composition to the complete portable public stack without rewriting V1.
- Whole Library V22 — Portable Agent Stack (`gls:snapshot:95cec3fe-9c7a-4135-9eb6-02fdecc3696d`) is the wrap-up Snapshot.
- The Library's selected self-release is `0.3.1+2bd415d`, pinned to `2bd415dd3024c928fc8414b891e7f21069c3fcaa`.
- The latest active state is always the highest-numbered immutable whole-Library Snapshot. Do not infer “current” from filename order alone; compare numeric `version` fields.

## Operating boundaries

- GitHub and immutable registry records define public identity; local folders do not.
- The machine-neutral checkout convention is now `$SISO_WORKSPACE/Great_Library_of_SISO`; the former nested Knowledge/Library checkout is retired. This placement change does not alter any Work ID, Release, Snapshot, or public URL.
- `site/` is generated. Edit registry records, authored docs, or the generator.
- Private client projects, credentials, personal notes, machine paths, raw operational databases, and private topology do not enter this repository.
- Catalog presence does not imply download, install, fork, portability, ownership, or redistribution rights. Those claims require a Release Manifest and evidence.
- Herdr remains an external upstream. The retired Agent Base warehouse remains an extraction source, not an active framework claim.
- SISO Knowledge, Foundry, and Evidence Engines are independent Research Works. A local checkout may group them, but folder placement does not create containment or alter public identity.
- The former `SISO_Library` compatibility name is retired. The public knowledge-production repository is `Lordsisodia/siso-knowledge`; the Great Library remains the separate registry and front door.

## Verification contract

```bash
npm ci
npm run verify
```

The gate validates schemas and records, generates the public site and catalog, checks local links and attribution, and scans the publication for obvious credentials and machine-local paths.

## Resume here

1. Read `AGENTS.md`, then the latest whole-Library Snapshot.
2. Use `site/estate.json` to see which public repositories have released source, linked homes, or staging homes.
3. Continue only from evidenced source inventories or a named Work; do not bulk-import the old Agent Base or the dirty local Knowledge data plane.
4. When adding a module, keep the Work independently addressable and put its contextual role in an Assembly or Snapshot relationship.

## Known external action

An OpenRouter credential formerly present in reachable Skills Hub history was removed from published history. Provider-side revocation or rotation remains the only accepted closure; never copy the old value into a task, issue, log, or document.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
