# `pg-observation-0.1` parallel observation envelope

Source and ingestion lanes emit replayable fixture records through this interim envelope. It is deliberately an **observation contract**, not a canonical ontology, person schema, identity decision, claim verdict, or database row format. A lane can therefore publish evidence and compatibility seams without waiting for a v3 schema or silently resolving identities.

```json
{
  "envelope_version": "pg-observation-0.1",
  "source": {
    "source_id": "openalex",
    "snapshot_id": "source-native revision or dated snapshot",
    "record_native_id": "source-native stable identifier",
    "observed_at": "ISO-8601",
    "retrieved_at": "ISO-8601",
    "terms_revision": "URL, revision, or documented unknown",
    "rights_state": "public_metadata|open_data|restricted|discovery_only|pending",
    "payload_sha256": "sha256 of the replayable raw fixture or record"
  },
  "subject": {
    "kind": "person|organisation|account|work|event|venue|place|concept|claim",
    "source_native_id": "source-local identifier",
    "label": "source-observed label",
    "attributes": {}
  },
  "identifiers": [
    {
      "scheme": "orcid",
      "value": "0000-0000-0000-0000",
      "scope": "global|source|organisation",
      "stability": "stable|mutable|unknown",
      "uniqueness": "unique|non_unique|unknown",
      "evidence": "literal source field or locator"
    }
  ],
  "contributions": [],
  "relationships": [],
  "evidence": [],
  "raw_pointer": "fixture path, source locator, or content-addressed receipt"
}
```

## Required semantics

| Field | Meaning |
| --- | --- |
| `envelope_version` | Exactly `pg-observation-0.1` for this interim contract. |
| `source.source_id` | Stable namespace owned by the source adapter. It prevents collisions between native identifiers. |
| `source.snapshot_id` | Source-native revision, export identifier, or dated snapshot that makes replay and refresh comparison possible. |
| `source.record_native_id` | Identifier issued by the source for the observed record. Never replace it with a normalized name. |
| `source.observed_at` | Time represented by the source observation. Popularity and other mutable measurements require this timestamp. |
| `source.retrieved_at` | Time the lane acquired or verified the record. It remains distinct from observation or valid time. |
| `source.terms_revision` | Terms, license, policy, API revision, or an explicit documented unknown. |
| `source.rights_state` | One of the interim source-level states: `public_metadata`, `open_data`, `restricted`, `discovery_only`, or `pending`. Unknown rights are represented as `pending`, not inferred away. |
| `source.payload_sha256` | Digest of the replayable raw fixture or record according to the adapter's documented serialization rule. |
| `subject` | Source-observed entity kind, source-local identifier, label, and attributes. It never carries a canonical People Graph ID. |
| `identifiers` | Literal source identifiers with declared scope, stability, uniqueness, and evidence. |
| `contributions` | Source-observed contribution records, including role, order, and time when available. Empty is valid. |
| `relationships` | Source-observed relationships. Derived or model-proposed links must be identified as such in `evidence`. |
| `evidence` | Literal evidence, extraction notes, or model-marked classifications supporting the envelope fields. |
| `raw_pointer` | Tiny public-safe fixture path, source locator, or content-addressed receipt. Full raw payloads normally remain outside Git. |

## Invariants

1. Names, companies, locations, biographies, topics, and handles are never globally unique identifiers.
2. The envelope never assigns a canonical People Graph ID.
3. Model-generated classifications are explicitly marked in `evidence`; they are not source observations.
4. Popularity, followers, stars, downloads, and citations are timestamped observations, never a universal canonical person score.
5. Full raw payloads remain outside Git unless they are tiny, public-safe test fixtures.
6. A missing value is not a negative fact.
7. Display-name equality is not identity.
8. Source-native fields and identifiers remain available even when a lane supplies normalization hints in attributes or evidence.
9. `restricted`, `discovery_only`, or `pending` rights states block public payload promotion unless a later source-specific decision supplies the missing authority.
10. Living-person observations require a documented purpose, public or authorized source basis, minimization rule, and correction or deletion path.
11. Transformations create successor observations or claims that cite source evidence; they do not mutate the source fixture into canonical truth.
12. The Great Library stores only publication-safe identity, lineage, summaries, and locators—not restricted envelopes, private receipts, or production databases.

## Handoff rule

A source or ingestion lane may add lane-local fields only under a documented compatibility extension. Its draft-PR handoff must name the added fields, replay command, fixture paths, rights state, exact future seam, and whether an owning integration lane should preserve, map, or reject them. No lane waits for another schema or PR before emitting the base envelope.
