# V1 roadmap

The roadmap stays deliberately narrow: a static, dependency-light public registry first, followed by read-oriented access to the same data.

## V1

- Validate schemas, Work records, Release Manifests, Snapshots, and relationship references.
- Generate one stable hosted detail URL for every accepted Work.
- Generate human-readable pages and machine-readable catalog data from the same records.
- Build, check links, and scan the public artifact for obvious secrets with one verification command.
- Deploy `site/` to Vercel as the primary public surface, with GitHub Pages available as an optional mirror.
- Publish the first six reviewed Agents seed records/pages rather than a broad speculative catalog.

## Near roadmap: CLI and MCP

The initial CLI and MCP surfaces should be close to read-only. They will list and inspect Sections and Works, traverse typed relationships, and retrieve Work, Release, and Snapshot metadata from the same registry contracts used by the site.

Writes remain reviewable repository changes guarded by schema validation and publication checks. The first MCP surface is not a remote registry administration API, installer, or package manager.

## Active program: agent capability discovery and promotion

The Library now accepts publication-safe, multi-source agent capability campaigns through Source Inventories and generates a human and machine-readable promotion queue. [The operating program](agent-capability-promotion.html) defines the ten-loop discovery process, ownership boundary, lifecycle, privacy rules, verification gates, and Stack handoff.

The next engineering milestone is a Foundry candidate exporter that writes only ignored local staging data. Reviewed metadata may then be proposed as a successor Source Inventory; discovery must never create Works, Releases, Assemblies, or Snapshots automatically.

## Explicitly out of scope

- combining all cataloged source into a giant monorepo;
- requiring a separate website or deployment for every repository;
- inferring ownership or hierarchy from directories and URLs;
- mirroring private or unclassified legacy material;
- promising payload fetching without release evidence and receipts; or
- selecting a license by implication.

Claims on the public site must follow implemented records and manifests, not roadmap intent.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
