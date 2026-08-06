# 100x value theses for the SISO People Graph

**Research cut:** 2026-08-06  
**Baseline:** the current graph already contains a large historical/book population and a large GitHub population, but only three measured GitHub+YouTube cross-domain people and little modern creator coverage. The theses below target decision value, not row count.

## What “100x” means here

A 100x source does not need to add 100 times more people. It should make a high-value question dramatically easier, more reliable or newly answerable: finding all Works by one living creator, tracing a technical idea across paper/package/model/talk, identifying collaborators or organisations with evidenced overlap, or detecting changed/deleted claims without corrupting the graph. Each thesis therefore has a measurable user outcome and a falsifier.

## 1. Stable identifier lattice beats global name matching

**Hypothesis.** A relatively small set of explicit ORCID, DOI, OpenAlex, DBLP, ROR, CIK, patent, package and numeric GitHub identifiers will produce more trustworthy cross-domain bridges than another order of magnitude of name-only rows.

**100x mechanism.** The graph becomes a lattice of source-scoped identifiers connected by literal assertions, allowing deterministic joins and targeted review instead of all-pairs fuzzy matching.

**Products/queries unlocked.** Identity evidence view; conflict detector; “why these records may be the same person” dossier; reversible alias/identifier history.

**Required sources.** ORCID annual file, OpenAlex, Crossref, DBLP, ROR, Wikidata identifier properties, GitHub numeric IDs, SEC CIK and registry package coordinates.

**Pilot test.** Seed 1,000 living technical people and 200 homonym controls. Measure explicit-ID bridges, reviewed precision, conflicts found and review minutes per accepted link.

**Success threshold.** At least 35% of the living cohort gains one new strong cross-source bridge; accepted links reach ≥99% precision on the audit sample; every link cites literal evidence.

**Falsifier / kill signal.** Fewer than 15% gain strong bridges or conflict handling consumes more reviewer time than the queries save.

**Guardrail.** A source ID is evidence, not the canonical ID. Conflicting strong IDs block merging.

## 2. Works and contributions create more value than person rows

**Hypothesis.** Adding modern Works—papers, packages, releases, models, datasets, grants, patents, filings, talks and episodes—and typed contributions will improve useful queries more than adding unmatched people.

**100x mechanism.** People become queryable through what they produced and how they contributed. The same person can be author, maintainer, editor, host, guest, PI, inventor or director without flattening roles.

**Products/queries unlocked.** Complete creator portfolio; cross-medium timeline; role-aware expertise map; “show the evidence behind this person's position” query.

**Required sources.** Crossref/OpenAlex/DBLP/OpenReview, PyPI/npm/Hugging Face, NIH/USPTO/SEC, Open Library/LoC, conference schedules and approved open feeds.

**Pilot test.** For a 500-person cohort, count new distinct Works, role diversity and cross-domain timelines; run 20 real questions before/after.

**Success threshold.** Median evidenced Works per living person increases ≥3x and at least 60% of benchmark questions gain a directly citable answer.

**Falsifier / kill signal.** Most new rows are duplicate locators or role-free content with no query gain.

**Guardrail.** Work identity, release/version and contribution role remain separate. Payload rights never follow automatically from metadata.

## 3. The modern technical-creator bridge is the missing overlap layer

**Hypothesis.** DBLP/OpenReview/ORCID plus packages/models/conferences/podcasts will connect the currently disjoint GitHub and historical-book populations by targeting living technical authors and speakers.

**100x mechanism.** The current graph's overlap ceiling is constrained by corpus age. Replacing “more Gutenberg” with living technical-author sources changes the population geometry.

**Products/queries unlocked.** GitHub + paper + package + talk + book creator pages; “builders who also explain” discovery; expert/collaborator shortlists.

**Required sources.** DBLP, OpenReview, OpenAlex, ORCID, PyPI/npm/Hugging Face, current technical-book metadata, approved conference schedules and open feeds.

**Pilot test.** Start with 1,000 GitHub creators who have public real-name/website/ORCID/DOI evidence and 1,000 recent technical authors; measure verified cross-domain joins.

**Success threshold.** Verified people with ≥2 domains increase from a handful to at least 250 in the pilot, with ≥99% audited precision.

