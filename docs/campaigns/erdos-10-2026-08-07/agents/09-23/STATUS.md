# Status

Date: 2026-08-07

Agent: Prompt 9

Problem: Erdős #23

Branch: `agent/erdos-09-23`

Current verdict: `NEW CANDIDATE PARTIAL RESULT`

The canonical conjecture is still open. No full proof or counterexample has survived verification. The strongest retained finite corollary is the residue-sensitive integer rounding consequence of Ferudun's 2026 flag-algebra estimate: conditional on that exact upstream certificate, the conjectured floor bound holds for 147 orders through 200, including every order through 42. The first order not closed by this method is 43.

The live proof search is now concentrated on two genuinely different routes:

1. convert the elementary fractional odd-cycle-cover bound `Lambda(G,x) <= 1/25` into an integral bound by proving that any integrality gap forces quantitative slack below `1/25`;
2. exploit smallest-counterexample structure: maximal triangle-free, one-unit excess, middle density, and minimum degree above approximately `0.16N`.

No result is to be relabelled as a full proof unless the exact canonical quantifiers are closed and the argument survives independent hostile checking.