# People Graph source matrix

**Research cut:** 2026-08-06  
**Mode:** research only; no production data was downloaded or ingested.  
**Machine-readable matrix:** [`source-matrix.json`](source-matrix.json)  
**Rights controls:** [`rights-and-deletion-matrix.md`](rights-and-deletion-matrix.md)

## Decision

Build the first durable spine from **OpenAlex, Crossref, ORCID, DBLP and ROR**; follow with **numeric GitHub IDs, ecosyste.ms, PyPI, npm and bounded Hugging Face metadata**. Use Open Library, Library of Congress and Wikidata to strengthen historical authority/edition coverage. Add OpenCitations, OpenReview, NIH, USPTO and SEC only after the provenance and deletion harness passes.

Reddit, X, LinkedIn, Goodreads, Google Scholar and Crunchbase are `do_not_ingest`. Podcast Index, YouTube, Hacker News, Mastodon, GH Archive and schema.org `sameAs` are discovery-only by default.

**Coverage:** 39 sources — 19 `pilot_now`, 8 `research_more`, 6 `discovery_only`, 6 `do_not_ingest`.

## State rubric

| State | Meaning |
| --- | --- |
| `pilot_now` | Bounded replayable metadata pilot is supportable with stated controls. |
| `research_more` | Resolve a material access, rights, freshness, deletion or engineering issue first. |
| `discovery_only` | Use only for ephemeral candidate discovery or opaque locators; no persistent corpus. |
| `do_not_ingest` | Current access/rights/risk is incompatible with the program. |

## Source decisions

### Scholarly and authority

| Source | State | Gain | Access and strongest IDs | Expected value | Rights/deletion boundary |
| --- | --- | ---: | --- | --- | --- |
| **Crossref** | `pilot_now` | 5 | REST API, annual public data file, and paid Plus snapshots. IDs: DOI, member prefix, ORCID when deposited | Crossref adds modern books, papers, software/dataset DOIs, contributor roles… | Crossref says most metadata is reusable; abstracts and some… Corrections and retractions arrive as updated metadata/relations… Kill: Kill full-file ingestion if a seed-filtered… |
| **DBLP** | `pilot_now` | 5 | XML/RDF dumps, search/API endpoints and update feeds. IDs: DBLP person PID, DBLP publication key, DOI | DBLP is especially valuable for living computer scientists and engineers—the… | DBLP bibliography data is offered under CC0; linked publisher… Person disambiguation and publication records can be corrected… Kill: Kill scale-up if DBLP adds fewer than 15% strong… |
| **ORCID** | `pilot_now` | 5 | Annual Public Data File; Public API for non-commercial… IDs: ORCID iD | Explicit ORCID links are among the strongest bridges from living technical… | Annual Public Data File is CC0, but ORCID can waive only its… Annual replacement must suppress fields no longer public. Build… Kill: Kill automatic bridge use if the ORCID was not… |
| **OpenAlex** | `pilot_now` | 5 | REST API plus complete data snapshot; paid monthly snapshots… IDs: OpenAlex author ID, OpenAlex work ID, OpenAlex… | OpenAlex can bridge GitHub/technical-author seeds to ORCID, DOI works… | OpenAlex states the complete dataset is CC0. Linked full text… Apply source tombstones and changed-record replacement from… Kill: Kill or narrow the pilot if fewer than 20% of the… |
| **OpenReview** | `pilot_now` | 5 | OpenReview API v2 for venues, notes, profiles, invitations… IDs: OpenReview profile ID, note ID, forum ID | Adds living AI researchers, papers, reviews, conflicts, decisions and… | Metadata is published under CC0; comments/config records have… Profile/content deletions and revisions require… Kill: Kill full-text review retention if removal/update… |
| **Research Organization Registry (ROR)** | `pilot_now` | 5 | REST API and versioned JSON/CSV data dumps on Zenodo/GitHub. IDs: ROR ID, GRID/Wikidata/ISNI/other external links… | ROR can turn free-text affiliations from scholarly sources into stable… | ROR data is CC0; GeoNames-derived location data carries CC BY… Track status/successor relationships and replace changed… Kill: Kill automatic affiliation crosswalks if… |
| **Wikidata** | `pilot_now` | 5 | SPARQL Query Service, MediaWiki APIs, full dumps and… IDs: Wikidata QID, property-scoped external IDs such… | Wikidata supplies cross-domain external-ID crosswalks, life dates… | Structured data is CC0. Referenced sources and Commons/media… Statements can be removed/deprecated and ranks/qualifiers change… Kill: Kill automatic identity acceptance if a Wikidata… |
| **Library of Congress Authorities / Linked Data Service** | `pilot_now` | 4 | Linked Data Service, id.loc.gov APIs, MARC authority… IDs: LC Name Authority ID, LCCN, LC Subject Heading… | LoC authority identifiers and subjects can strengthen historical-author and… | Many U.S. federal bibliographic records are broadly reusable… Authority updates and redirects must be applied by stable LC… Kill: Kill fuzzy-only linking if sampled precision is… |
| **Open Library** | `pilot_now` | 4 | Monthly data dumps, low-volume APIs and RecentChanges feed. IDs: Open Library Author ID, Open Library Work ID… | Open Library is the best bridge from Gutenberg-era Works to modern editions… | Open Library contributions are generally CC0, but Internet… User edits, merges and deletions occur. Apply revision-aware… Kill: Kill person bridging if name-only records… |
| **OpenCitations** | `pilot_now` | 4 | REST APIs, SPARQL endpoints and downloadable datasets. IDs: OCI citation identifier, DOI, OpenCitations… | Adds explicit citation edges and provenance that can answer influence/path… | OpenCitations data is CC0; software is generally ISC. Source… Corrections are represented through refreshed indexes/provenance… Kill: Kill scale-up if unique citation coverage is… |
| **VIAF** | `research_more` | 4 | Web/API lookups and published bulk files. IDs: VIAF ID, ISNI, national authority IDs | VIAF could reconcile historical authors from the Book Library to national… | VIAF data is offered under ODC-By 1.0 attribution terms… Authority clusters can split/merge. Consume redirects/changes and… Kill: Do not scale if the latest reproducible bulk file… |

