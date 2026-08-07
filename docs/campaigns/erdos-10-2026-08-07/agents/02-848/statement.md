# Exact statement — Erdős Problem #848

For a positive integer `N`, call a finite set `A ⊆ {1,...,N}` admissible when `ab+1` is nonsquarefree for every ordered pair `a,b ∈ A`, including `a=b`.

Let

`B7(N) = { n ∈ {1,...,N} : n ≡ 7 (mod 25) }`.

The exact target is:

> For every positive integer `N` and every admissible `A ⊆ {1,...,N}`, `|A| ≤ |B7(N)|`.

Equivalently, since `B7(N)` itself is admissible, the extremal value is

`f(N) = |B7(N)| = floor((N+18)/25)`.

## Quantifier lock

- domain is `{1,...,N}`, not `{0,...,N-1}`;
- `N` is universally quantified over positive naturals;
- both diagonal and off-diagonal pairs are required;
- the theorem is a value theorem and does not assert uniqueness of extremizers;
- an eventual/sufficiently-large-`N` theorem is strictly weaker and does not solve this target.

The Lean source of truth is `formal/Erdos848/ExactStatement.lean`, definition `Erdos848Exact.Erdos848AllN`.
