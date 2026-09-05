# Module reading pilot

The root and SISO Foundry are the first two consumers of the static SISO Shell.
Other Work pages retain their existing layout until their source has an authored
`reading` object. The optional field is validated by `schemas/work.schema.json`
and included unchanged in the generated Work dossier.

Source: `registry/works/siso-foundry.json`. Generator: `scripts/build.mjs`.
Presentation: `src/site/assets/reading.css`. Shared rail: the exact `siso-shell`
source commit pinned in `package-lock.json`; its copied build assets are derived,
not an independently maintained implementation.

Each pilot page presents section/type/maturity, title/subtitle, the explicitly
labelled Library reading, a map of declared Work relationships, source locators
with visibility, three to seven dated source highlights, source entry commands,
and the existing provenance, evidence and selected-release distribution states.
Do not describe source commands as tested locally unless they were actually run.
Do not infer a license or promote private payloads because a source is linked.

The root loop is the operating thesis, not an assertion of proven business
results. Section counts come from the current Snapshot projection; question
counts come from accepted Work records. Now links to the existing Event timeline,
not an invented live-agent feed. Industries, SISO Source and a live Now feed remain
separate follow-up work.

Run `npm ci` and `npm run verify` under the machine's process-group RSS guard
when constrained. Use the installed Skills Hub `publish` capability to upload
only `site/` to the authorized Cloudflare project and preserve its exact receipt
in a private owner handoff. Keep Vercel as the existing fallback for now.