**Falsifier / kill signal.** Cross-domain candidates remain name-only or the joined cohort is dominated by organisations/brand accounts.

**Guardrail.** Handle/real-name similarity alone cannot accept a link; organisation/person type conflicts must be explicit.

## 4. Temporal observations are a better product than one universal score

**Hypothesis.** Time-stamped citations, releases, maintainership, funding, patents, talks and platform metrics support trend and activity questions without the contradictions caused by storing a single rank/tier.

**100x mechanism.** Metrics remain source-specific observations with observed time and method; derived rankings are named, versioned projections with sensitivity tests.

**Products/queries unlocked.** Activity timeline; emerging-contributor view; maintained-vs-abandoned Work signal; source-specific trend charts; model comparison report.

**Required sources.** Crossref/OpenCitations, GitHub releases, package versions/download observations, NIH grants, USPTO filings, OpenReview decisions and approved media schedules.

**Pilot test.** Build three explicit scoring/projection policies and compare top-k stability, subgroup effects and evidence coverage.

**Success threshold.** Queries can explain every rank component and top-k changes; no stored tier contradicts its inputs; policy sensitivity is visible.

**Falsifier / kill signal.** Users only need stable identifiers/portfolios and temporal metrics do not improve decisions.

**Guardrail.** No raw metric is a universal quality score. All derived fields carry method, inputs, as-of time and null semantics.

## 5. Organisation, funding and invention edges unlock decision-grade ecosystem maps

**Hypothesis.** ROR, NIH, USPTO, SEC and primary company registers can turn a creator catalog into an evidence-backed map of labs, funders, companies, inventions and institutional transitions.

**100x mechanism.** Stable organisation/filing/grant/patent identifiers provide a second axis of context beyond Works and topics.

**Products/queries unlocked.** Who funded/built/commercialized an idea; founder/researcher transitions; institution collaboration graph; organisation-to-Work lineage.

**Required sources.** ROR, NIH RePORTER/ExPORTER, USPTO ODP, SEC EDGAR, Companies House after privacy review, OpenCorporates only under compatible licensing.

**Pilot test.** For 200 people and 100 organisations, measure corroborated affiliations, grants, patents and filings and how many strategic questions become answerable.

**Success threshold.** At least 50% of the cohort gains one stable organisation relation and 25% gains a grant/patent/filing Work with direct evidence.

**Falsifier / kill signal.** Person matching remains name-only or organisation data adds mostly stale addresses and duplicated names.

**Guardrail.** CIK/ROR/company numbers identify organisations; officer/inventor names remain observations until corroborated. Sensitive addresses are excluded.

## 6. Rights and deletion state are query dimensions, not back-office metadata

**Hypothesis.** Encoding acquisition rights, attribution, publication state and deletion status per observation will enable safer public products and make restricted sources usable as ephemeral discovery without contaminating the durable graph.

**100x mechanism.** Every observation can be filtered by allowed use; deletions cascade through projections while immutable non-content receipts prevent resurrection.

**Products/queries unlocked.** Rights-safe export; “why can/can't this be published?” explanation; deletion audit; source compatibility report.

**Required sources.** All sources, especially ORCID, Stack Exchange, YouTube, Reddit, GitHub events, Software Heritage and company registers.

**Pilot test.** Run quarterly purge/attribution drills across one record per source class and rebuild a snapshot from history.

**Success threshold.** 100% of tested deletions disappear from searchable/public outputs within source SLA; 100% of attributed/share-alike records retain required notices.

**Falsifier / kill signal.** Rights state cannot survive common exports or deletion requires manual full-database surgery.

**Guardrail.** Unknown rights are `pending` and block publication. No hidden raw cache or embedding may outlive the source record.

## 7. Authority reconciliation can make the historical corpus much more useful without adding full text

**Hypothesis.** LoC, Open Library, VIAF (after freshness review), Wikidata and explicit identifiers can turn the existing public-domain book corpus into a well-resolved authority/edition network.

**100x mechanism.** Historical authors and Works gain LCCN/VIAF/Wikidata/Open Library/ISBN/OCLC relationships, editions, contributors and subjects while Project Gutenberg remains the payload locator.