### Software and AI

| Source | State | Gain | Access and strongest IDs | Expected value | Rights/deletion boundary |
| --- | --- | ---: | --- | --- | --- |
| **GitHub REST and GraphQL APIs** | `pilot_now` | 5 | Authenticated REST/GraphQL APIs, webhooks and Events… IDs: numeric user/account ID, node ID, numeric… | Stable numeric IDs can repair the current graph's login-based identity and… | API metadata is usable under GitHub terms, but repository… Account renames, repository transfers, deleted/suspended accounts… Kill: Kill any broad expansion if numeric IDs are not… |
| **Hugging Face Hub** | `pilot_now` | 5 | Hub REST endpoints, official Python client, Git repositories… IDs: repository ID/path, commit SHA… | Models, datasets and Spaces are distinct modern Works that connect AI… | Each repository has its own license/card; some are gated or… Deleted/private/gated transitions must tombstone cached metadata… Kill: Kill or restrict if license/card coverage is… |
| **Python Package Index (PyPI)** | `pilot_now` | 5 | Index API, JSON API, RSS and public BigQuery datasets for… IDs: normalized project name, version, file SHA-256 | Package coordinates, releases, repository URLs and maintainership can reveal… | Package metadata is public but uploader-supplied; package… Yanked/deleted releases and projects require tombstones. BigQuery… Kill: Kill maintainer identity use if only free-text… |
| **ecosyste.ms** | `pilot_now` | 5 | Public APIs and downloadable/open datasets across packages… IDs: package URL (purl), registry package… | Can unify packages, repositories, dependencies and maintainers across… | Data is generally CC BY-SA 4.0; source registries and… Track source deletion/yank state and ecosyste.ms refresh… Kill: Kill adoption if CC BY-SA cannot be honored in… |
| **npm registry** | `pilot_now` | 5 | Registry HTTP APIs, CouchDB-style replication for full public… IDs: package name, version, integrity/hash | Adds maintainers, package dependencies, versions and repository links for the… | Metadata access does not grant rights to package code… Handle unpublish/deprecate/owner changes by source replacement… Kill: Kill person linkage if maintainer evidence is… |
| **Software Heritage** | `research_more` | 4 | Public API for bounded queries; bulk graph datasets, mirrors… IDs: SWHID for content/directory/revision/release/sna… | SWHIDs provide durable Work/version identifiers and archived-history links… | Graph datasets are published under CC BY 4.0; archived source… Honor takedowns and suppress personal fields. Do not extract… Kill: Kill person-level use if identity depends on… |
| **crates.io** | `research_more` | 4 | Official API and database/data-access mechanisms; exact… IDs: crate name, version, checksum | Rust package ownership/dependencies can bridge technical creators not visible… | Crate source retains project-specific licenses. Registry… Yanks, owner changes and malicious-crate removals require prompt… Kill: Do not scale until official bulk access, rate… |
| **GH Archive** | `discovery_only` | 3 | Hourly gzip event archives and a public BigQuery dataset. IDs: GitHub event ID, actor numeric ID when present… | Could supply repository transfer/rename/activity history and contributor… | GH Archive code/site licensing does not grant new rights in… No built-in source-of-truth deletion stream. A persistent person… Kill: Do not persist person-level GH Archive rows… |

### Creators and media

