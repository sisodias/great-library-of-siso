# Lean formalisation — Erdős #848

This directory is the Prompt 2 formal-verification lane for the exact all-`N` version of Erdős Problem #848.

## Toolchain

- Lean: `leanprover/lean4:v4.27.0`
- mathlib: `v4.27.0`, with the exact resolved dependency closure committed in `lake-manifest.json`
- upstream asymptotic formalisation: `The-Obstacle-Is-The-Way/erdos-banger` commit `1cc2ac8e9d70516e979733c6ea5c4d2eb652d1f5`
- pinned upstream source SHA-256: `ba6d3c2eb78bbb29b65b1a75c85be31cb704e57010f8871e1bdc764bd747fb24`

CI fetches that upstream Lean file at the pinned commit and refuses to build if the hash differs.

## Current kernel-checked modules

- `Erdos848/ExactStatement.lean` — exact `{1,...,N}` definitions and the zero/one-based bridge.
- `Erdos848/LowerBound.lean` — proves the `7 mod 25` construction is admissible.
- `Erdos848/UpstreamBridge.lean` — connects the pinned zero-based asymptotic theorem to the exact one-based statement.
- `Erdos848/AllNStitch.lean` — proves the five advertised candidate ranges cover all positive `N` if each range theorem is supplied.
- `Erdos848/CertificateSemantics.lean` — proves a verified coloring certificate yields the exact finite extremal upper bound.
- `Erdos848/AxiomAudit.lean` — prints dependencies of load-bearing theorems.

The dedicated GitHub Actions gate has completed successfully with both `lake build` and the environment replay checker. Authored sources are rejected if they contain proof placeholders, custom assumptions, or `native_decide`.

## What this does *not* yet prove

There is no unconditional theorem of type `Erdos848AllN` yet. The five load-bearing finite/structural/analytic range components of the public all-`N` candidate remain to be translated into Lean theorems (or into certificates consumed by sound Lean checkers).

A green build of this directory therefore certifies the formal infrastructure above, not the complete Erdős #848 conjecture.
