# Known results relevant to Erdős #848

## Established upstream formal result

A Lean 4 development at `The-Obstacle-Is-The-Way/erdos-banger`, pinned here to commit `1cc2ac8e9d70516e979733c6ea5c4d2eb652d1f5`, proves an asymptotic version of Problem #848. Its theorem uses a zero-based `Finset.range N` formulation. Prompt 2 therefore proves an explicit one-based indexing bridge rather than silently identifying the two finite statements.

## Public all-N candidate

`ipitchford/erdos-848-all-n` presents an unrefereed computer-assisted all-N candidate. Its advertised upper-bound coverage is split into five overlapping ranges:

1. `1..100000006` — exact coloring certificates and endpoint induction;
2. `100000000..1000000000` — exhaustive structural reduction;
3. `1000000000..1000000000000` — exact-rational short-shift envelopes;
4. `1000000000000..264000000000000000` — exact-rational rank envelopes;
5. `N >= 264000000000000000` — an explicit analytic theorem.

Prompt 2's `formal/Erdos848/AllNStitch.lean` checks that these ranges really cover every positive integer if each component proves the exact fixed-N proposition.

## Current formal contribution on this branch

The branch does not treat the public candidate as trusted. It currently proves theorem interfaces which the candidate data must satisfy, including `ValidColoring` and `validCandidateColoring_implies_erdos848`. This makes certificate generators untrusted and puts the mathematical implication inside Lean.