| Source | State | Gain | Access and strongest IDs | Expected value | Rights/deletion boundary |
| --- | --- | ---: | --- | --- | --- |
| **Open RSS/Atom feeds** | `research_more` | 4 | HTTP retrieval of RSS/Atom feeds with conditional requests… IDs: feed URL, item GUID, episode enclosure URL | Open feeds can add podcast/newsletter/article Works and explicit creator… | Feed metadata remains publisher content. Public fetchability… Items can be withdrawn or edited. Refresh feeds, tombstone… Kill: Kill persistent storage for any feed without a… |
| **Podcast Index API** | `discovery_only` | 4 | Authenticated REST API over podcast/feed/episode metadata. IDs: Podcast Index feed ID, episode ID, feed GUID | Excellent discovery layer for modern hosts/guests and cross-domain… | Terms constrain permanent copying, database construction and… Follow cache headers and remove/refresh records; no persistent… Kill: Do not persist API-derived corpus unless written… |
| **Public conference schedule systems (pretalx/Sessionize and event-owned exports)** | `research_more` | 4 | Event-owned JSON/XML/iCal exports or public platform APIs. IDs: event ID/slug, session/talk ID, speaker profile… | Talk/event roles can bridge GitHub, papers, podcasts and video for living… | Schedule metadata and speaker biographies may contain… Speakers withdraw and schedules change. Replace by event revision… Kill: Kill any platform-wide crawl; scale only… |
| **YouTube Data API** | `discovery_only` | 4 | Authenticated YouTube Data API v3; push notifications for… IDs: channel ID, video ID, playlist ID | Directly addresses the current graph's tiny video layer and can connect… | API data is governed by YouTube terms. Titles, creator names… Refresh or delete covered API data within policy windows; respond… Kill: Do not create a persistent YouTube corpus unless… |
| **schema.org sameAs on public websites** | `discovery_only` | 4 | Fetch explicit structured data from public pages under… IDs: publisher URL, explicit sameAs URL… | Explicit personal-site links can bridge GitHub, ORCID, YouTube, podcasts and… | Schema.org vocabulary is open, but page content and extracted… Delete/replace observations when the page or explicit link… Kill: Keep discovery-only unless literal receipts, site… |

### Public discourse

| Source | State | Gain | Access and strongest IDs | Expected value | Rights/deletion boundary |
| --- | --- | ---: | --- | --- | --- |
| **AT Protocol / Bluesky public data** | `research_more` | 4 | Public AppView APIs, firehose/relay streams and user… IDs: DID, AT URI, CID | DIDs and explicit profile links could bridge technical creators across… | Protocol openness does not eliminate user-content, privacy or… Consume delete/tombstone events and periodically reconcile… Kill: Remain research-only until delete/tombstone… |
| **Stack Exchange network** | `pilot_now` | 4 | Stack Exchange API and periodic public data dumps. IDs: user ID scoped to site/network account where… | Adds technical Q&A Works, expertise evidence and explicit contribution roles… | Public network content is licensed under CC BY-SA 4.0 with… Honor deleted users/posts and API backoff; dumps can lag… Kill: Kill person-level persistence if… |
| **Hacker News API** | `discovery_only` | 3 | Official Firebase API exposing items, users, top/new/best… IDs: numeric item ID, username | Can discover technical creators, Works and conversations that bridge GitHub… | API access does not itself grant a content corpus license… Deleted/dead items and account changes must be reflected. Do not… Kill: Keep discovery-only unless a clear… |
| **Mastodon / ActivityPub instances** | `discovery_only` | 3 | Per-instance REST/streaming APIs and ActivityPub federation. IDs: account URI, ActivityPub object URI… | Could discover creators and explicit profile links, especially open-source… | User content and profile data remain governed by… Honor Delete activities, suspended/deleted accounts, instance… Kill: Keep discovery-only unless each instance has an… |

### Institutions and economic activity

| Source | State | Gain | Access and strongest IDs | Expected value | Rights/deletion boundary |
| --- | --- | ---: | --- | --- | --- |
| **NIH RePORTER / ExPORTER** | `pilot_now` | 5 | RePORTER API and ExPORTER bulk CSV files. IDs: project/application ID, grant number, PI… | Adds grants, investigators, organisations, publications and… | Public federal grant metadata is broadly reusable… Projects can be revised across fiscal files. Replace by… Kill: Kill person acceptance if matching relies only on… |
| **SEC EDGAR** | `pilot_now` | 5 | JSON APIs, daily/current archives, submissions data and… IDs: CIK, accession number, form type | Adds stable company IDs, filings, executives/directors, subsidiaries… | Public federal filings are accessible for reuse, but filings… SEC can correct/remove filings and rebuild indexes. Reconcile… Kill: Kill person auto-linking if an officer mention… |
| **USPTO Open Data Portal** | `pilot_now` | 5 | Open Data Portal APIs and bulk product downloads. IDs: patent/application/publication number… | Patents add inventions, inventors, assignees, citations, organisations and… | U.S. federal records are broadly public, but inventor… Corrections, assignments and status changes require… Kill: Kill person auto-linking if inventor names lack… |
| **Companies House API and bulk data** | `research_more` | 4 | REST API, streaming API and downloadable company-data… IDs: company number, officer appointment ID where… | Adds stable UK company numbers, officer roles and temporal company… | Register data is public but includes personal… Company/officer/PSC suppression and correction requests must… Kill: Do not ingest person-level officer/PSC details… |
| **OpenCorporates** | `research_more` | 4 | Commercial/public-benefit APIs and an OpenRefine… IDs: OpenCorporates company ID/URL, jurisdiction… | Could supply cross-jurisdiction company-number resolution and source register… | Open-data access is commonly ODbL/share-alike and… OpenCorporates may lag corrections and source register changes… Kill: Do not ingest a broad corpus without a compatible… |

