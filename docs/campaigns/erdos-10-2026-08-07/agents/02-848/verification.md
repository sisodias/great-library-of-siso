# Verification protocol

The formal proof lane is designed to fail closed.

## Reproducibility pins

- Lean: `leanprover/lean4:v4.27.0`
- mathlib input: `v4.27.0`, resolved by the committed Lake manifest
- upstream asymptotic source commit: `1cc2ac8e9d70516e979733c6ea5c4d2eb652d1f5`
- upstream source SHA-256: `ba6d3c2eb78bbb29b65b1a75c85be31cb704e57010f8871e1bdc764bd747fb24`

GitHub Actions fetches that source afresh and verifies the hash before compilation.

## Forbidden shortcuts

Authored Lean sources are scanned for `sorry`, `admit`, custom assumption declarations, and `native_decide`. The axiom-audit module prints dependencies of the load-bearing theorems.

## Required completion test

A full-proof claim requires all of the following:

1. the exact `Erdos848Exact.Erdos848AllN` proposition is proved;
2. every range-specific component is linked to that exact proposition;
3. all Lean modules build;
4. the environment replay/checker succeeds;
5. the axiom audit contains only accepted foundational Lean/mathlib dependencies;
6. no external certificate is trusted merely because its generator reports success.

Until then the workspace remains `EXPLORATION ONLY`.
