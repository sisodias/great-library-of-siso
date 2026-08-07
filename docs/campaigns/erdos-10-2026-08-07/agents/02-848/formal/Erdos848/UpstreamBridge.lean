import Erdos848.ExactStatement
import ErdosBanger848

namespace Erdos848Exact

/-- The upstream zero-based candidate at `N+1` is exactly our one-based candidate at `N`. -/
theorem upstream_A7_succ_eq_B7 (N : ℕ) : Erdos848.A₇ (N + 1) = B7 N := by
  change rangeB7 (N + 1) = B7 N
  exact rangeB7_succ_eq_B7 N

/-- Bridge one fixed-`N` theorem from the upstream indexing convention to the canonical convention. -/
theorem upstream_statement_succ_implies_exact (N : ℕ)
    (h : Erdos848.Problem848Statement (N + 1)) : Erdos848For N := by
  intro A hA hprop
  have hsub : A ⊆ Finset.range (N + 1) := by
    intro n hn
    exact interval_subset_range_succ N (hA hn)
  have hprop' : Erdos848.NonSquarefreeProductProp A := by
    simpa [Erdos848.NonSquarefreeProductProp, NonSquarefreeProductProp] using hprop
  have hbound := h A hsub hprop'
  rw [upstream_A7_succ_eq_B7 N] at hbound
  exact hbound

/-- The already-formalized Sawhney asymptotic theorem implies the asymptotic theorem
    for the *actual* `{1,…,N}` Erdős statement.  This theorem closes the indexing
    fidelity gap; it does not close the finite all-`N` remainder. -/
theorem intended_asymptotic :
    ∃ N₀ : ℕ, ∀ N ≥ N₀, Erdos848For N := by
  rcases Erdos848.problem_848_asymptotic with ⟨M₀, hM⟩
  refine ⟨M₀, ?_⟩
  intro N hN
  exact upstream_statement_succ_implies_exact N (hM (N + 1) (by omega))

end Erdos848Exact