### Restricted/high-risk

| Source | State | Gain | Access and strongest IDs | Expected value | Rights/deletion boundary |
| --- | --- | ---: | --- | --- | --- |
| **Crunchbase** | `do_not_ingest` | 3 | Commercial API/data products and limited approved research… IDs: Crunchbase UUID/entity IDs | Could add startups, founders, funding and acquisitions, but SEC/Companies… | Data is proprietary, non-transferable/non-sublicensable and… Termination/research terms require deletion/expungement; source… Kill: Do not ingest under public-web assumptions… |
| **LinkedIn APIs** | `do_not_ingest` | 2 | Approved partner APIs and limited Researcher API programs. IDs: LinkedIn member/org IDs available to approved… | Employment/organisation links would be useful, but terms make the graph's… | Scraping and unapproved aggregation are prohibited; API… Delete member-requested or account-closure data promptly… Kill: Do not ingest unless LinkedIn grants explicit… |
| **Reddit Data API** | `do_not_ingest` | 2 | Approved OAuth Data API access under Reddit developer… IDs: subreddit ID/name, thing ID for post/comment… | Could discover creators and discussions, but People Graph persistence… | Reddit requires approved use, limits commercial/research uses… Deleted posts/comments/account information must be deleted… Kill: Do not ingest until written approval covers the… |
| **X API** | `do_not_ingest` | 2 | Paid/approved X API tiers and compliance endpoints. IDs: user ID, post ID, list/space/community IDs | Could discover public creator accounts and conversations but offers weak… | X data is licensed only for approved API use; redistribution… Delete content/user data promptly when deleted, suspended or… Kill: Do not ingest until contractual rights, budget… |
| **Goodreads** | `do_not_ingest` | 1 | No current generally available official public API path was… IDs: Goodreads book/author/user IDs, where legacy… | Would add living readers/authors and reviews, but Open Library/Crossref… | Consumer reviews, shelves and profiles are… User/account/review deletion cannot be reliably propagated… Kill: Do not scrape or ingest; use Open Library… |
| **Google Scholar** | `do_not_ingest` | 1 | Human search interface; no official bulk API. IDs: result URLs/citations; no stable open Scholar… | Citation/author search could appear useful, but… | Search results and profiles are governed by Google terms… No supported deletion/changefeed for downstream copies. Kill: Do not automate or ingest. Use open scholarly… |

## First 30-day sequence

1. Build `pg-observation-0.1`, source manifests, logical digests, current-state overlays, tombstones/purge queues and publication filters.
2. Run OpenAlex, Crossref, ORCID, DBLP and ROR against the frozen living-technical cohort.
3. Run bounded GitHub API, ecosyste.ms, PyPI, npm and Hugging Face metadata with email/payload exclusion.
4. Run Open Library, Library of Congress and Wikidata against the historical/book cohort.
5. Promote only sources that pass identity precision, benchmark-question gain, rights completeness and deletion drills.

## Cross-source invariants

- Prefer dated dumps/changefiles over page crawling; preserve source snapshot, native ID, observed/retrieved time, terms revision, rights state, digest and raw pointer.
- A source adapter emits observations and evidence; it never assigns canonical People Graph identity.
- Model papers, packages, models, datasets, grants, patents, filings, talks, episodes and books as distinct Works/Events with typed roles.
- Store citations, stars, downloads, reputation and followers as time-stamped source observations—not one universal score.
- Keep disagreements and losing assertions. Unknown rights are `pending` and block public projection. Historical snapshots cannot resurrect records removed by the current source.

## Evidence and interpretation

Official access/terms locators and observed facts were checked on 2026-08-06. Information-gain scores, overlap hypotheses, costs, pilot boundaries and kill conditions are research judgments. The JSON uses a compact columnar representation; its `columns` array defines every source field, and `vocab` defines coded access, snapshot, rights and deletion values.
