# Contributing to The Great Library of SISO

Contributions should make the registry more accurate, useful, and safely publishable. The source records and schemas are authoritative; generated item pages are not.

## Before you contribute

1. Read [LICENSE-PENDING.md](LICENSE-PENDING.md). This repository does not yet grant a general license for reuse, and accepting a contribution does not silently settle ownership or licensing.
2. Read [SECURITY.md](SECURITY.md). Do not put a secret, private path, client identifier, or sensitive incident detail in an issue, commit, fixture, or screenshot.
3. Classify the source before importing anything: public and permitted, external upstream, private/internal, legacy, or unknown. Stop on private/internal or unknown material until a maintainer can resolve it.
4. Preserve upstream ownership and license evidence. A public URL is a locator, not proof of ownership or permission.

## Ways to help

- Correct factual metadata or broken public locators.
- Add a well-evidenced Work record.
- Record a Release Manifest only when its state and evidence are explicit.
- Add typed relationships supported by the schema and evidence.
- Improve authored research or operating documentation while separating facts, inference, and decisions.
- Add a publication-safe capability candidate to a dated Source Inventory without granting it Work or Release status.
- Improve validation, accessibility, link checking, or publication-safety checks.

## Add or correct a Work

1. Work in `registry/works/`; never hand-edit a generated Work page under `site/`.
2. Use a stable Work ID that does not encode its section, repository, owner, domain, path, category, or current parent.
3. Record repositories and URLs as replaceable locators. Every accepted Work receives a stable Library detail URL from the generated site. Upstream docs/demo URLs are optional.
4. Record external ownership and provenance without implying SISO ownership. In particular, Herdr remains owned by its external upstream.
5. Model hierarchy and composition with the relationship types allowed by the schema. A project may adopt an agent system; projects and agents do not globally contain one another. A module is a contextual role, not an eternal rank.
6. Do not claim that a Work is downloadable, resolvable, installable, forkable, or portable unless a Release Manifest states that condition and points to evidence.
7. Run the full verification gate and include the result in the pull request.

## Releases and snapshots

- Treat accepted Release Manifests as immutable. Correct history with the project-supported successor/correction mechanism rather than rewriting evidence.
- A named whole-Library Snapshot promises complete metadata for its pinned recursive view, not automatic payload availability.
- Payload materialization requires per-artifact state, licensing, provenance, and receipts.
- Never guess a license or redistribution state. `pending` is a valid and safer answer.

## Capability discovery and promotion

Use Source Inventories for reviewed candidate intake. A public campaign records logical source scopes, content-based evidence, classification, ownership targets, portability blockers, and one exact next gate. Raw scans, absolute paths, personal configuration, private receipts, and operational state stay outside the repository.

Discovery must not create a Work automatically. Promote only after direct review establishes a coherent independent boundary, ownership, provenance, rights, and a verification plan. Change the owning repository first; then publish an exact commit, add an immutable Release Manifest, select it in a successor Snapshot, and update the Agent Stack only when installation is appropriate.

Read the [agent capability discovery and promotion program](docs/agent-capability-promotion.html) before advancing a candidate stage.

## Clean-room publication checklist

Before opening a pull request, confirm that:

- every imported source was read and classified first;
- no secret, credential, private client source, personal note, machine-specific path, private topology, or raw operational database is present;
- external ownership and license claims are supported by public evidence;
- metadata does not overclaim distribution or execution capabilities;
- authored records, not generated pages, contain the change; and
- `npm run verify` passes on Node.js 20.

If a check fails because another lane is still landing a required contract, report the exact failure; do not bypass the gate or duplicate the missing registry in documentation.

## Pull requests

Keep changes small and scoped. Explain the user-visible correction, list the records or docs changed, link public evidence, and paste the verification command and verdict. Preserve unrelated work from other contributors.

Security-sensitive findings follow [SECURITY.md](SECURITY.md), not the normal pull-request path.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
