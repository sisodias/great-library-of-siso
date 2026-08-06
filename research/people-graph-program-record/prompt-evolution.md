# Prompt-program evolution

## Version 0: dependency-ordered program

The first pack assigned a coordinator, then red-team/schema work, then identity/build/query/source lanes, then final integration. The dependency model reflected a conventional software program: settle governance, define contracts, implement, integrate and release.

### Why it was not operationally suitable

The actual execution surface was the ChatGPT/Codex web UI. One chat could not launch child agents, wait on branch completion in a shared orchestrator, or automatically hand results to the next lane. The user wanted to paste every prompt into a separate agent immediately. A strict dependency graph would create idle agents, repeated clarification and an unnecessary human scheduler.

The original pack is retained at [`prompts/dependency-ordered-superseded.md`](prompts/dependency-ordered-superseded.md). It remains useful as a record of intended logical dependencies and review order, but it is not the launch contract.

## Version 1: parallel-slam program

The revised thirteen-lane pack replaces launch dependencies with four mechanisms:

1. **Current-main rule:** each agent starts from the repository's latest default branch.
2. **Exclusive path ownership:** each lane owns non-overlapping directories and avoids shared hot files.
3. **Additive compatibility:** missing future contracts are handled with lane-local fixtures, adapters or shims rather than waiting.
4. **Draft-PR handoff:** each agent pushes durable work and records tests, assumptions, rights, seams and risks.

Source lanes share the interim `pg-observation-0.1` envelope. It deliberately describes source observations, not canonical people or accepted identity decisions.

The current pack is retained at [`prompts/parallel-slam.md`](prompts/parallel-slam.md).

## Integration consequence

Parallel launch removes execution dependencies; it does not make every branch semantically compatible. Integration still requires review of:

- duplicated observation contracts;
- identity auto-accept rules;
- Work/version semantics;
- source replacement and deletion behavior;
- root configuration and generated-file conflicts;
- query adapters;
- rights and publication state;
- migration/rebuild assumptions.

Prompt 13 was therefore changed from a final integration agent into an immediately runnable compatibility and merge-risk harness.

## Status correction

A later GitHub audit showed that several branch names existed but were identical to `main`. This record explicitly distinguishes branch reservation from durable pushed work. That correction is preserved in the swarm status files.
