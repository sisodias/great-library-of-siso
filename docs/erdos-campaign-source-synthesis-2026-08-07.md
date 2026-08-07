# Erdős Campaign Source Synthesis — 7 August 2026

## Purpose

This authored research note consolidates two independent UNSOLVEABLE inputs:

1. **Selecting and Attempting Another Erdős Problem** — a significance/tractability portfolio that selected Erdős #41 as a flagship research campaign.
2. **Erdős Problem Inventory and Automated Solver Throughput** — a same-day operational audit of the current Erdős corpus that prioritised finite, decidable, falsifiable, and verifiable problems for automated proof/search systems.

The two reports answer different questions and should not be treated as contradictory.

- The **#41 report** asks: *Which mathematically significant rewarded problem would make a strong long-form research campaign?*
- The **throughput report** asks: *Which current problems maximise the probability of producing independently checkable progress with a parallel automated fleet?*

For an overnight ten-agent run, the second objective is the relevant one.

## Source discipline

The operational source hierarchy is:

1. `teorth/erdosproblems` for current structured metadata and rich status classes.
2. `erdosproblems.com` for human-readable statement context and discussion, with the caveat that automated access can be blocked.
3. `google-deepmind/formal-conjectures` for candidate Lean statements, subject to statement-fidelity review.
4. `0bserver07/erdos-navigator` for agent access, provenance, and prior-AI-attempt intelligence.
5. OEIS for computational observations and executable sequence data where relevant.
6. Primary papers, arXiv, MathOverflow, GitHub, and current discussion threads for novelty review.

No database label `open` is sufficient by itself to support a novelty claim.

## Current operational inventory

The 7 August 2026 audit recorded 1,217 Erdős problems in the structured catalogue, including:

- 608 completely open;
- 9 decidable;
- 27 falsifiable;
- 7 verifiable;
- 106 carrying recorded prizes;
- 593 with Lean-formalised statements;
- 210 with Lean-formalised solutions.

These categories overlap and must not be summed.

The same audit estimated that a carefully curated formal/finite cohort is materially more promising than the broad open corpus. It explicitly recommended beginning with #742, followed by #848 and #307.

## Flagship research portfolio from the #41 report

The significance-weighted deep-research shortlist was:

| Rank | Problem | Research character |
| ---: | ---: | --- |
| 1 | 41 | Infinite B3 density; flagship deep additive-combinatorics campaign |
| 2 | 592 | Ordinal partition relation |
| 3 | 50 | Totient-distribution local behaviour |
| 4 | 30 | Sidon-set second-order term; strong incremental-result lane |
| 5 | 20 | Sunflower conjecture; important but crowded |
| 6 | 1052 | Unitary perfect numbers; computationally useful but full finiteness difficult |
| 7 | 39 | Dense infinite Sidon sets |
| 8 | 1191 | Logarithmic density of infinite Sidon sets |
| 9 | 3 | Divergent reciprocal sum forcing long arithmetic progressions |
| 10 | 142 | High-reward asymptotic problem; very low near-term tractability |

That report correctly treats #3 and #142 as north stars rather than sensible first autonomous targets.

## Fleet portfolio selected for 10 parallel agents

For the ten-agent campaign, select the top ten from the automation-oriented audit:

| Agent | Problem | Current structured class in 7 Aug audit | Why it is in the fleet |
| ---: | ---: | --- | --- |
| 01 | **742** | Decidable | Known mathematics reportedly reduces the unresolved graph problem to finite cases; strongest certificate/replay profile. |
| 02 | **848** | Decidable | Existing asymptotic result reportedly leaves finitely many residual cases; exact enumeration can in principle close them. |
| 03 | **307** | Verifiable | Finite prime-set witness problem with exact rational identity and known lower barriers. |
| 04 | **647** | Verifiable | Concrete divisor-function existential search; a witness is cheap to verify independently. |
| 05 | **366** | Verifiable | Neighbouring powerful-integer search with factorisation certificates and modular/Pell structure. |
| 06 | **835** | Verifiable | Johnson-graph colouring target, suited to SAT/symmetry reduction and checkable colouring or obstruction certificates. |
| 07 | **458** | Falsifiable | Precise LCM/consecutive-prime inequality with a straightforward finite counterexample certificate if false. |
| 08 | **779** | Falsifiable | Primorial-plus-prime primality target; supports residue analysis, targeted search, and primality certificates. |
| 09 | **23** | Falsifiable | Finite graph extremal statement with SAT/ILP encodings and compact counterexample certificates. |
| 10 | **128** | Falsifiable | Dense-induced-subgraph/triangle condition; exact extremal graph search with symmetry breaking. |

### Why #41 is not in the overnight ten

#41 remains the strongest flagship campaign from the significance-weighted report. However, it requires a long proof programme: reconstructing even-order B_h methods, identifying the odd-order obstruction, developing new additive-combinatorial lemmas, and then formalising them. That is precisely the kind of work worth doing, but it is not rational to displace a finite/verifiable target if the immediate goal is to maximise the probability of independent verified results from ten parallel agents.

## What counts as success

Every agent must use the following evidence labels rather than the word `solved` indiscriminately:

1. **Exploration only** — no new rigorous result.
2. **Candidate lemma / candidate witness** — promising but not independently verified.
3. **Certified finite result** — witness/counterexample/exhaustive finite certificate independently replayed.
4. **Candidate full proof** — complete mathematical argument but not yet formal or independently reviewed.
5. **Kernel-verified proof** — zero-placeholder formal proof of a trusted statement using permitted axioms.
6. **Novelty-verified resolution** — proof/counterexample is statement-faithful and survives a fresh literature/prior-art audit.
7. **Publication-level resolution** — independently reviewed, reproducible, correctly attributed, and suitable for public status correction.

The UNSOLVEABLE programme must never convert level 2–5 into a world-first claim automatically.

## Realistic expectations

The automated-throughput report estimated roughly **1–5% Comparator acceptance** even on a curated amenable cohort, and materially lower rates across the broad corpus. Therefore eight verified resolutions from ten agents would be an extraordinary outcome, not a responsible baseline forecast.

The campaign should nevertheless be designed so that every agent continues after failed approaches and returns the strongest rigorous artifact it can produce: a solution, counterexample, finite closure, improved bound, new lemma, verified obstruction, corrected statement, or reproducible negative result.

## Programme principle

Optimise for **truthful mathematical throughput**, not for the number of messages containing the word `solved`.
