# Proof / disproof state

No full proof or disproof is claimed yet.

## Proved in Lean on this branch

Let `Erdos848For N` be the exact one-based fixed-`N` upper-bound statement and `Erdos848AllN` its positive-integer universal closure.

The formal development proves:

- `B7_has_property`: the `7 mod 25` construction is admissible;
- `rangeB7_succ_eq_B7`: the candidate class in `range (N+1)` is exactly the class in `{1,...,N}`;
- `rangeStatement_succ_implies_exact`: a zero-based range theorem at `N+1` implies the intended fixed-`N` theorem;
- `intended_asymptotic`: the pinned published asymptotic Lean theorem transfers to the intended one-based statement;
- `allN_of_candidate_five_ranges`: the five advertised candidate ranges imply the all-`N` theorem with no uncovered integer;
- `validCandidateColoring_implies_erdos848`: a Lean-verified coloring certificate with exactly `|B7(N)|` colors proves the exact fixed-`N` extremal upper bound.

## Remaining proof obligations

The five actual range theorems themselves are not yet established in Lean. External scripts/certificates provide candidate evidence for those obligations but are not imported as assumptions.

Consequently the final theorem `Erdos848AllN` has not yet been produced unconditionally.
