# Agent 09 — Erdős Problem 23

Campaign: `erdos-10-2026-08-07`  
Assigned branch: `agent/erdos-09-23`  
Assigned workspace: `docs/campaigns/erdos-10-2026-08-07/agents/09-23/`

## Target

For every integer `n >= 0`, can every finite simple triangle-free graph on
`5n` vertices be made bipartite by deleting at most `n^2` edges?

Write

```text
beta(G) = min{|F| : F subseteq E(G), G-F is bipartite}
        = |E(G)| - maxcut(G),
```

and let `a(N)` be the maximum of `beta(G)` over triangle-free graphs on `N`
vertices. The canonical conjecture is `a(5n) <= n^2`; by exact blow-up it is
equivalent to the all-order form `a(N) <= floor(N^2/25)`.

## Verdict

**NEW CANDIDATE PARTIAL RESULT.** The campaign did not solve or refute the full
conjecture.

The strongest local deduction is conditional on two published inputs:

1. Ferudun's frozen order-10 exact-rational certificate for the middle density
   band, whose ancillary record reports
   `delta_final = 4.8557798 * 10^-5`;
2. the sharp Balogh--Clemen--Lidický theorem in the two strict density tails.

Taking the frozen certificate's reported value as an upstream theorem gives the
safe rational inequality

```text
delta < 4.86 * 10^-5 = 243/5,000,000.
```

For every triangle-free graph on `N >= 1` vertices this implies

```text
beta(G) < 400243 N^2 / 10000000,
beta(G) <= U(N) := ceil(400243 N^2 / 10000000) - 1.       (U)
```

Writing `N^2 = 25q+r`, `0<=r<25`, the cap (U) proves the conjectured
`beta(G)<=q` exactly when

```text
243 N^2 + 400000 r <= 10000000.                           (R)
```

Exact integer checking of (R) gives:

- **147 orders `1<=N<=200` are closed**;
- all orders `N<=42` are closed, so `N=41,42` extend the latest prior
  all-order range `N<=40` located in the specialist handoff;
- the precise frozen value adds `N=121` and `N=133` beyond the more robust
  145-order result obtained from only the coarser published inequality
  `delta<1/20000`;
- `N=43` is the first order not closed by this rounding method;
- no order above 200 can satisfy (R).

The covered ranges through 200 are

```text
1-42, 44-56, 58-67, 69-81, 83-85, 87-88, 90-92,
94-106, 108-110, 115-117, 119-128, 130-131, 133-135,
140-141, 144-145, 147-153, 155, 159-160, 165-166,
170, 173-177, 180, 185, 190, 195, 200.
```

## Counterexample frontier

At each of the 53 orders `N<=200` not closed by (R), the universal cap is
exactly one above the conjectured target. Hence any counterexample at one of
those orders is forced to have

```text
beta(G) = floor(N^2/25)+1,
ceil(1243 N^2/10000) <= e(G) <= floor(3197 N^2/20000),
delta_min(G) >= 2*(beta(G)-U(N-1)).
```

Two headline instances are:

```text
N=43:  beta(G)=74, 230<=e(G)<=295, minimum degree >=8.
N=205 (canonical n=41): beta(G)=1682,
         5224<=e(G)<=6717, minimum degree >=34.
```

## Reproduce

Run from this workspace:

```bash
python3 -m py_compile experiments/*.py

python3 experiments/residue_rounding.py \
  --max-order 200 --max-canonical-n 56 \
  --output certificates/residue-rounding-N200.json
python3 experiments/check_residue_certificate.py \
  certificates/residue-rounding-N200.json

python3 experiments/frontier_reductions.py \
  --max-order 200 \
  --output certificates/frontier-reductions-N200.json
python3 experiments/check_frontier_certificate.py \
  certificates/frontier-reductions-N200.json
python3 experiments/check_n41_reduction.py

python3 experiments/bruteforce_small_orders.py \
  --max-order 6 --output certificates/small-orders-N6.json

g++ -std=c++20 -O2 -Wall -Wextra -Werror \
  experiments/independent_arithmetic_check.cpp \
  -o /tmp/erdos23-agent09-check
/tmp/erdos23-agent09-check
rm -f /tmp/erdos23-agent09-check

sha256sum -c certificates/SHA256SUMS
```

Expected arithmetic headlines:

```text
covered_count=147
baseline_covered_count=145
added_over_baseline=[121, 133]
first_uncovered=43
canonical n=41/N=205: beta=1682 edges=[5224,6717] min_degree>=34
```

## Trust boundary

- The residue calculation, strict rounding, order lists, density-band integer
  endpoints, and insertion deductions are checked independently in Python and
  C++ using only integer arithmetic.
- Exhaustive labelled enumeration through order 6 is a separate regression
  check, not evidence for an infinite theorem.
- The frozen flag-algebra certificate is an external dependency. Its repository
  reports exact-rational verification, but the binary certificate was not
  independently parsed or replayed in this runtime.
- The 147-order result uses the frozen run's more precise reported value. The
  145-order sub-result needs only the paper's explicit `delta<1/20000` headline
  and is therefore less sensitive to display/provenance details.
- No broad scholarly-index or expert-referee novelty audit was available.

Read `proof-or-disproof.md`, `verification.md`, and `verdict.md` for the exact
claim and limitations.
