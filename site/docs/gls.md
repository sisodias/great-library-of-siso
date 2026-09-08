# Read and contribute with gls

Read commands use the existing generated catalog/dossiers and canonical task
records. They do not need a browser, install dependencies, claim work or publish.

```bash
node bin/gls search "agent runtime" --limit 5
node bin/gls inspect siso-agent-base
node bin/gls inspect gls:work:b584bbf7-acde-46a2-b33e-e430ee1df224
node bin/gls tasks
node bin/gls task TASK-0007
```

Search returns compact matches with selection state, owner entry and dossier
URL. Inspect requires an exact slug or stable Work ID. Output is JSON and names
its scope as this checkout's projection; it does not verify a deployment.
Source hashes and the registry file set are checked before using generated
records. Missing or stale projections fail with a build instruction. Run
`npm run build` after a source change, then repeat the read.

`tasks` reads open records from the existing `.agents/tasks/` convention;
`task` returns the full canonical task and source path without requiring a site.
Read its status, scope, acceptance and prior evidence before working. Resolve a
blocker or inspect a completed receipt rather than repeating an unchanged failed
or completed attempt. These reads do not choose priority, acquire a claim or
grant execution/publication authority.

## Add reviewed metadata

`gls add` adds prepared JSON records through the existing Library schemas,
reference checks, public-content scan and full verification gate. It creates no
source repositories, permissions, Releases or research conclusions on your behalf.

```bash
node bin/gls add work --file candidate-work.json --reviewed-public --dry-run
node bin/gls add work --file candidate-work.json --reviewed-public
node bin/gls add release --file candidate-release.json --reviewed-public
node bin/gls add inventory --file candidate-inventory.json --reviewed-public
node bin/gls add question --file question-one.json --file question-two.json --reviewed-public
```

Run from the Library checkout or pass `--root`. The filename is the input's
basename; `--name` selects a different lowercase filename for one input. The
record's stable ID, schema and content remain authoritative. Input bytes are
preserved, so a previously computed Release hash remains valid.

Read every input and its underlying source before using `--reviewed-public`.
The scanner detects common credentials and machine paths; it cannot establish
rights, privacy, factual correctness or authorization from text alone. Keep
unknown, private or client payloads outside the public registry. A public-safe
stub for a private source still needs the applicable owner's authorization.

`question` is a Work with `work_type: research_question` and a research contract.
It remains the same Work/Release/Snapshot model; the CLI does not invent a second
question registry. `inventory` writes a Source Inventory, never an accepted Work.

A dry run copies schemas and registry records to a temporary directory for
validation and leaves the checkout untouched. Real adds hold a local exclusive
lock, use create-only writes, and run `scripts/verify.mjs`. A failed gate removes
only newly added files whose bytes still match the input, then rebuilds generated
pages. An unexpected edit is retained and reported. Existing records are never
overwritten; accepted immutable history must use successor records.

Up to 50 files of the same kind can be added together, with at most 2 MiB per
record. Batch related questions to validate their references together. The CLI
sets a 512 MiB Node heap cap for its child gates. No server is started.

After a successful add, record the change in an Event, update the selected
Snapshot when appropriate, commit, push and publish the verified site through
`publish`. Registration alone does not select a Release or prove deployment.
