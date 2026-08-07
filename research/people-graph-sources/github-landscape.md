# GitHub landscape for People Graph source, identity and provenance work

**Observed:** 2026-08-06  
**Method:** public repository metadata, current default branches, repository READMEs/licenses and latest visible commits.  
**Rule:** adoption means reusing a bounded library/protocol/tool behind People Graph contracts—not importing another project's ontology or making it canonical truth.

## Recommendation

Use a modular stack: **Splink** for probabilistic candidate generation; **OpenRefine's reconciliation protocol** for human review; **dlt** for resumable source transport; **DuckDB** for snapshot profiling and deterministic metrics; **ScanCode Toolkit** for software-rights receipts; **RDFLib** for standards exports; **NetworkX** for algorithmic reference tests. Treat DataHub and OpenMetadata as architecture pattern libraries, not runtimes to transplant.

## Evaluated repositories

| Repository | License | Maintenance evidence | Architecture / scale evidence | Reuse decision | Critical boundary |
| --- | --- | --- | --- | --- | --- |
| [moj-analytical-services/splink](https://github.com/moj-analytical-services/splink) | MIT | [2026-08-06 `e22dacdd`](https://github.com/moj-analytical-services/splink/commit/e22dacdda967988fe701368d5bc21a54eebba0cf) | Probabilistic record linkage and clustering over structured fields; DuckDB/Spark/PostgreSQL backends. Repository documents roughly one million records on a laptop in about a minute and 100M+ on big-data backends. | `adopt_library` — Adopt for candidate generation, feature comparison and calibration experiments. | Never let Splink-generated clusters become canonical entities without explicit People Graph evidence/decision records. |
| [dedupeio/dedupe](https://github.com/dedupeio/dedupe) | MIT | [2025-07-29 `3f61e791`](https://github.com/dedupeio/dedupe/commit/3f61e79102910bd355e920a2df7e44c14c9cb247) | Active-learning fuzzy matching and entity resolution over structured data. Designed for large structured datasets; strongest where reviewers can label candidate pairs. | `pilot_compare` — Evaluate for review-assisted models and uncertain-link triage. | Maintenance appears slower than the most active shortlist; benchmark against Splink and verify current releases before adoption. |
| [OpenRefine/OpenRefine](https://github.com/OpenRefine/OpenRefine) | BSD-3-Clause | [2026-08-05 `02436b3b`](https://github.com/OpenRefine/OpenRefine/commit/02436b3b6ae7737b2eac2039a410414eb48ffb90) | Interactive cleaning, reconciliation and augmentation with an established reconciliation service protocol. Human-in-the-loop desktop/web workflow, not the bulk production matcher. | `adopt_protocol` — Adopt reconciliation API patterns and use OpenRefine as a curator/reviewer client. | Keep reviewer actions as explicit claims/decisions; do not make the GUI a hidden source of canonical truth. |
| [dlt-hub/dlt](https://github.com/dlt-hub/dlt) | Apache-2.0 | [2026-08-05 `2d25092a`](https://github.com/dlt-hub/dlt/commit/2d25092a32715d5fd6868f307e7646a9bdd22575) | Embeddable Python extraction/loading with pagination, schema evolution, merge semantics and pipeline state. Runs from notebooks/functions to warehouse destinations; good fit for bounded source adapters. | `adopt_library` — Adopt selected state/checkpoint/merge primitives or the library itself for pilots. | People Graph still needs its own source manifest, rights/tombstone semantics and pg-observation envelope; dlt is transport, not governance. |
| [datahub-project/datahub](https://github.com/datahub-project/datahub) | Apache-2.0 | [2026-08-06 `217dd983`](https://github.com/datahub-project/datahub/commit/217dd98340e43fb3be10c957a7013bf64920dc79) | Enterprise metadata graph, lineage, ownership, ingestion, search and governance. Large distributed platform with broad enterprise integrations. | `borrow_patterns` — Borrow aspect-versioning, lineage, ownership and metadata-change-event ideas. | Do not adopt wholesale: it would duplicate the Great Library control plane and add heavy operations. |
| [open-metadata/OpenMetadata](https://github.com/open-metadata/OpenMetadata) | Apache-2.0 | [2026-08-06 `729d2900`](https://github.com/open-metadata/OpenMetadata/commit/729d2900733f7e6e4a508351d043587a0e34c2da) | Schema-first metadata/context graph with lineage, contracts, quality, policies, APIs, MCP and 130+ connectors. Large enterprise platform and connector ecosystem. | `borrow_patterns` — Borrow explicit schemas, change events, policies, quality history, lineage and standards mappings. | Do not turn People Graph into a second data catalog or organisational-memory platform. |
| [aboutcode-org/scancode-toolkit](https://github.com/aboutcode-org/scancode-toolkit) | Apache-2.0 | [2026-06-25 `6ba59089`](https://github.com/aboutcode-org/scancode-toolkit/commit/6ba59089789600479cda46c84c6d436774179092) | License, origin, copyright, package and dependency detection with SPDX/CycloneDX outputs. Repository reports more than 30,000 tests and broad production adoption. | `adopt_tool` — Adopt for software-asset license receipts and package provenance before any payload reuse. | License detection supports a rights decision; it is not itself permission to copy or redistribute. |
| [RDFLib/rdflib](https://github.com/RDFLib/rdflib) | BSD-3-Clause | [2026-07-29 `4e4bd6e9`](https://github.com/RDFLib/rdflib/commit/4e4bd6e91bfe42095203c180f2e3d3081685e1cf) | Python RDF parsing, serialization, querying and standards interoperability. Suitable for standards exports, provenance interchange and bounded graph transformations. | `adopt_library` — Adopt for RDF/PROV-O/JSON-LD export and validation adapters where standards interoperability is needed. | Do not make RDFLib the primary persistence or high-scale query engine. |
| [duckdb/duckdb](https://github.com/duckdb/duckdb) | MIT | [2026-08-06 `76dd1e7d`](https://github.com/duckdb/duckdb/commit/76dd1e7d6f89f2a4c92d958b356aca0ec550ec71) | Embedded analytical SQL over Parquet/JSON/CSV and local files. Strong single-node analytics, vectorized execution and reproducible staging without a service. | `adopt_engine` — Adopt for source-snapshot profiling, logical digests, cohort metrics and candidate-generation staging. | Keep canonical storage/interface decisions separate; DuckDB is an analytical plane, not identity authority. |
| [networkx/networkx](https://github.com/networkx/networkx) | BSD-3-Clause | [2026-08-05 `b2085d11`](https://github.com/networkx/networkx/commit/b2085d1107b2842c754cc3e091c6abeece6111fa) | Broad Python graph-algorithm library. Excellent for test fixtures and medium graphs; in-memory object overhead limits whole-corpus use. | `adopt_library` — Adopt for reference algorithms, path/centrality tests and projection validation on samples. | Do not use it as the production graph store or evidence model. |

## Adoption map

### 1. Candidate generation: Splink first, Dedupe as a reviewed comparator

Splink already supplies Fellegi–Sunter-style probabilistic linkage, blocking, term-frequency adjustments and scalable SQL backends. It should output candidate pairs with model/version/features/probability—not clusters promoted to canonical IDs. Dedupe is worth a bounded comparison where reviewers can label ambiguous pairs, but its slower recent commit cadence makes it a second-choice dependency until release health is verified.

**Do not build:** a new fuzzy-matching framework, string-similarity zoo or opaque ML auto-merge service.

### 2. Review and reconciliation: adopt the OpenRefine seam

Expose People Graph candidates through a reconciliation service that can return candidate IDs, scores, literal evidence and review state. OpenRefine can then be a curator client without owning the graph. The accepted/rejected decision and undo lineage remain in People Graph-controlled storage.

**Do not build:** a bespoke spreadsheet-like review UI before validating the reconciliation protocol with real reviewers.

### 3. Source transport and reproducibility: dlt + DuckDB

dlt can handle HTTP pagination, incremental state and merge-oriented loading for bounded adapters. DuckDB can profile large JSON/Parquet snapshots, calculate sorted logical digests and produce pilot metrics locally. Both sit below the source manifest and `pg-observation-0.1` envelope.

**Do not delegate:** rights state, source snapshot identity, payload digest, tombstone policy or canonical identity.

### 4. Rights and software provenance: ScanCode Toolkit

For source/package pilots, ScanCode can produce license/copyright/package evidence and SPDX/CycloneDX outputs. Its output should be attached as a rights receipt; ambiguous results remain pending and block payload promotion.

**Do not infer:** that detected license text grants rights to every file, model, dataset, dependency or trademark.

### 5. Graph/provenance interoperability: RDFLib + NetworkX

RDFLib is appropriate for PROV-O/JSON-LD/RDF exchange with authority and scholarly systems. NetworkX is appropriate for executable small-graph invariants and projection sensitivity tests. Neither should determine the production store.

### 6. Enterprise catalogs: borrow, do not transplant

DataHub and OpenMetadata demonstrate useful patterns—versioned metadata aspects, change events, lineage, ownership, policies, quality history, contracts and connector boundaries. Their full platforms overlap the Great Library's registry/lineage role and would create a second control plane. Document the borrowed pattern and implement only the narrow seam.

## Missing capability that still needs People Graph code

No evaluated repository directly supplies the required invariant: source observations survive independently of reversible identity decisions, while every Work, contribution, assertion and relationship carries observed time, evidence, rights and removal state. That narrow contract—and the adapter from `pg-observation-0.1`—should remain People Graph-owned.

## License and maintenance notes

- Repository software licenses do **not** license source data processed by those tools.
- Latest-commit dates are activity evidence, not a guarantee of project health; release cadence, security posture and dependency risk still need review before pinning.
- Pin exact versions/commits in implementation PRs and run an internal license/SBOM review before vendoring or copying code.
- Prefer library use through published packages over copying implementation unless the license review explicitly approves the copy.

## Evidence links

- [moj-analytical-services/splink repository](https://github.com/moj-analytical-services/splink); [license](https://github.com/moj-analytical-services/splink/blob/master/LICENSE).
- [dedupeio/dedupe repository](https://github.com/dedupeio/dedupe); [license](https://github.com/dedupeio/dedupe/blob/main/LICENSE).
- [OpenRefine/OpenRefine repository](https://github.com/OpenRefine/OpenRefine); [license](https://github.com/OpenRefine/OpenRefine/blob/master/LICENSE.txt).
- [dlt-hub/dlt repository](https://github.com/dlt-hub/dlt); [license](https://github.com/dlt-hub/dlt/blob/devel/LICENSE.txt).
- [datahub-project/datahub repository](https://github.com/datahub-project/datahub); [license](https://github.com/datahub-project/datahub/blob/master/LICENSE).
- [open-metadata/OpenMetadata repository](https://github.com/open-metadata/OpenMetadata); [license](https://github.com/open-metadata/OpenMetadata/blob/main/LICENSE).
- [aboutcode-org/scancode-toolkit repository](https://github.com/aboutcode-org/scancode-toolkit); [license](https://github.com/aboutcode-org/scancode-toolkit/blob/devel/apache-2.0.LICENSE).
- [RDFLib/rdflib repository](https://github.com/RDFLib/rdflib); [license](https://github.com/RDFLib/rdflib/blob/main/LICENSE).
- [duckdb/duckdb repository](https://github.com/duckdb/duckdb); [license](https://github.com/duckdb/duckdb/blob/main/LICENSE).
- [networkx/networkx repository](https://github.com/networkx/networkx); [license](https://github.com/networkx/networkx/blob/main/LICENSE.txt).

The license links above are locators to the repository-declared license files. Implementation owners must re-check them at the exact commit they pin.
