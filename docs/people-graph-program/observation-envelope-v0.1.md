# `pg-observation-0.1` interchange envelope

`pg-observation-0.1` is the minimum cross-lane envelope for moving source evidence toward transformation and canonical admission. It is deliberately an **observation** contract, not a person schema, identity merge, claim verdict, or database row format.

```json
{
  "schema_version": "pg-observation-0.1",
  "source_namespace": "example-source",
  "source_native_id": "source-stable-id",
  "entity_kind": "person",
  "observed_at": "2026-08-06T15:24:00Z",
  "effective_at": {
    "start": "2026-08-01",
    "end": null,
    "precision": "day"
  },
  "provenance": {
    "source_locator": "https://example.invalid/public-record/source-stable-id",
    "method": "api",
    "collector_revision": "exact-code-revision",
    "parent_receipt_refs": []
  },
  "rights_state": {
    "status": "public_metadata",
    "jurisdiction": "source-declared",
    "reuse_scope": "discovery_and_evidence",
    "privacy_class": "public",
    "retention": "source-policy",
    "notes": "No payload redistribution grant is implied."
  },
  "payload": {
    "source_fields": {},
    "normalized_hints": {},
    "assertions": []
  },
  "content_sha256": "64-lowercase-hex-digest",
  "receipt_ref": "receipt:source-namespace:stable-receipt-id"
}
```

## Required semantics

| Field | Meaning |
| --- | --- |
| `schema_version` | Exactly `pg-observation-0.1` for this contract. |
| `source_namespace` | Stable namespace owned by the source adapter. It prevents collisions between native identifiers. |
| `source_native_id` | Identifier as issued by the source. Never replace it with a normalized display name. |
| `entity_kind` | The source's observed object class, such as `person`, `organization`, `work`, `identity`, `relationship`, `topic`, `event`, or `claim`. |
| `observed_at` | When the collector observed the source record. |
| `effective_at` | When the source says the observation was true, including uncertainty and precision. It is not interchangeable with `observed_at`. |
| `provenance` | Public or authorized locator, collection method, exact collector revision, and parent receipts. |
| `rights_state` | Source-specific rights, privacy, jurisdiction, reuse, retention, and deletion boundary. `unknown` or `restricted` must remain valid blocking states. |
| `payload` | Source-native fields plus optional normalization hints. It must not silently overwrite canonical entities or claims. |
| `content_sha256` | Digest of the canonical serialized envelope or source receipt according to the adapter's declared hashing rule. |
| `receipt_ref` | Stable reference to acquisition or verification evidence. The receipt payload may remain private. |

## Invariants

1. The tuple `(source_namespace, source_native_id, observed_at, content_sha256)` identifies an observation version.
2. Source-native fields remain available even when normalized hints are supplied.
3. A missing value is not a negative fact.
4. Display-name equality is not identity.
5. `rights_state.status` must be explicit before promotion. Unknown or restricted states block public payload publication.
6. Living-person observations require a documented purpose, source basis, minimization rule, and deletion or correction path.
7. Transformations create successor observations or claims that cite parent receipt references; they do not mutate the source observation.
8. Adjudication status and confidence belong to a claim or identity-decision layer, not the raw observation.
9. Source adapters must define deterministic serialization before `content_sha256` can be compared across runs.
10. The Great Library stores only publication-safe metadata and references, not restricted envelopes or private receipts.

## Suggested rights states

- `public_metadata`
- `public_domain_us`
- `licensed`
- `authorized_private`
- `discovery_only`
- `restricted`
- `unknown`
- `deleted_or_withdrawn`

These labels are starting vocabulary, not a universal legal conclusion. Each source lane must map them to source terms, jurisdiction, privacy, retention, and downstream use.
