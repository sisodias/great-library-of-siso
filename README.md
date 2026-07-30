# The Great Library of SISO

A public, human-readable and agent-readable registry and learning system for SISO source.

**Live Library:** [great-library-of-siso.vercel.app](https://great-library-of-siso.vercel.app/)

> **Current scope:** The Agents section is the first deep vertical slice. Catalog presence is not a claim that source is downloadable, installable, portable, or licensed for reuse. See [License pending](LICENSE-PENDING.md).

## What the Library is

The Great Library of SISO is a catalog, not a giant monorepo. It gives people and agents a durable way to discover, understand, cite, and connect Works while their repositories, websites, owners, and locations can change.

The core model is deliberately small:

```text
Library
├── Sections                 browse projections
├── Works                    stable identities
├── Assemblies               versioned compositions of Works
└── Source Inventories       evidence-led staging before promotion to a Work

Distribution layers: Releases and Snapshots
Structure: typed relationships stored as data
```

- A **Section** is a browseable projection, not part of a Work's identity.
- A **Work** has a stable ID and a stable, human-readable Library detail URL.
- An **Assembly** keeps the components of a working stack together, records their contextual roles and dependencies, and can evolve by publishing a new immutable version.
- A **Source Inventory** maps valuable but mixed or unclassified material before it is safe to split, publish, archive, or promote into stable Works.
- A **Release** is an immutable manifest for a specific version and its evidenced distribution state.
- A **Snapshot** pins a named recursive view. A whole-Library snapshot is metadata-complete; payload materialization is separate and requires per-artifact receipts.
- A **relationship** is typed data. Directory nesting does not define global ownership, containment, or rank.

Every cataloged Work gets an always-on detail page in the hosted Library, even when its source repository has no website. A Work may also declare an optional upstream documentation or demo URL. This provides one public reading surface without requiring a separate deployment for every repository.

Read the [registry model](docs/registry-model.md) for the identity and distribution boundaries.

New humans and agents should follow the [cold-start onboarding map](docs/onboarding.html) and the root [agent guide](AGENTS.md).

## First deep section: Agents

The first slice began with carefully reviewed seed records centered on:

- SISO Project OS
- SISO Agent Base
- Herdr
- Agent Zero

Those four Works are now connected through the source-backed **SISO Agent Stack 1.0.0** Assembly. Project OS, Agent Base, Herdr, and Agent Zero remain independently addressable Works; the Assembly records how they operate together. Skills are reusable capabilities, while playbooks compose skills, tools, lanes, and verification for a scenario. They are not separate top-level shelves.

Read the [SISO Agent Stack model](docs/agent-stack-model.html) for the corrected hierarchy and placement rules.

Inclusion means the Library describes the Work. It does not by itself promise a payload, installer, support relationship, or redistribution right. Herdr is an external upstream and must not be represented as SISO-owned. See the [verified V1 locator notes](docs/agents-v1.md).

## Research and Knowledge

Research is a separate browse section with independently addressable responsibilities: **SISO Knowledge** owns durable corpus and retrieval; **SISO Foundry** owns source discovery and reuse intelligence; **SISO Evidence Engines** own source-grounded transformation. Their repositories may be checked out together locally, but physical nesting does not imply containment.

Read the [SISO Knowledge model](docs/siso-knowledge-model.html) for the source-backed boundary, current migration state, data-plane rules, and repository split test.

## What you can do

- **Browse** Sections and stable Work detail pages.
- **Add** a Work through a schema-valid, provenance-aware contribution.
- **Compose** a contextual view from typed relationships without redefining identity.
- **Research** decisions, evidence, releases, and related Works.
- **Cite** a stable Work ID and, when relevant, a Release or Snapshot.
- **Correct** the source record instead of patching generated pages.
- **Contribute** clean public metadata, evidence, documentation, and tooling.

[Using the Library](docs/using-the-library.md) explains Work, Section, Release, and whole-snapshot retrieval.

## Repository map

| Path | Role |
| --- | --- |
| `registry/works/` | Current Work records |
| `registry/releases/` | Immutable Release Manifests |
| `registry/snapshots/` | Named pinned views |
| `registry/assemblies/` | Immutable versioned compositions of Works |
| `registry/source-inventories/` | Preservation-aware maps of mixed source awaiting promotion or reallocation |
| `schemas/` | Machine-readable contracts |
| `docs/` | Authored model, operating, and learning documentation |
| `site/` | Generated Pages artifact; do not hand-edit generated item pages |
| `scripts/` | Dependency-light validation and generation tooling |

The website, future CLI, and future MCP server must read these same contracts. There is no parallel hand-written registry.

## Verify locally

Use Node.js 20. The V1 gate validates records and schemas, builds `site/`, checks internal links, and scans the publication artifact for obvious secrets:

```bash
npm ci
npm run verify
```

Vercel is the primary static host and deploys only the generated `site/` directory. GitHub Pages remains an optional mirror. Neither host changes the registry identity or source-of-truth contracts.

```bash
npm run deploy:vercel
```

## Contributing and safety

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Never contribute credentials, private client source, personal notes, machine-specific paths, private topology, or raw operational databases. Report sensitive findings through [SECURITY.md](SECURITY.md), not a public issue.

No license has been selected for this repository. Public visibility is not general reuse permission; read [LICENSE-PENDING.md](LICENSE-PENDING.md) before copying or distributing repository material. External upstreams retain their ownership and licenses.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
