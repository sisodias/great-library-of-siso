# Locked statement

For every integer `n >= 0` and every finite simple triangle-free graph `G` on exactly `5n` vertices, there is a set of at most `n^2` edges whose deletion makes `G` bipartite.

Define

```text
beta(G) = min{|F| : F subseteq E(G), G-F is bipartite}
        = |E(G)| - maxcut(G),
a(N)    = max{beta(G) : G triangle-free, |V(G)|=N}.
```

The canonical statement is

```text
forall n >= 0, a(5n) <= n^2.
```

By exact uniform blow-up, this is equivalent to the all-order formulation

```text
forall N >= 0, a(N) <= floor(N^2/25).
```

A proof must establish this for every finite order. A disproof consists of one explicit finite simple triangle-free graph with `beta(G) > floor(|V(G)|^2/25)`, together with a complete max-cut certificate. Finite verification of many orders is not an infinite proof.