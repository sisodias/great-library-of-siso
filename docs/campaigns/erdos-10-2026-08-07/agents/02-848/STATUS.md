# STATUS — Prompt 2 / Erdős #848

Current label: **EXPLORATION ONLY**

## Kernel-checked layer

The Prompt 2 Lean project pins Lean 4.27.0 and mathlib 4.27.0. It also fetches the previously published asymptotic formalization at commit `1cc2ac8e9d70516e979733c6ea5c4d2eb652d1f5` and checks SHA-256 `ba6d3c2eb78bbb29b65b1a75c85be31cb704e57010f8871e1bdc764bd747fb24` before compiling it.

Authored Lean currently formalizes:

- the exact one-based interval `{1,...,N}`;
- the exact fixed-`N` and all-`N` Erdős #848 propositions;
- the `7 mod 25` admissible construction;
- the exact bridge from the existing zero-based asymptotic formalization to the intended one-based statement;
- the five advertised all-`N` range splice;
- generic coloring-certificate semantics: a verified valid coloring implies the required extremal upper bound.

CI rejects authored `sorry`, `admit`, `axiom`, and `native_decide` occurrences. `#print axioms` is used to expose theorem dependencies.

## Not yet kernel-closed

The public all-`N` candidate still contributes five load-bearing mathematical/computational components which have not yet been translated into Lean proofs:

1. exact finite certificate range through `100000006`;
2. structural range `100000000..1000000000`;
3. exact-rational range `1000000000..1000000000000`;
4. exact-rational/rank range `1000000000000..264000000000000000`;
5. explicit analytic tail from `264000000000000000` onward.

Until all five are proved in Lean (or reduced to compact certificates checked by Lean) and the final all-`N` theorem compiles, this workspace must not use a full-proof or resolution label.
