# 30/90/180-day People Graph source pilot portfolio

**Plan date:** 2026-08-06  
**Mode:** bounded research pilots; no platform-wide harvesting.  
**Cost note:** all staff/cash figures are directional planning ranges, not commitments or vendor quotes.

## Portfolio objective

Prove that a provenance-first source portfolio can multiply useful, trustworthy cross-domain answers without sacrificing identity safety, rights or reproducibility. The program should stop weak sources early. It should not optimize for total rows, scraped pages or one opaque match score.

## Shared pilot cohort and benchmark

Use one frozen benchmark so every source has comparable marginal-gain evidence:

- **1,000 living technical creators** already represented by a GitHub/repository observation and at least one public corroborating clue (website, ORCID, DOI, package, conference or organisation).
- **200 historical Book Library people** spanning common names, rare names, BCE/life-date records and non-author roles.
- **100 organisations** spanning research institutions, companies, foundations and open-source organisations.
- **25 benchmark questions** covering complete portfolios, cross-medium timelines, organisations/funding, influence paths, collaborator discovery, rights-safe export and deletion history.
- **200 deliberately difficult negative controls:** homonyms, organisation/person collisions, renamed accounts, shared surnames, role conflicts and ambiguous package maintainers.

Freeze source-independent input IDs, benchmark questions and expected evidence fields before the first adapter runs.

## Portfolio-wide metrics

| Metric | Definition | 30-day gate | 90-day gate | 180-day target |
| --- | --- | ---: | ---: | ---: |
| Strong bridge rate | Cohort people gaining a literal stable cross-source identifier or reviewed high-confidence evidence | ≥25% | ≥40% | ≥55% |
| Accepted-link precision | Audited canonical-decision precision; adapters themselves never merge | ≥99% | ≥99% | ≥99.5% |
| New evidenced Works | Median new distinct Works per living person | ≥2 | ≥5 | ≥8 |
| Cross-domain people | People with evidenced contributions in ≥2 source domains | ≥150 | ≥350 | ≥600 |
| Benchmark question gain | Questions with a materially better, directly citable answer | ≥40% | ≥70% | ≥85% |
| Rights/provenance completeness | Published/eligible observations with source, snapshot, rights, attribution, digest and evidence | 100% | 100% | 100% |
| Deletion drill | Selected source deletion removed from raw/search/projection/export and cannot resurrect | 100% pass | 100% pass | automated SLA monitoring |
| Marginal cost | Engineer-days per 1,000 useful accepted observations | baseline | ≤75% of baseline | ≤50% of baseline |
| Review burden | Median reviewer minutes per accepted ambiguous identity decision | ≤12 | ≤8 | ≤5 |

A “useful accepted observation” is a Work, typed contribution, stable identifier, organisation/funding relation, citation, event or correction that is used by at least one benchmark query and survives rights/quality checks.

# Days 0–30: build the evidence spine

## Cohort A — provenance, rights and deletion harness

**Sources:** synthetic fixtures plus one record from each selected first-wave source.  
**Work:** implement/reuse the `pg-observation-0.1` envelope, source manifests, payload/logical digests, current-state overlay, tombstone/purge queue and publication filter.  
**Cost:** 7–10 engineer-days; $0–$500.

**Success gates**

- A snapshot can be rebuilt to the same logical digest after shuffled input order.
- One corrected and one deleted record can be replayed without rewriting unrelated observations.
- Purge removes raw cached payload, searchable text, derived feature/vector, public projection and export; a non-content tombstone remains.
- Unknown rights block publication; CC BY/ShareAlike attribution survives export.

**Kill/stop:** no source proceeds to persistent storage until this harness passes. If the current data model cannot represent source records separately from canonical decisions, stop and fix that seam first.

## Cohort B — scholarly identity and modern Works

**Sources:** OpenAlex, Crossref, ORCID annual public file, DBLP, ROR.  
**Boundary:** metadata only; no linked full text. Prefer dumps/snapshots and explicit ORCID/DOI/ROR/DBLP identifiers.  
**Cost:** 7–10 engineer-days; $0–$750.

**Questions**

