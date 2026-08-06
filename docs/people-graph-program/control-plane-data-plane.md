# People Graph control plane and external data plane

ADR-0005 separates public identity and lineage from mutable graph data and source operations.

## Responsibility matrix

| Responsibility | Accountable Work or system | Boundary |
| --- | --- | --- |
| Stable public identity, Work and Release lineage, ADRs, Events, Snapshots, generated reading surface | The Great Library of SISO | Public metadata control plane only. It does not own or serve the mutable People Graph database. |
| Canonical-service governance for durable graph, index, corpus, and retrieval semantics | SISO Knowledge | Governs canonical semantics and admission contracts without absorbing independent source repositories or their raw data. |
| Source-universe discovery, evaluation, preservation opportunities, and reuse intelligence | SISO Foundry | Produces candidates and source observations. It is not canonical identity, claim, or merge truth. |
| Source-grounded transformation, claim extraction, contradiction handling, and adjudication | Evidence Engines | Converts observations into evidenced claims or knowledge proposals. It does not silently mutate canonical identity. |
| Person, identity, work, topic, and temporal graph source and export contract | SISO People Graph | Independent Work and repository with its own release, compatibility, security, and rollback boundary. |
| Book metadata, people and role exports, subjects, classifications, text-quality gates, and locator contract | SISO Book Library | Independent Work and repository; upstream rights and payload distribution remain source-specific. |
| Mutable SQLite databases, raw and restricted observations, source snapshots, payload archives, private receipts, credentials, machine-specific locators | External governed data plane | Never committed to the Great Library. Access, retention, encryption, rights, privacy, and deletion follow the source and operating environment. |

## Admission sequence

1. **Discover:** Foundry or a source pilot identifies a candidate source and records terms, rights, privacy, acquisition cost, freshness, and source-native identifiers.
2. **Observe:** The source-owning lane emits immutable or replayable `pg-observation-0.1` envelopes. An observation is evidence from a source, not canonical truth.
3. **Transform:** Evidence Engines may normalize, extract, connect, or propose claims while preserving source references and receipts.
4. **Adjudicate:** Conflicts, identity links, temporal assertions, and derived claims receive explicit status, confidence, review, and reversibility.
5. **Admit:** SISO Knowledge's canonical-service contract decides which entities, claims, indexes, or projections become durable.
6. **Register:** The Great Library may publish safe Work, Release, Event, Decision, and Snapshot metadata after evidence and rights gates pass.

## Non-claims in this program spine

The registry does not claim:

- that a v3 schema or production database exists;
- that either source repository builds cleanly from a fresh checkout;
- that current README counts were independently reproduced;
- that Book Library payload assets or byte-range routes were freshly tested;
- that either repository is installable or generally forkable;
- that public repository visibility supplies a license;
- that a source observation is a canonical fact;
- that historical repository-owner references are aliases.

## Compatibility rules

- Stable Work IDs and source-native IDs must not be repurposed.
- Identity links are claims with evidence and a reversible decision, never silent name merges.
- Roles belong on relationships or observations, not globally on a person.
- Topic vocabularies retain their source namespace.
- Effective time and observation time remain distinct.
- Rights and privacy state travel with the observation and any derivative.
- Database migrations are source-repository changes; Great Library Releases describe them only after evidence.
- Draft lane handoffs may disagree. Integration resolves conflicts in the owning repository rather than by rewriting other lanes' branches.
