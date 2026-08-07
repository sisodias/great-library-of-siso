# Proof or disproof record

No full proof or disproof is currently established.

## Certified local arithmetic claim

Accepting the cited strict density-tail theorem and the frozen exact-rational middle-band certificate, every triangle-free `N`-vertex graph satisfies

```text
beta(G) <= ceil(400243*N^2/10000000)-1.
```

Writing `N^2=25q+r`, `0<=r<25`, this proves `beta(G)<=q` whenever

```text
243*N^2 + 400000*r <= 10000000.
```

This closes 147 orders through 200 and every order through 42. It is a finite corollary, not the full theorem.

## Elementary fractional theorem available for the next attack

For nonnegative vertex weights summing to one, let `d(v)=sum_{u in N(v)}x_u`. For every odd cycle `C` of length `L` in a triangle-free graph,

```text
sum_{v in C} d(v) <= (L-1)/2.
```

Hence Cauchy-Schwarz gives

```text
sum_{v in C} 1/d(v) >= 2L^2/(L-1) >= 25/2.
```

Putting edge-cover variable

```text
y_uv = (1/d(u)+1/d(v))/(2*gamma),
gamma = min_C sum_{v in C}1/d(v),
```

produces a feasible fractional odd-cycle cover of cost at most `1/25`.

The missing step is integral rounding with no loss at the sharp pentagon plateau. Known integrality-gap witnesses prove that `psi=Lambda` is false in general.