- Which GitHub creators also publish papers/books/datasets/software with explicit identifiers?
- Which institutions and collaborators recur across their Works?
- Where do OpenAlex, Crossref, ORCID and DBLP disagree?

**Success gates**

- ≥35% of the living cohort gains one strong cross-source bridge.
- ≥99% audited precision for accepted identity decisions.
- Median ≥2 new Works per linked person.
- Every conflict retains both source assertions and literal evidence.

**Kill/stop:** narrow or stop a source if it adds <5% unique strong bridges beyond the preceding source, or if more than half of its candidates are name-only.

## Cohort C — software and AI Works

**Sources:** bounded GitHub API, ecosyste.ms, PyPI, npm, Hugging Face Hub.  
**Boundary:** metadata/revision/license fields only; no email, package payload, model weights or dataset content.  
**Cost:** 6–9 engineer-days; $0–$750.

**Questions**

- Which people maintain packages, repositories, models, datasets or Spaces across platforms?
- Which Works moved/renamed while retaining stable numeric/revision evidence?
- Which dependencies and releases show sustained contribution rather than one-time ownership?

**Success gates**

- Numeric GitHub IDs replace login-only source identity for ≥95% of the pilot cohort.
- ≥60% of software Works gain a stable package/repository/revision coordinate.
- Person links based only on author/maintainer email or free-text name remain unresolved.
- License/card state is present for ≥90% of public model/package Works or the Work is marked `pending`.

**Kill/stop:** stop broadening a registry if deletion/yank/private transitions cannot be replayed, or if useful new Work edges cost >2 engineer-hours per 100 records after the adapter is established.

## Cohort D — historical authority and editions

**Sources:** Open Library, Library of Congress Authorities, Wikidata; VIAF only after freshness method card.  
**Boundary:** identifiers, editions, subjects and roles; Project Gutenberg remains the current payload source.  
**Cost:** 4–6 engineer-days; $0–$250.

**Success gates**

- ≥60% of sampled Book Library Works gain one external authority/edition identifier.
- ≥99% audited person-link precision.
- Editor/translator/illustrator/commentator roles remain distinct from author.
- BCE and uncertain dates survive round-trip unchanged.

**Kill/stop:** do not scale fuzzy authority matching below 98% precision; retain useful Work/edition links while leaving people unresolved.

## Day-30 decision

Promote only sources that pass the shared compliance harness and at least one question/identity/Work gain gate. Archive source setup notes for stopped pilots; do not keep an adapter alive merely because it runs.

**Day-30 planning total:** **24–35 engineer-days; $500–$2,250** excluding staff, existing infrastructure and legal review.

# Days 31–90: add influence, institutions and carefully bounded public discourse

## Cohort E — influence and research process

**Sources:** OpenCitations and OpenReview.  
**Cost:** 6–10 engineer-days; $250–$1,000.

- Add citation provenance, reviews, decisions, conference/venue and explicit profile links.
- Compare unique citation edges and disagreements against OpenAlex/Crossref.
- Keep article/review full text rights-separated; start with metadata and typed relations.

**Gate:** ≥5% unique useful citation/review relations beyond existing sources, and ≥95% of person links use profile/ORCID/DBLP evidence rather than names.

## Cohort F — grants, patents and filings

**Sources:** NIH RePORTER/ExPORTER, USPTO ODP, SEC EDGAR, ROR; organisation-only Companies House method-card spike.  
**Cost:** 9–14 engineer-days; $250–$1,500.

- Add grants, PIs, patents, inventors, assignees, CIKs, filings and organisation events.
- Exclude contact fields, precise personal addresses and full birth dates.
- Require corroboration for officer/inventor/PI identity.

**Gate:** ≥50% of organisation cohort gains a stable ROR/CIK/company/patent/grant relation; ≥25% of people gain a new institutional Work/role; audited person precision ≥99%.

## Cohort G — technical discourse

**Sources:** Stack Exchange dump + current API suppression; Hacker News remains discovery-only.  
**Cost:** 5–8 engineer-days; $0–$750.

- Model questions/answers as Works/contributions; preserve CC BY-SA attribution.
- Treat reputation/score as timestamped platform observations.
- Prove deleted-user/post suppression over historical dumps.

