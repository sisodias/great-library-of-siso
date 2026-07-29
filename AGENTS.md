# The Great Library of SISO

## Mission

Build the public, human-readable and agent-readable registry for SISO source. The first vertical slice is the Agents section: Project OS, Agent Base, Herdr, and the Agent Zero coordination playbook.

## Source of truth

- `registry/works/` owns current Work records.
- `registry/releases/` owns immutable Release Manifests.
- `registry/snapshots/` pins named recursive views.
- `schemas/` defines the machine contracts.
- `site/` is generated output. Do not hand-edit generated item pages.
- `docs/` holds authored reasoning, decisions, research, contribution guidance, and operating documentation.

## Non-negotiable boundaries

- Stable Work IDs never encode category, repository, owner, path, domain, or current parent.
- Repositories and URLs are replaceable locators, not identities.
- Hierarchies are versioned projections over typed relationships.
- A project adopts agent systems; projects and agents do not contain one another globally.
- A module is a contextual role inside a composition, not an eternal object rank.
- Do not claim an item is downloadable, resolvable, installable, forkable, or portable without an explicit per-release state and evidence.
- “Whole Library” means a metadata-complete named snapshot. Payload materialization is a separate operation with per-artifact receipts.

## Public-safety gate

- Never copy secrets, credentials, private client source, personal notes, machine-specific paths, private topology, or raw operational databases.
- Never import source from the legacy Great Library without reading and classifying it first.
- External upstreams keep their original ownership and license. Record provenance; do not imply SISO ownership.
- License and redistribution state must be explicit. `pending` is safer than guessing.
- All publication surfaces derive from accepted manifests; do not maintain parallel hand-written registries.

## Implementation constraints

- Keep V1 static and dependency-light: Node.js scripts plus generated HTML/CSS/JSON.
- GitHub Pages is the first host. No paid backend is required.
- CLI and MCP surfaces must read the same registry contracts as the website.
- Preserve unrelated work. Multiple agents may edit distinct owned paths concurrently; do not revert another agent's changes.

## Staffing

- The default operating model is one active maintainer agent: the primary Library owner/integrator.
- The existing bootstrap workers may complete their current bounded assignments once and are then retired.
- Do not restart, reuse, replace, or spawn parallel workers for this project unless Shaan explicitly changes this rule.

## Verification

Before handoff, run the closest available checks and report exact evidence. V1 should provide one command that validates schemas/records, builds the site, checks links, and scans the publication artifact for obvious secrets.

## Public identity

Use **The Great Library of SISO** as the project name. The small footer line is: **Built by the SISO Open Source Foundation · Funded by SISO Agency.** Do not call it “SISO Open” or “a SISO Open project.”
