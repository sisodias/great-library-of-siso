# Rights, privacy, retention and deletion matrix

**Research cut:** 2026-08-06  
**Purpose:** define the minimum compliance plane required before any source becomes a persistent People Graph input.  
**Not legal advice:** official terms must be re-checked and, where necessary, reviewed by counsel before collection.

## Governing conclusion

A source is not ingestible merely because it is publicly viewable or technically accessible. Persistent ingestion requires: a documented rights basis; source and terms revision; an allowed acquisition method; a source-native key; a replayable correction/removal path; field-level minimization; downstream publication rules; and an auditable purge test. Sources that cannot meet those conditions remain `discovery_only` or `do_not_ingest`.

## Required deletion architecture

1. **Source registry.** Record source owner, access mode, terms/policy URLs, observed revision/date, rights state, attribution, privacy classification and refresh trigger.
2. **Snapshot/record ledger.** Give every acquired record a source snapshot, source-native ID, observed/retrieved times, payload digest and raw pointer.
3. **Observation isolation.** Source observations are append-oriented and remain distinct from canonical clusters, claims and derived projections.
4. **Current-state overlay.** Keep a source-record state table (`active`, `changed`, `deleted`, `restricted`, `private`, `tombstoned`) separate from immutable receipts.
5. **Purge queue.** Source deletions enqueue deterministic cascades for raw cache, searchable text, public projections, embeddings/features, exports and backups under the source SLA.
6. **Suppression ledger.** Preserve a non-content tombstone—source, native ID, deletion reason/time and purge receipt—so historical snapshots cannot resurrect removed data.
7. **Rights compartments.** CC BY-SA/ODbL-derived databases and restricted API data must be logically and operationally separable from CC0/public-domain metadata.
8. **Field denylist.** Email, phone, precise home address, full birth date, private/gated content and authentication data are excluded by default.
9. **Publication gate.** Every projection filters by rights/publication state; `pending`, `restricted`, `discovery_only` and removed records cannot leak into public exports.
10. **Quarterly drill.** Select records from each source class and prove end-to-end deletion, attribution and snapshot-rebuild behavior.

## Source-by-source matrix

