# Erdős Problem 41 — Flagship Campaign Dossier

**Programme:** UNSOLVEABLE Mathematics  
**Research date:** 7 August 2026  
**Evidence status:** Candidate campaign design. This is not a proof and does not independently confirm prize eligibility.

## Executive decision

Erdős Problem 41 remains an excellent **flagship research campaign**, even though it is not selected for the ten-agent overnight automation fleet.

The problem asks, in the standard strong-B3 interpretation, whether every infinite set `A ⊆ N` with unique three-term sums up to permutation must satisfy

\[
\liminf_{x\to\infty}\frac{A(x)}{x^{1/3}}=0,
\qquad
A(x)=|A\cap[1,x]|.
\]

The earlier deep-research report ranked #41 first because it combines:

- a precise and important additive-combinatorics question;
- a recorded US$500 reward in the reviewed structured data;
- an existing Lean formalisation of the statement;
- a clear historical progression: the analogous h=2 case, the h=4 case, and then the even-h theory;
- a sharply identified first unresolved odd case at h=3;
- several falsifiable intermediate lemma programmes;
- a natural combination of proof research, finite computation, and formal verification.

“Medium tractability” means medium only relative to other serious open/rewarded Erdős problems. It does not mean a rapid solution should be expected.

## Statement-fidelity warning

Before any proof campaign, the exact B3 convention must be locked.

The preferred canonical interpretation allows repetitions and requires equality of the two multisets whenever

\[
a_1+a_2+a_3=b_1+b_2+b_3.
\]

The campaign must distinguish this from restricted variants in which the three elements are required to be distinct. A proof of a restricted variant must not be represented as a solution of the canonical problem.

The exact Formal Conjectures declaration should be pinned by commit hash and compared line by line with the intended statement before it is used as a trusted challenge.

## Why the exponent 1/3 appears

If `m = A(x)`, roughly `m^3 / 6` unordered triples have to occupy distinct sums lying in an interval of length O(x). This gives the elementary finite-scale order bound

\[
m=O(x^{1/3}).
\]

Problem 41 asks for more: the normalised density should become arbitrarily small along an unbounded sequence of scales.

## Known-theory reconstruction programme

Before attempting new mathematics, reconstruct and audit:

1. the B2 argument attributed to Erdős;
2. Nash’s B4 argument;
3. Chen’s extension to all even h;
4. the precise place where parity/evenness is used;
5. whether that step can be recovered by symmetrisation, differencing, an auxiliary representation function, or a derived even-order object.

The key research question is therefore not merely “prove h=3”. It is:

> Which invariant available for B2k fails for B2k+1, and what replacement mechanism could recover enough density loss in the first odd case?

## Parallel mathematical routes

### 1. Even-to-odd transfer

Try to construct an even-order object, even moment, or transfer inequality from a hypothetical dense B3 sequence.

**Early falsifier:** prove or disprove a candidate transfer inequality on finite extremisers before using it asymptotically.

### 2. Block and gap method

Partition A into dyadic or adaptive intervals and count cross-block triple sums/differences.

**Target:** a finite interval lemma forcing a quantitative density deficit in at least one block.

### 3. Additive-energy/Fourier method

Express uniqueness of triple sums through vanishing or sharply bounded off-diagonal sixth-order energy.

**Target:** a localised moment inequality strong enough to sum across scales.

### 4. Difference-family method

Study multiplicities of identities such as

\[
a_1+a_2-b_3=b_1+b_2-a_3.
\]

**Target:** a bounded-multiplicity theorem that yields a global density loss.

### 5. Random restriction

Thin a dense hypothetical B3 set into an object with stronger regularity while retaining enough density.

**Target:** an explicit extraction lemma with constants.

### 6. Computational lemma mining

Enumerate finite strong-B3 extremisers, measure block densities and difference multiplicities, and search for stable inequalities or forbidden local patterns.

The computational lane is for discovering and falsifying lemmas, not extrapolating finite data into an asymptotic proof.

## Datasets worth building

- `finite-extremal`: best-known strong-B3 subsets of `[N]` with independently checked triple-sum uniqueness;
- `local-statistics`: block densities, gaps, difference multiplicities, local energy summaries;
- `lemma-counterexamples`: smallest witness falsifying each rejected proposed lemma.

Every record should preserve the B3 convention, solver version, random seed where applicable, objective, bounds, wall-clock time, and a hash of the mathematical instance.

## Verification gates

A future #41 result should pass, in order:

1. live status and identity check;
2. canonical statement lock;
3. novelty baseline;
4. Lean statement-fidelity audit;
5. complete candidate mathematical result;
6. zero-placeholder formal verification where feasible;
7. independent proof-term/certificate replay;
8. adversarial expert review;
9. fresh novelty audit after the result exists;
10. publication/prize procedure review before any public reward claim.

Kernel correctness, statement fidelity, novelty, significance, and prize eligibility are separate claims.

## Suggested campaign workspace

A dedicated proof repository, if later promoted, should separate:

- `metadata/` — source locks, provenance, prize record;
- `literature/` — bibliography, search log, claim matrix;
- `statements/` — canonical statement and variants;
- `lean/` — trusted statement, known cases, candidate lemmas, audit;
- `experiments/` — solver models and reproducible finite searches;
- `data/` — extremisers, statistics, counterexamples;
- `certificates/` — independently replayable finite evidence;
- `attempts/` — hypothesis, prompt, transcript, proof, verdict per attempt;
- `comparator/` — trusted challenge separated from untrusted proof code;
- `reviews/` — novelty, statement, mathematics, reproducibility;
- `releases/` — content-addressed decision artifacts.

## Why it is not an overnight-fleet target

Problem 41 is a long-horizon theorem-development problem. Its expected bottleneck is not a bounded residual computation but a new conceptual bridge across the odd-order gap. The 7 August automation audit identified decidable, verifiable, and falsifiable problems with much shorter proof-to-certificate loops. Those are more rational for a ten-agent parallel experiment whose objective is to maximise independently checkable output per agent-hour.

Problem 41 should remain the flagship deep campaign once the fleet has demonstrated that the UNSOLVEABLE verification pipeline works end to end.