**Gate:** ≥100 verified cross-domain creator links or ≥10 benchmark questions materially improved, with 100% attribution and deletion-drill pass.

## Cohort H — talks, conferences and open feeds

**Sources:** 5–10 event-owned schedule exports and 50–100 whitelisted RSS/Atom feeds; Podcast Index/YouTube only as policy-compliant discovery.  
**Cost:** 8–13 engineer-days; $500–$2,500.

- Add talk/episode/article Works and explicit speaker/host/guest roles.
- Store feed/schedule revision, ETag/digest and publisher rights.
- Do not mirror audio/video/transcripts.

**Gate:** ≥150 new evidenced appearance Works across ≥75 people; stable item/session identifiers in ≥90% of records; no unresolved retention basis.

## Cohort I — durable software artifact identity

**Source:** Software Heritage graph/SWHIDs.  
**Cost:** 4–8 engineer-days; $250–$1,000.

- Add repository origin/snapshot/revision SWHIDs.
- Explicitly exclude commit emails and avoid person identity from author strings.

**Gate:** ≥80% of sampled repositories gain useful durable SWHID/version evidence after moves/deletions; takedown and current-state reconciliation pass.

**Day-31–90 incremental total:** **32–53 engineer-days; $1,250–$6,750**.  
**Cumulative through day 90:** **56–88 engineer-days; $1,750–$9,000**.

# Days 91–180: scale winners and operationalize source governance

## Scale only the passed cohorts

- Expand scholarly/software/authority sources from the benchmark cohort to the full useful current graph population.
- Use source-native partitioning and checkpointed, idempotent jobs.
- Publish source freshness, coverage, rights and deletion SLO dashboards.
- Run monthly source disagreement/identity audit samples and quarterly deletion drills.
- Add source marginal-gain reports so redundant sources can be paused.

## Conditional research lanes

- **AT Protocol/Bluesky:** only deletion/tombstone experiments with opt-in/test accounts until propagation is proven.
- **Companies House/OpenCorporates:** organisation reconciliation only until legal/privacy/share-alike decisions are complete.
- **VIAF:** resume only after current bulk freshness and redirects are verified.
- **crates.io:** resume only after official bulk/rate/deletion method card passes.

## Explicitly excluded from the 180-day ingestion plan

Reddit, X, LinkedIn, Goodreads, Google Scholar and Crunchbase remain `do_not_ingest` absent a new official agreement/access path. Podcast Index, YouTube, Hacker News and Mastodon remain discovery-only unless their retention/removal conditions are separately satisfied.

## Operational targets by day 180

- New source adapter after harness: ≤5 source-specific engineer-days for a bounded pilot.
- Source snapshot manifest and logical digest: 100% of bulk jobs.
- Source terms/rights review: before first run and on revision trigger.
- Removal SLA: source-specific, monitored and tested; no deleted data in public/search exports.
- Accepted identity precision: ≥99.5% audited.
- Benchmark utility: ≥85% of questions materially improved.
- At least 600 living people with evidenced contributions in two or more domains.

**Day-91–180 incremental total:** **45–75 engineer-days; $3,000–$15,000** excluding commercial data licenses, counsel and staff.  
**Full 180-day planning range:** **101–163 engineer-days; $4,750–$24,000**.

## Portfolio stop rules

Stop or narrow a source when any of the following occurs:

- legal/terms scope is incompatible or unclear for the intended persistence/publication;
- no deterministic source-native key/snapshot/update path;
- accepted identity precision misses 99% after bounded review;
- marginal benchmark gain is <5% after overlapping sources;
- deletion/private/yank/correction events cannot be replayed;
- more than 50% of person candidates depend on name, company or location alone;
- average review cost exceeds the decision value or grows with no calibration improvement;
- payload/license attribution cannot survive downstream projections;
- source cash/API cost exceeds the precommitted cap without a demonstrated question-value gain.

## Promotion decision template

At each gate, record: source, cohort, snapshot, adapter commit, terms revision, rights state, excluded fields, unique observations, strong bridges, precision/recall audit, benchmark-question gain, deletion drill, total staff/cash cost, surprises, decision (`scale`, `narrow`, `pause`, `stop`) and next falsifier.
