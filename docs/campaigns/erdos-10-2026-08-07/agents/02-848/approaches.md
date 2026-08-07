# Formal proof approaches

## 1. Statement fidelity first

Use the exact one-based interval `{1,...,N}`. The existing asymptotic formalization is zero-based, so prove the bridge explicitly. Completed in `formal/Erdos848/ExactStatement.lean` and `UpstreamBridge.lean`.

## 2. Lower bound

Prove that the residue class `7 mod 25` is admissible because `25 | ab+1`. Completed in `formal/Erdos848/LowerBound.lean`.

## 3. Finite coloring certificates

Represent a certificate by a color map from diagonal candidates to `Fin k`. A valid certificate requires every pair of distinct same-colored vertices to have squarefree `ab+1`. Lean proves that any admissible set injects into the color type, hence has size at most `k`. Generic semantics completed in `formal/Erdos848/CertificateSemantics.lean`.

Next: translate the public compact finite certificate format into a small checker which constructs/establishes `ValidColoring` for each certified endpoint, then formalize endpoint monotonicity/induction.

## 4. Structural ranges

Formalize the outsider/witness decomposition, principal residue classes, matching-number bound, and exact-rational envelope lemmas used by the public candidate. Keep computational census data outside the trusted generator and prove a small checker sound.

## 5. High analytic tail

Formalize the explicit threshold theorem from its mathematical source rather than importing it as an assumption. This is expected to be the largest pure-mathematics dependency.

## 6. Final stitch

`formal/Erdos848/AllNStitch.lean` already proves that the five exact range theorems imply `Erdos848AllN`. Therefore completion is reduced to closing those five named obligations without placeholders or nonstandard assumptions.