| Source | Rights basis / boundary | Required update or deletion behavior | Personal-data risk | State |
| --- | --- | --- | --- | --- |
| **Stack Exchange network** | Public network content is licensed under CC BY-SA 4.0 with attribution requirements; user/profile data remains personal and subject to account/deletion semantics. | Honor deleted users/posts and API backoff; dumps can lag deletion, so current suppression must overlay historical snapshots. | `very_high` | `pilot_now` |
| **GitHub REST and GraphQL APIs** | API metadata is usable under GitHub terms, but repository content retains repository-specific licenses and personal data remains regulated. Public visibility is not a blanket reuse license. | Account renames, repository transfers, deleted/suspended accounts and private transitions must create alias/history/tombstone events. Purge inaccessible payloads and do not persist email. | `high` | `pilot_now` |
| **Hugging Face Hub** | Each repository has its own license/card; some are gated or restricted. User/profile data and deleted repositories require suppression. | Deleted/private/gated transitions must tombstone cached metadata; never bypass gating or persist gated payloads. | `high` | `pilot_now` |
| **ORCID** | Annual Public Data File is CC0, but ORCID can waive only its own rights; linked resources retain rights and individuals retain privacy/publicity rights. | Annual replacement must suppress fields no longer public. Build field-level tombstones and never retain private/non-public history from API responses. | `high` | `pilot_now` |
| **OpenReview** | Metadata is published under CC0; comments/config records have CC BY terms; article rights remain with authors/publishers under OpenReview agreements. | Profile/content deletions and revisions require note/version-aware replacement. Full review text retention should follow license and removal policy. | `high` | `pilot_now` |
| **Python Package Index (PyPI)** | Package metadata is public but uploader-supplied; package artifacts retain project licenses. Author/maintainer email fields are personal data and should not be ingested. | Yanked/deleted releases and projects require tombstones. BigQuery download history is described as immutable even when projects are removed, so do not use it as a persistent person source. | `high` | `pilot_now` |
| **SEC EDGAR** | Public federal filings are accessible for reuse, but filings may contain personal/sensitive data and third-party copyrighted exhibits. | SEC can correct/remove filings and rebuild indexes. Reconcile current indexes; do not persist unnecessary personal addresses/signatures. | `high` | `pilot_now` |
| **USPTO Open Data Portal** | U.S. federal records are broadly public, but inventor addresses and other personal fields require minimization; linked documents can contain sensitive personal data. | Corrections, assignments and status changes require append/replacement by publication/application IDs. Suppress unnecessary addresses and personal contact fields. | `high` | `pilot_now` |
| **npm registry** | Metadata access does not grant rights to package code; packages have individual licenses. Maintainer emails/personal fields should be dropped. | Handle unpublish/deprecate/owner changes by source replacement and tombstones. Do not retain removed personal fields. | `high` | `pilot_now` |
| **NIH RePORTER / ExPORTER** | Public federal grant metadata is broadly reusable; abstracts/contact/person fields still warrant purpose limitation and minimization. | Projects can be revised across fiscal files. Replace by application/project revision while preserving observed-time history. | `medium` | `pilot_now` |
| **Open Library** | Open Library contributions are generally CC0, but Internet Archive does not assert new rights over underlying books, covers or linked payloads. | User edits, merges and deletions occur. Apply revision-aware replacement and retain tombstones. | `medium` | `pilot_now` |
| **OpenAlex** | OpenAlex states the complete dataset is CC0. Linked full text and third-party content retain their own rights and must not be copied merely because metadata points to them. | Apply source tombstones and changed-record replacement from snapshots/changefiles. Do not assume an author profile is a permanent identity decision. | `medium` | `pilot_now` |
| **Wikidata** | Structured data is CC0. Referenced sources and Commons/media have separate licenses. | Statements can be removed/deprecated and ranks/qualifiers change. Replay current state while preserving source observations and retraction history. | `medium` | `pilot_now` |
| **ecosyste.ms** | Data is generally CC BY-SA 4.0; source registries and repository content retain their own terms. | Track source deletion/yank state and ecosyste.ms refresh timestamps; share-alike boundary must be explicit. | `medium` | `pilot_now` |
| **Crossref** | Crossref says most metadata is reusable; abstracts and some deposited components may retain copyright. DOI landing-page content is not granted by metadata access. | Corrections and retractions arrive as updated metadata/relations. Replace source observations by DOI and indexed timestamp while preserving prior observation receipts. | `low` | `pilot_now` |
| **DBLP** | DBLP bibliography data is offered under CC0; linked publisher content retains its rights. | Person disambiguation and publication records can be corrected. Rebuild source projections by DBLP keys and keep observation history. | `low` | `pilot_now` |
| **Library of Congress Authorities / Linked Data Service** | Many U.S. federal bibliographic records are broadly reusable, but item-level rights and external records vary; no blanket payload-rights inference. | Authority updates and redirects must be applied by stable LC identifiers with tombstones. | `low` | `pilot_now` |
| **OpenCitations** | OpenCitations data is CC0; software is generally ISC. Source publications retain their rights. | Corrections are represented through refreshed indexes/provenance. Replace by citation identifier/version. | `low` | `pilot_now` |
| **Research Organization Registry (ROR)** | ROR data is CC0; GeoNames-derived location data carries CC BY 4.0 attribution. | Track status/successor relationships and replace changed organisation records by ROR ID. Do not erase source history. | `low` | `pilot_now` |
| **AT Protocol / Bluesky public data** | Protocol openness does not eliminate user-content, privacy or service-terms obligations. Handles are mutable; DIDs are stronger source identifiers. | Consume delete/tombstone events and periodically reconcile repositories. Deletion may propagate asynchronously across services. | `very_high` | `research_more` |
| **Companies House API and bulk data** | Register data is public but includes personal addresses/birth-month/year and is subject to UK data-protection and register-suppression rules. | Company/officer/PSC suppression and correction requests must propagate promptly; minimize addresses and dates of birth. | `very_high` | `research_more` |
| **OpenCorporates** | Open-data access is commonly ODbL/share-alike and use-restricted by plan; commercial use may require a paid agreement. Underlying registers remain definitive. | OpenCorporates may lag corrections and source register changes. Reconcile against authoritative registers and honor removal/suppression. | `very_high` | `research_more` |
| **Software Heritage** | Graph datasets are published under CC BY 4.0; archived source retains original rights. Personal data and takedown restrictions apply, especially author emails. | Honor takedowns and suppress personal fields. Do not extract commit emails or use author strings as canonical identity. | `very_high` | `research_more` |
| **Open RSS/Atom feeds** | Feed metadata remains publisher content. Public fetchability does not grant redistribution of audio, transcript or full descriptions. | Items can be withdrawn or edited. Refresh feeds, tombstone missing items after confirmation and honor publisher removal. | `high` | `research_more` |
| **Public conference schedule systems (pretalx/Sessionize and event-owned exports)** | Schedule metadata and speaker biographies may contain personal data; reuse rights are event-specific. | Speakers withdraw and schedules change. Replace by event revision and remove withdrawn profiles/biographies. | `high` | `research_more` |
| **crates.io** | Crate source retains project-specific licenses. Registry metadata includes personal/account information that should be minimized. | Yanks, owner changes and malicious-crate removals require prompt tombstones; security removals are a key test fixture. | `high` | `research_more` |
| **VIAF** | VIAF data is offered under ODC-By 1.0 attribution terms; underlying national-library records may carry additional notices. | Authority clusters can split/merge. Consume redirects/changes and never overwrite underlying source authority identifiers. | `medium` | `research_more` |
| **GH Archive** | GH Archive code/site licensing does not grant new rights in third-party GitHub event payloads. Historical retention can conflict with later deletion/private transitions. | No built-in source-of-truth deletion stream. A persistent person corpus would need reconciliation against current GitHub state and a suppression ledger. | `very_high` | `discovery_only` |
| **Hacker News API** | API access does not itself grant a content corpus license. Usernames/comments are personal/user-generated content. | Deleted/dead items and account changes must be reflected. Do not retain removed comment text without a rights basis. | `very_high` | `discovery_only` |
| **Mastodon / ActivityPub instances** | User content and profile data remain governed by users/instances. Federation does not create blanket reuse rights. | Honor Delete activities, suspended/deleted accounts, instance blocks and local removal requests; federation may leave remote copies. | `very_high` | `discovery_only` |
| **Podcast Index API** | Terms constrain permanent copying, database construction and sublicensing; audio/transcripts retain publisher rights. | Follow cache headers and remove/refresh records; no persistent corpus until written permission/terms clearly allow the intended use. | `very_high` | `discovery_only` |
| **YouTube Data API** | API data is governed by YouTube terms. Titles, creator names, descriptions and comments generally require refresh/deletion handling; media/transcripts are not granted for corpus reuse. | Refresh or delete covered API data within policy windows; respond to user/video/channel deletion and credential revocation. Some approved aggregate metrics have separate retention rules. | `very_high` | `discovery_only` |
| **schema.org sameAs on public websites** | Schema.org vocabulary is open, but page content and extracted statements retain site/publisher rights. `sameAs` is a publisher claim, not verified truth. | Delete/replace observations when the page or explicit link disappears; support site-owner removal requests. | `high` | `discovery_only` |
| **Crunchbase** | Data is proprietary, non-transferable/non-sublicensable and limited to contracted purposes. Research access is time-bounded and may require data expungement. | Termination/research terms require deletion/expungement; source corrections/removals must propagate. | `very_high` | `do_not_ingest` |
| **Goodreads** | Consumer reviews, shelves and profiles are copyrighted/personal data. Public web visibility is not reuse permission. | User/account/review deletion cannot be reliably propagated without an official API. | `very_high` | `do_not_ingest` |
| **LinkedIn APIs** | Scraping and unapproved aggregation are prohibited; API content use, combination, storage and redistribution are heavily constrained. | Delete member-requested or account-closure data promptly; research programs impose short personal-data retention and termination deletion. | `very_high` | `do_not_ingest` |
| **Reddit Data API** | Reddit requires approved use, limits commercial/research uses and imposes strict handling of deleted posts/comments/account data; public visibility is not permission for a corpus. | Deleted posts/comments/account information must be deleted; Reddit recommends routine deletion checks (for example within 48 hours). Retaining deleted data, even de-identified, is prohibited by policy. | `very_high` | `do_not_ingest` |
| **X API** | X data is licensed only for approved API use; redistribution, storage and derivative uses are constrained. | Delete content/user data promptly when deleted, suspended or notified—policy commonly requires action within 24 hours; on termination delete X data within the stated period. | `very_high` | `do_not_ingest` |
| **Google Scholar** | Search results and profiles are governed by Google terms; automated access must respect robots and no bulk corpus license is offered. | No supported deletion/changefeed for downstream copies. | `high` | `do_not_ingest` |

