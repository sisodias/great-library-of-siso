# The Great Library of SISO

A public, human-readable and agent-readable registry and learning system for SISO source.

> **V1 status:** The Agents section is the first vertical slice. Catalog presence is not a claim that source is downloadable, installable, portable, or licensed for reuse. See [License pending](LICENSE-PENDING.md).

## What the Library is

The Great Library of SISO is a catalog, not a giant monorepo. It gives people and agents a durable way to discover, understand, cite, and connect Works while their repositories, websites, owners, and locations can change.

The core model is deliberately small:

```text
Library
└── Sections
    └── Works

Distribution layers: Releases and Snapshots
Structure: typed relationships stored as data
```

- A **Section** is a browseable projection, not part of a Work's identity.
- A **Work** has a stable ID and a stable, human-readable Library detail URL.
- A **Release** is an immutable manifest for a specific version and its evidenced distribution state.
- A **Snapshot** pins a named recursive view. A whole-Library snapshot is metadata-complete; payload materialization is separate and requires per-artifact receipts.
- A **relationship** is typed data. Directory nesting does not define global ownership, containment, or rank.

Every cataloged Work gets an always-on detail page in the Library's GitHub Pages site, even when its source repository has no website. A Work may also declare an optional upstream documentation or demo URL. This provides one public reading surface without requiring a separate deployment for every repository.

Read the [registry model](docs/registry-model.md) for the identity and distribution boundaries.

## First section: Agents

V1 begins with six carefully reviewed seed records/pages, centered on:

- SISO Project OS
- SISO Agent Base
- Herdr
- the Agent Zero coordination playbook

Inclusion means the Library describes the Work. It does not by itself promise a payload, installer, support relationship, or redistribution right. Herdr is an external upstream and must not be represented as SISO-owned. See the [verified V1 locator notes](docs/agents-v1.md).

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

The Pages workflow runs the same gate and deploys only the generated `site/` directory. GitHub Pages gives the public repository an always-on site without a paid backend.

## Contributing and safety

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Never contribute credentials, private client source, personal notes, machine-specific paths, private topology, or raw operational databases. Report sensitive findings through [SECURITY.md](SECURITY.md), not a public issue.

No license has been selected for this repository. Public visibility is not general reuse permission; read [LICENSE-PENDING.md](LICENSE-PENDING.md) before copying or distributing repository material. External upstreams retain their ownership and licenses.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