**Products/queries unlocked.** Author authority dossier; edition/work family; translator/editor graph; historical influence and contemporaries with stronger citations.

**Required sources.** Library of Congress, Open Library, Wikidata, VIAF, existing Gutenberg metadata.

**Pilot test.** Sample 2,000 Book Library people and 5,000 Works across common/rare names and contributor roles.

**Success threshold.** At least 70% of sampled Works gain an external authority/edition identifier; reviewed person-link precision ≥99%; translator/editor roles remain distinct.

**Falsifier / kill signal.** Authority clusters are too stale or name-only matching dominates.

**Guardrail.** Never flatten edition into Work, contributor into author, or VIAF cluster into permanent canonical truth.

## 8. Source disagreement is a research asset

**Hypothesis.** Conflicts among OpenAlex, Crossref, ORCID, DBLP, Wikidata and registries reveal valuable curation tasks and data-quality signals rather than noise to overwrite.

**100x mechanism.** Assertions coexist with provenance, confidence and observed time; resolution decisions cite evidence and can be reversed.

**Products/queries unlocked.** Contradiction queue; source-quality dashboard by field; “what changed and why?” audit; curated identity dossiers.

**Required sources.** Overlapping scholarly/authority/package/organisation sources.

**Pilot test.** Classify 1,000 multi-source conflicts in names, dates, authorship, affiliation, identifiers and Work metadata.

**Success threshold.** At least 80% of conflicts can be routed to deterministic rules or bounded review; corrections improve benchmark precision/recall.

**Falsifier / kill signal.** Most apparent conflicts are formatting differences with no user value and review cost exceeds benefit.

**Guardrail.** Normalization never destroys original literals; resolution never deletes the losing assertion.

## 9. Question-driven acquisition will outperform source-driven warehousing

**Hypothesis.** Starting each pilot with named questions and kill gates will avoid expensive broad ingestion and reveal which source fields actually create value.

**100x mechanism.** Each source adapter is justified by benchmark questions, expected information gain, cost and a precommitted stop condition.

**Products/queries unlocked.** Pilot scorecard; source marginal-gain curve; query coverage map; spend/latency/reviewer-budget ledger.

**Required sources.** The entire source matrix, sampled through cohorts rather than platform-wide crawls.

**Pilot test.** Run the 30-day cohort with and without source-prioritized acquisition; compare useful observations per engineer-day and benchmark-question gain.

**Success threshold.** At least 70% of pilot engineering time produces fields used by benchmark queries; low-gain sources are stopped within one sprint.

**Falsifier / kill signal.** Questions are too vague to guide fields or source setup cost dominates any bounded sample.

**Guardrail.** No source receives production status merely because an adapter works.

## 10. Modular reuse is safer and faster than adopting a monolithic graph platform

**Hypothesis.** Combining small proven tools at explicit seams will deliver identity/reproducibility/rights capabilities faster than transplanting an enterprise catalog or graph stack.

**100x mechanism.** Splink/Dedupe generate candidates, OpenRefine reviews, dlt transports, DuckDB profiles, ScanCode supplies rights receipts, RDFLib exports standards and NetworkX validates algorithms.

**Products/queries unlocked.** Composable adapter SDK; reconciliation endpoint; rights receipt pipeline; deterministic pilot harness.

**Required sources.** GitHub landscape projects plus People Graph contracts.

**Pilot test.** Implement one end-to-end source pilot using the modular stack and estimate code/ops/review burden versus a DataHub/OpenMetadata deployment spike.

**Success threshold.** A new source can be onboarded with <5 adapter-specific engineering days after the harness exists, without adding a second control plane.

**Falsifier / kill signal.** The seams require more custom glue than a proven platform deployment or fail required scale/SLA tests.

**Guardrail.** Borrow implementation patterns, not external ontology/identity decisions. Pin licenses and versions.

## Portfolio interpretation

The first six theses are mutually reinforcing and should be tested together on one bounded living-technical cohort. Thesis 7 preserves and upgrades the historical/book asset. Theses 8–10 make the program durable: disagreements stay inspectable, sources are acquired only for questions, and open-source reuse remains modular.

The recommended 30/90/180-day sequence, budgets and kill gates are in [`pilot-portfolio.md`](pilot-portfolio.md).