## High-risk source rules

### Reddit

Do not build a persistent corpus. Approved OAuth access, current policy and automated deletion checks are prerequisites even for a bounded experiment. Deleted post/comment/account data must be removed; the policy does not permit keeping deleted records merely because they were de-identified.

### YouTube

Treat the API as a live discovery surface. Stored API data must be refreshed or deleted on the policy schedule; channel/video/comment removals must cascade. Transcripts, audio and video are separate rights-gated payloads and are not authorized by metadata API access.

### X and LinkedIn

No persistent ingestion without explicit contractual approval. Both ecosystems impose strict restrictions on aggregation, storage and deletion. A profile URL supplied by another permitted source may remain an opaque locator; it is not authority to scrape or enrich the profile.

### GitHub events and Software Heritage commit metadata

Repository/artifact identifiers are valuable, but historical event/commit metadata can retain user names or emails after deletion. Exclude email, reconcile current account/repository state, and separate durable artifact identity from personal attribution.

### Company registers

Company numbers, CIKs and filing/accession IDs are strong organisation/Work identifiers. Officer, inventor and beneficial-owner names remain person observations. Precise addresses, birth dates and suppressed records require minimization and source-specific removal handling.

## License-combination boundaries

| License/data class | Allowed default | Required control |
| --- | --- | --- |
| CC0/open public metadata | Persistent source observations | Preserve source/version anyway; third-party linked content remains separate. |
| CC BY / ODC-By | Persistent observations | Attribution must survive exports and UI. |
| CC BY-SA / ODbL | Isolated derivative database/projection | Share-alike compatibility decision before mixing or publishing. |
| Public-domain U.S. federal data | Persistent metadata with minimization | Item-level third-party exhibits and personal fields remain separately governed. |
| Platform API licensed data | Usually bounded cache/discovery | Contract, quotas, retention and deletion SLAs are mandatory. |
| No official bulk/reuse path | No ingest | Do not replace absent permission with scraping. |

## Minimum source method card

Every adapter/pilot must publish:

- owner and official access method;
- exact snapshot/revision/query and payload digest;
- terms/policy URL plus observed revision/date;
- field inventory and explicit excluded fields;
- rights/license and attribution requirements;
- personal-data classification and purpose;
- rate-limit/cost model;
- update, correction, deletion and termination behavior;
- raw-cache retention and backup expiry;
- reproducibility command and logical digest;
- kill condition and source owner for escalations.

## Release blockers

Bulk ingestion must be blocked when any of these are true:

- no source-native key or snapshot/revision;
- terms/rights state is unknown for the intended use;
- deletion or source replacement cannot be demonstrated;
- personal contact fields are retained without an approved purpose;
- a source's share-alike/attribution obligations cannot survive downstream exports;
- canonical identity is assigned by name, handle, company or location;
- restricted/gated/full-text payloads are copied under a metadata-only permission;
- historical dumps can resurrect source-deleted records;
- public projections cannot filter rights and publication state.
