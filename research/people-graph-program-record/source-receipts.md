# Source receipts

**Observed:** 2026-08-06T23:03:01+07:00

This ledger records the sources actually used to reconstruct the architecture, trace code paths, verify current GitHub activity and review external source options. Machine-readable details are in [`source-receipts.json`](source-receipts.json).

## Repository and draft-PR receipts

| ID | Kind | Source | Revision | Used for |
| --- | --- | --- | --- | --- |
| `SRC-GLS-MAIN` | repository_baseline | [Great Library main baseline](https://github.com/sisodias/great-library-of-siso/commit/12f4cc249b2b5dc268d05d1698fe9c5e3079327d) | `12f4cc249b2b5dc268d05d1698fe9c5e3079327d` | Registry model, operating boundary, active snapshot lineage and program context. |
| `SRC-PG-MAIN` | repository_baseline | [People Graph main baseline](https://github.com/sisodias/siso-people-graph/commit/de048bb3b34bf931b56fd741cb46c1334acdfb98) | `de048bb3b34bf931b56fd741cb46c1334acdfb98` | Schema, loaders, query surface, counts, design decisions and documented limitations. |
| `SRC-BOOKS-MAIN` | repository_baseline | [Book Library main baseline](https://github.com/sisodias/siso-book-library/commit/be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b) | `be9ab0831b9ea8802d6898f3a3dfa8a61c63e80b` | Book index, people export, locator and payload documentation. |
| `PG-README` | repository_file | [sisodias/siso-people-graph:README.md](https://github.com/sisodias/siso-people-graph/blob/main/README.md) | `3ae7738eed163cabb72ed5ea4d57d38453ec40f1` | Mission, counts, design claims and cross-domain limitation. |
| `PG-SCHEMA-V2` | repository_file | [sisodias/siso-people-graph:schema/people_schema_v2.sql](https://github.com/sisodias/siso-people-graph/blob/main/schema/people_schema_v2.sql) | `07b70a2eaf8db48d741010d2d5f31810a0c9d0d1` | V2 entity, edge, identity-claim, topic, search and view contracts. |
| `PG-ASK` | repository_file | [sisodias/siso-people-graph:loaders/ask.py](https://github.com/sisodias/siso-people-graph/blob/main/loaders/ask.py) | `37e19c92d242bc979eb2ab55b4f6f6a02872083d` | Current read-only query behavior. |
| `PG-BUILD-BOOKS` | repository_file | [sisodias/siso-people-graph:loaders/build_people_graph_books.py](https://github.com/sisodias/siso-people-graph/blob/main/loaders/build_people_graph_books.py) | `08b667b448c3acbc4bc0357f378270d46892e071` | Book author parsing and source graph build. |
| `PG-BUILD-V2` | repository_file | [sisodias/siso-people-graph:loaders/build_people_graph_v2.py](https://github.com/sisodias/siso-people-graph/blob/main/loaders/build_people_graph_v2.py) | `7983db530d242b386fcd3c8277718010b7a43034` | V2 rebuild and name-based stitching. |
| `PG-ENRICH` | repository_file | [sisodias/siso-people-graph:loaders/enrich_owners.py](https://github.com/sisodias/siso-people-graph/blob/main/loaders/enrich_owners.py) | `9ea6956f30a06115b8c5946be02ef2dfffb7208b` | GitHub profile enrichment and attribute storage. |
| `PG-OWNER-TOPICS` | repository_file | [sisodias/siso-people-graph:loaders/load_owner_topics.py](https://github.com/sisodias/siso-people-graph/blob/main/loaders/load_owner_topics.py) | `f33d0cfc459330fd97fb69865c7cb7da33468e57` | GitHub topic/value rollup. |
| `PG-OWNERS` | repository_file | [sisodias/siso-people-graph:loaders/load_owners_into_people_graph.py](https://github.com/sisodias/siso-people-graph/blob/main/loaders/load_owners_into_people_graph.py) | `726742a7e7dcfe8c0f76107daef0c147f9e42e34` | Repository-owner import and initial scoring. |
| `PG-MATCH` | repository_file | [sisodias/siso-people-graph:loaders/match_identities.py](https://github.com/sisodias/siso-people-graph/blob/main/loaders/match_identities.py) | `541c68e7083e54327141aaed37f004579b024c4c` | Identity candidate generation and acceptance status. |
| `BOOKS-README` | repository_file | [sisodias/siso-book-library:README.md](https://github.com/sisodias/siso-book-library/blob/main/README.md) | `d72203f0776d6b012081a02c3b4900c25f5fbfa3` | Index/payload claims and rights boundary. |
| `BOOKS-BUILD` | repository_file | [sisodias/siso-book-library:scripts/build_books_module.py](https://github.com/sisodias/siso-book-library/blob/main/scripts/build_books_module.py) | `d912a3c74aad53fcf9a14c0dfa546ffd8a168d27` | Catalog schema and source loading semantics. |
| `BOOKS-PEOPLE` | repository_file | [sisodias/siso-book-library:scripts/build_people_graph.py](https://github.com/sisodias/siso-book-library/blob/main/scripts/build_people_graph.py) | `08b667b448c3acbc4bc0357f378270d46892e071` | Contributor parsing and roles. |
| `BOOKS-EXPORT` | repository_file | [sisodias/siso-book-library:scripts/load_into_people_graph.py](https://github.com/sisodias/siso-book-library/blob/main/scripts/load_into_people_graph.py) | `de4e9fd91c076fd514887c82bd334dde43271d7b` | Old canonical graph export and name matching. |
| `BOOKS-LOCATOR` | repository_file | [sisodias/siso-book-library:scripts/build_locator.py](https://github.com/sisodias/siso-book-library/blob/main/scripts/build_locator.py) | `0f1b41eaf18693852f7a8b7c1e31bbdfef82765e` | Tracked locator schema and builder. |
| `BOOKS-TIERS` | repository_file | [sisodias/siso-book-library:index/tier_queries.sql](https://github.com/sisodias/siso-book-library/blob/main/index/tier_queries.sql) | `0b86dfd7bad5c7564ef083d3dbf456e61af9638d` | Extraction queue views and issued-date correction. |
| `BOOKS-PDF-PROBE` | repository_file | [sisodias/siso-book-library:scripts/probe_text_layer.py](https://github.com/sisodias/siso-book-library/blob/main/scripts/probe_text_layer.py) | `d7e5f67b3af013df752acfb0c0c39c5613da0e82` | PDF text-layer quality gate. |
| `GLS-README` | repository_file | [sisodias/great-library-of-siso:README.md](https://github.com/sisodias/great-library-of-siso/blob/main/README.md) | `a282231b50f17de88a3f4ed11f704a858bc909ef` | Great Library identity and registry overview. |
| `GLS-AGENTS` | repository_file | [sisodias/great-library-of-siso:AGENTS.md](https://github.com/sisodias/great-library-of-siso/blob/main/AGENTS.md) | `c524d59797d3716359c4043847b9cb239abcd372` | Cold-start and change sequence. |
| `GLS-CURRENT` | repository_file | [sisodias/great-library-of-siso:CURRENT_STATE.md](https://github.com/sisodias/great-library-of-siso/blob/main/CURRENT_STATE.md) | `0f4eeed988ddc83fbe56bdc4598d83a8d21372f5` | Verified operating state before this parallel program. |
| `GLS-REGISTRY-MODEL` | repository_file | [sisodias/great-library-of-siso:docs/registry-model.md](https://github.com/sisodias/great-library-of-siso/blob/main/docs/registry-model.md) | `e746e22da160f836f0c962359ee3dd76dc71a098` | Work/Release/Snapshot/Source Inventory/Event boundaries. |
| `GLS-QUESTION-ARCH` | repository_file | [sisodias/great-library-of-siso:docs/question-driven-research.html](https://github.com/sisodias/great-library-of-siso/blob/main/docs/question-driven-research.html) | `2ec1c5f688fa25402d4cab71cd46f8500e8b4adb` | Question-driven evidence and reasoning architecture. |
| `GLS-QUESTION-MODEL` | repository_file | [sisodias/great-library-of-siso:docs/research-question-model.html](https://github.com/sisodias/great-library-of-siso/blob/main/docs/research-question-model.html) | `9976215ebd0db82e8272e52e5fe1cd2398034c8a` | Frontier Question identity and answer lineage. |
| `GLS-MISSION` | repository_file | [sisodias/great-library-of-siso:docs/siso-mission.html](https://github.com/sisodias/great-library-of-siso/blob/main/docs/siso-mission.html) | `b6cfb1de04e97809da3f2a9e4f87e0c17bb440bd` | Mission, principles and organ responsibilities. |
| `GLS-KNOWLEDGE-MODEL` | repository_file | [sisodias/great-library-of-siso:docs/siso-knowledge-model.html](https://github.com/sisodias/great-library-of-siso/blob/main/docs/siso-knowledge-model.html) | `dc1f74cdf77eea64f54f56c828ae996d8345a1e6` | Knowledge/Foundry/Evidence/Library boundary. |
| `GLS-GUTENBERG-INVENTORY` | repository_file | [sisodias/great-library-of-siso:registry/source-inventories/gutenberg-corpus-2026-08-03.json](https://github.com/sisodias/great-library-of-siso/blob/main/registry/source-inventories/gutenberg-corpus-2026-08-03.json) | `77139dea0159d863f886fa4445226cdb8f9b5a20` | Gutenberg source, rights and payload receipts. |
| `PR-GLS-1` | draft_pull_request | [sisodias/great-library-of-siso PR #1](https://github.com/sisodias/great-library-of-siso/pull/1) | `4dc9714096630b3d88c1aa34104ceec3c74a0bc0` | Great Library registry/ownership/program spine. |
| `PR-GLS-2` | draft_pull_request | [sisodias/great-library-of-siso PR #2](https://github.com/sisodias/great-library-of-siso/pull/2) | `20dc000451c28c707b0a97b943d1a4b178ea9bf0` | Current external-source and rights portfolio. |
| `PR-PG-1` | draft_pull_request | [sisodias/siso-people-graph PR #1](https://github.com/sisodias/siso-people-graph/pull/1) | `89dfec07acc38c6dadba69547a7ad4d60fbccf15` | Executable red-team failure fixtures. |
| `PR-PG-2` | draft_pull_request | [sisodias/siso-people-graph PR #2](https://github.com/sisodias/siso-people-graph/pull/2) | `b78ff6704783dff100774063c305011ce456d704` | Software and AI source-observation pilot. |
| `PR-PG-3` | draft_pull_request | [sisodias/siso-people-graph PR #3](https://github.com/sisodias/siso-people-graph/pull/3) | `2f66fbe1f4523399463d9e1ff8971879a84f5b88` | Additive v3 evidence ontology. |

## Official external documentation

| ID | Source | Observed use |
| --- | --- | --- |
| `EXT-OPENALEX-API` | [OpenAlex API overview](https://developers.openalex.org/api-reference/introduction) | Current entity/API contract for Works, authors, institutions, topics and related scholarly entities. |
| `EXT-CROSSREF-REST` | [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) | DOI metadata, ORCID/ROR, funding, license and update relationships. |
| `EXT-ORCID-DATA` | [ORCID annual public data files](https://info.orcid.org/what-is-orcid/services/annual-data-files/) | Public ORCID snapshot availability and CC0 release statement. |
| `EXT-ORCID-POLICY` | [ORCID Public Data File Use Policy](https://info.orcid.org/public-data-file-use-policy/) | CC0 scope plus privacy/publicity caveats for underlying data. |
| `EXT-DBLP` | [DBLP home/statistics and XML data](https://dblp.org/) | Current publication/author counts, XML dump and CC0 metadata statement. |
| `EXT-OPENLIBRARY-API` | [Open Library APIs](https://openlibrary.org/developers/api) | API use limits and requirement to use bulk dumps for bulk access. |
| `EXT-OPENLIBRARY-DATA` | [Open Library bulk data](https://openlibrary.org/data) | Monthly dump path and catalog scale statement. |
| `EXT-HF-HUB` | [Hugging Face Hub documentation](https://huggingface.co/docs/hub/main/index) | Models, datasets and Spaces as versioned repositories and current scale statement. |
| `EXT-GHARCHIVE` | [GH Archive](https://www.gharchive.org/) | Hourly public GitHub event archives and BigQuery availability. |
| `EXT-ATPROTO-DID` | [AT Protocol DID](https://atproto.com/specs/did) | Persistent DIDs versus mutable handles. |
| `EXT-ATPROTO-ACCOUNT` | [AT Protocol accounts](https://atproto.com/specs/account) | Account migration, deletion and downstream removal expectations. |
| `EXT-ATPROTO-REPO` | [AT Protocol repository](https://atproto.com/specs/repository) | Public verifiable repository model and record deletion semantics. |
| `EXT-SEC-EDGAR` | [SEC EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) | Real-time APIs and nightly bulk archives. |
| `EXT-REDDIT-TERMS` | [Reddit Data API Terms](https://redditinc.com/policies/data-api-terms) | Terms last revised 2026-07-20; narrow revocable license, retention/removal and model-training restrictions. |

## Source-use rules

- Repository blob SHA receipts identify the exact tracked content inspected; commit baselines identify repository state.
- Draft PRs are evidence that work was pushed, not proof that it is correct or merge-ready.
- Official external documentation is time-sensitive. Recheck policies, quotas, pricing, scale and API status at pilot kickoff.
- Public metadata availability does not automatically grant rights to linked full text, media, model weights, datasets or personal information.
- The deeper 39-source assessment currently lives in Great Library draft PR #2; promote it only after review.
