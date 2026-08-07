# Sources

## Canonical/problem tracking

- Erdős Problems, Problem #848 and its discussion thread.
- `teorth/erdosproblems` current data/status records.
- `google-deepmind/formal-conjectures`, `FormalConjectures/ErdosProblems/848.lean`.

## Existing formalization

- `The-Obstacle-Is-The-Way/erdos-banger`, pinned commit `1cc2ac8e9d70516e979733c6ea5c4d2eb652d1f5`, file `formal/lean/Erdos/848.lean`.
- Pinned file SHA-256: `ba6d3c2eb78bbb29b65b1a75c85be31cb704e57010f8871e1bdc764bd747fb24`.
- Lean `v4.27.0`, mathlib `v4.27.0` / manifest-resolved commit.

## Public all-N candidate used as a proof roadmap, not a trusted theorem

- `ipitchford/erdos-848-all-n`.
- `proofs/ALL_N_THEOREM.md` for the five-range stitch and structural roadmap.
- Its finite/structural verifier documentation and exact-rational replay documentation.

## Trust rule

External sources may supply theorem statements, proof ideas, and candidate certificate data. They do not become assumptions in the final Lean theorem. Every load-bearing imported mathematical fact must either already be a kernel-checked theorem from the pinned dependency closure or be proved in this project.
