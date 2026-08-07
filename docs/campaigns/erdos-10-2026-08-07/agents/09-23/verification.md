# Verification

The accepted finite arithmetic uses exact integers only. The strict inequality is converted with

```text
integer beta < X  implies  beta <= ceil(X)-1.
```

Independent Python and C++ implementations reproduce the residue counts and boundary orders. Small labelled graphs are exhaustively enumerated only as regression tests.

For every proposed new lemma, verification must explicitly test:

- the exact quantifier order and the all-order statement;
- zero vertex weights and disconnected support;
- induced and non-induced odd cycles;
- strict versus non-strict rounding;
- counterexamples from `C5` blow-ups, Wagner, Petersen, Andrásfai graphs, and twice-subdivided complete graphs;
- whether a claimed maximum came from a finite grid;
- whether a solver result has an exact replayable certificate;
- whether the statement is merely a reformulation of `psi <= 1/25`.

The upstream binary flag-algebra certificate has not yet been independently decoded in this workspace. Therefore the graph-theoretic 147-order corollary remains conditional on that source, despite the local arithmetic being independently replayable.