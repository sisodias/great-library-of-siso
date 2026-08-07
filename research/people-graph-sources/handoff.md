# Handoff — People Graph 100x source-universe research

**Status:** complete research lane, ready for review  
**Research date:** 2026-08-06  
**Repository:** `sisodias/great-library-of-siso`  
**Branch:** `gls/people-graph-source-research-20260806`  
**Base:** `main` at `12f4cc249b2b5dc268d05d1698fe9c5e3079327d`  
**Intended draft PR title:** `Research: map the 100x People Graph source universe`

## Scope

This lane maps public external sources and reusable open-source systems that could make the SISO People Graph dramatically more valuable. It is research-only. No production data was downloaded, no source adapter was enabled and no canonical identity decision was made.

The work used `sisodias/siso-people-graph` and `sisodias/siso-book-library` as read-only context. The Oracle repository and any production ingestion were out of scope.

## Exact changed files

- `research/people-graph-sources/source-matrix.json`
- `research/people-graph-sources/source-matrix.md`
- `research/people-graph-sources/github-landscape.md`
- `research/people-graph-sources/rights-and-deletion-matrix.md`
- `research/people-graph-sources/100x-value-theses.md`
- `research/people-graph-sources/pilot-portfolio.md`
- `research/people-graph-sources/handoff.md`

No registry, schema, generated site, `CURRENT_STATE.md`, existing docs, snapshots, releases or source-repository files were changed.

## What is delivered

- A machine-readable matrix of **39 sources** with owner, official access, identifiers, record types, scale, freshness, snapshot/delta model, terms/rights, attribution, quotas, deletion obligations, privacy risk, reproducibility, overlap hypothesis, information gain, cost, kill condition and state.
- A human-readable source matrix and official-source index.
- A current GitHub landscape covering Splink, Dedupe, OpenRefine, dlt, DataHub, OpenMetadata, ScanCode Toolkit, RDFLib, DuckDB and NetworkX, with maintenance evidence, licenses and adopt/borrow decisions.
- A rights/deletion architecture that treats removals, attribution and publication state as part of ingestion.
- Ten falsifiable 100x value theses.
- A gated 30/90/180-day pilot portfolio with cohorts, planning costs, metrics and stop conditions.

## Main conclusions

1. The first durable spine should be OpenAlex, Crossref, ORCID, DBLP and ROR, joined through source-native identifiers and Works.
2. The first software/AI spine should use numeric GitHub IDs, ecosyste.ms, PyPI/npm and bounded Hugging Face metadata.
3. Open Library, Library of Congress and Wikidata can upgrade the historical/book corpus without mirroring more full text.
4. OpenCitations, OpenReview, NIH, USPTO and SEC are the next decision-value layer after the evidence/deletion harness.
5. Reddit, X, LinkedIn, Goodreads, Google Scholar and Crunchbase are not persistent-ingestion sources under current access/rights conditions.
6. Podcast Index, YouTube, Hacker News and Mastodon are discovery-only by default; AT Protocol, VIAF, crates.io and company-register person data need more research.

## Reusable implementation seams

- **Candidate generation:** Splink; compare Dedupe only where labeled review is available.
- **Human review:** OpenRefine reconciliation protocol/client.
- **Incremental transport:** dlt, beneath the source manifest and rights layer.
- **Snapshot analytics/digests:** DuckDB.
- **Software rights receipts:** ScanCode Toolkit.
- **Standards export:** RDFLib; optional PROV-O/JSON-LD/RDF projections.
- **Algorithmic fixtures:** NetworkX on bounded graphs.
- **Pattern libraries only:** DataHub and OpenMetadata; do not add a second catalog/control plane.

## Compatibility seam

The research assumes a future `pg-observation-0.1` envelope whose minimum fields are:

- source name, native ID and source snapshot/revision;
- observed/retrieved times, terms revision, rights state and payload digest;
- one subject plus typed source identifiers;
- Works, contributions, relationships and assertion evidence;
- raw payload pointer and current source-record state;
- no canonical `person_id` assigned by the adapter.

The matrix does not require a particular database, graph engine or API style. It does require source observations to remain independently replayable from identity decisions.

## Validation performed

The following repo-safe checks were run without site generation:

```bash
python -m json.tool research/people-graph-sources/source-matrix.json >/dev/null
# custom Python contract check: required fields, 39 unique source IDs, valid states,
# official HTTPS sources, category/source coverage, non-empty rights/deletion fields
# custom Markdown check: every relative link resolves
# publication-safety scan: common private-key/token patterns
```

**Result:** PASS

- `source-matrix.json`: valid JSON.
- 39 unique sources; state counts: 19 `pilot_now`, 8 `research_more`, 6 `discovery_only`, 6 `do_not_ingest`.
- Category counts: 11 scholarly/authority, 8 software/AI, 5 creators/media, 4 public discourse, 5 institutions/economic, 6 restricted/high-risk.
- All required fields and minimum named sources are present.
- Relative Markdown links resolve.
- No common credential/private-key patterns were found.
- No unresolved placeholder markers were found.

The repository's normal `npm run verify` was intentionally not run here because this lane is constrained to research files and must not generate or modify `site/`. The branch diff should be reviewed to confirm only the seven reserved paths changed.

## Assumptions

- Source terms, pricing, quotas and policies are time-sensitive; every implementation lane must re-check them immediately before collection.
- Cost estimates are directional planning ranges, not vendor quotes.
- Existing People Graph counts and limitations are taken from its public README as read-only context.
- The graph continues to preserve roles on contribution edges, evidence-backed identity claims and reversible decisions.
- A public URL is a locator, not proof of ownership, truth or redistribution rights.

## Known risks

- Official terms can change after the research date.
- Some sources expose open metadata but link to copyrighted or gated payloads.
- Historical dumps can resurrect later-deleted personal data unless a current suppression overlay exists.
- Share-alike sources can contaminate downstream database licensing if not compartmentalized.
- Source-native person clusters can split/merge; they cannot be silently promoted to canonical People Graph entities.
- Modern creator sources have higher personal-data and withdrawal risk than the current historical corpus.
- GitHub activity evidence indicates current maintenance but is not a full security/dependency review of the evaluated projects.

## Data and rights notes

- No production or personal dataset was ingested.
- No API key, token, credential, local machine path, private topology, client data or raw operational database is present.
- Full text, package tarballs, model weights, datasets, videos, audio and transcripts are outside the default metadata pilots.
- Unknown/pending rights block publication.
- Email, phone, precise home address and full birth date are denylisted by default.

## Suggested merge considerations

1. Confirm the PR diff contains only the seven files under `research/people-graph-sources/**`.
2. Review the `do_not_ingest` and discovery-only decisions before any team treats the matrix as an implementation backlog.
3. Keep the cost and information-gain scores labeled as research judgments.
4. Do not import the matrix into the registry or generated site in this PR.
5. The first implementation PR should build the provenance/rights/deletion harness and one bounded scholarly cohort—not multiple production adapters.
6. Refresh official terms and source versions at pilot kickoff; record exact evidence in the implementation lane.

## Recommended next owner action

Start the 30-day evidence-spine pilot in a separate source repository/branch: freeze the cohort and benchmark questions, implement the source manifest plus deletion drill, then run OpenAlex/Crossref/ORCID/DBLP/ROR before any social or media source.
