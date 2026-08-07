# Approaches

## Retained partial result

Keep the residue `N^2 mod 25` when rounding the strict universal flag-algebra bound. This gives an exact finite closure criterion rather than discarding the fractional part. It closes 147 orders through 200 under the frozen upstream certificate.

## Live route A — gap versus slack

Let `psi(G,x)` be the minimum product weight of edges deleted to make `G` bipartite and `Lambda(G,x)` its odd-cycle-cover LP relaxation. The proved theorem `Lambda <= 1/25` is sharp on every induced pentagon concentration. A full proof would follow from a quantitative statement of the form

```text
psi - Lambda <= strict slack in the fractional bound
```

for every non-integral product-weight instance. The central danger is circularly restating the conjecture or claiming a constant integrality ratio; odd subdivisions refute such crude forms.

## Live route B — smallest counterexample structure

Assume a smallest counterexample. Add missing edges while preserving triangle-freeness, so it is maximal triangle-free. Combine exact one-unit excess, middle density, insertion inequalities, and minimum degree. Seek a reducible local configuration, twin class, or common-neighbour dichotomy strong enough to cross the `n/5` structural threshold.

## Live route C — counterexample search

Search exact max-cut values in structured high-gap families, weighted blow-ups, circulants, Andrásfai/Vega graphs, and odd subdivisions. A single explicit graph resolves the problem negatively. Heuristic values never count; any witness needs a canonical serialization and an independently checked max-cut certificate.

## Dead or blocked mechanisms

- fixed cut distributions combined by arithmetic, geometric, power, or Gibbs means;
- a universal bound depending only on global edge weight or odd girth;
- treating finite denominator grids as continuous maxima;
- using the order-10 SDP iterate without an exact rational PSD certificate;
- importing the retracted order-205 flag-algebra run.