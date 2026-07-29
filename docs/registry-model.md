# Registry model

The Great Library of SISO separates durable identity, browse structure, and distribution evidence. This allows the catalog to survive repository moves, category changes, reorganizations, and new publication methods.

## Library, Sections, Works, and Assemblies

The **Library** is the complete catalog. A **Section** is a named, versioned projection used for browsing. A **Work** is the stable identity for one cataloged subject.

A Work ID never encodes a category, repository, owner, path, domain, or current parent. Those properties can change without changing the Work. Moving a Work between Sections changes a projection, not its identity.

An **Assembly** is an immutable, versioned composition of Works that operate together for a named outcome. It records contextual component roles, dependencies, an operating loop, and composition semantics. A changed stack creates a new Assembly version; it does not rewrite a Work's identity or turn a current role into a universal category.

The Agents section therefore presents the SISO Agent Stack as one Assembly containing Project OS, Agent Base, Herdr, and Agent Zero. “Optional to Project OS when Project OS runs alone” and “required by this named SISO Agent Stack” are compatible statements at different scopes.

Each accepted Work is generated to one stable, human-readable detail URL on the hosted Library site. That Library page exists independently of whether the source repository operates a website or which static provider serves the Library. A Work can also declare an optional upstream docs or demo URL; upstream URLs remain replaceable locators and never replace the Library identity.

## Relationships are data

Typed relationships express how Works are understood or composed. Use only relationship types allowed by the schema. Do not infer global containment from directories, repository ownership, or a current page hierarchy.

A project may adopt an agent system. That does not mean projects contain agents, or agents contain projects, everywhere. Likewise, “module” describes a role inside a particular composition rather than an eternal object rank.

## Releases

A Release Manifest is the immutable evidence boundary for a particular version. It records what is known about location, provenance, license, redistribution, and materialization. Catalog presence alone must not be translated into claims such as downloadable, resolvable, installable, forkable, or portable.

Those capabilities are true only when the relevant release state says so and supplies evidence. An upstream repository's existence or license metadata is useful provenance, but it is not a substitute for the Library's per-release state.

## Snapshots

A Snapshot pins a named recursive view of the registry. “Whole Library” means a metadata-complete named Snapshot: all records required by that pinned view are represented.

It does not mean that every source payload has been copied or can be fetched. Payload materialization is a separate operation and needs a receipt for every artifact, including its outcome and applicable rights.

## Source-of-truth flow

```text
schemas + accepted registry records
                │
                ├── generated HTML detail pages
                ├── generated machine-readable catalog
                ├── future read-oriented CLI
                └── future read-oriented MCP server
```

All publication and access surfaces derive from the same contracts. Generated item pages must not be edited by hand.

---

The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.
