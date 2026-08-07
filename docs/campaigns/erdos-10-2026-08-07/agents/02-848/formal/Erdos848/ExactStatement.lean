import Mathlib

namespace Erdos848Exact

/-- The exact finite interval appearing in the informal Erdős problem: `{1, …, N}`. -/
def interval (N : ℕ) : Finset ℕ := Finset.Icc 1 N

/-- Every ordered pair from `A`, including the diagonal, has nonsquarefree product-plus-one. -/
def NonSquarefreeProductProp (A : Finset ℕ) : Prop :=
  ∀ a ∈ A, ∀ b ∈ A, ¬ Squarefree (a * b + 1)

instance instDecidableNonSquarefreeProductProp (A : Finset ℕ) :
    Decidable (NonSquarefreeProductProp A) := by
  unfold NonSquarefreeProductProp
  infer_instance

/-- The proposed extremal residue class inside the *exact* interval `{1, …, N}`. -/
def B7 (N : ℕ) : Finset ℕ :=
  (interval N).filter (fun n => n % 25 = 7)

/-- Erdős #848 for a fixed `N`, with the intended one-based indexing. -/
def Erdos848For (N : ℕ) : Prop :=
  ∀ A : Finset ℕ, A ⊆ interval N → NonSquarefreeProductProp A →
    A.card ≤ (B7 N).card

/-- The canonical all-`N` question.  The historical problem quantifies over positive `N`. -/
def Erdos848AllN : Prop :=
  ∀ N : ℕ, 1 ≤ N → Erdos848For N

/-- The zero-based range version used by the existing asymptotic formalization. -/
def rangeB7 (M : ℕ) : Finset ℕ :=
  (Finset.range M).filter (fun n => n % 25 = 7)

/-- A local copy of the proposition shape used by the asymptotic formalization. -/
def RangeStatement (M : ℕ) : Prop :=
  ∀ A : Finset ℕ, A ⊆ Finset.range M → NonSquarefreeProductProp A →
    A.card ≤ (rangeB7 M).card

/-- `{1,…,N}` is contained in `range (N+1) = {0,…,N}`. -/
theorem interval_subset_range_succ (N : ℕ) : interval N ⊆ Finset.range (N + 1) := by
  intro n hn
  have hnle : n ≤ N := (Finset.mem_Icc.mp hn).2
  exact Finset.mem_range.mpr (by omega)

/-- Correct the indexing mismatch exactly: filtering `range (N+1)` by `7 mod 25`
    gives the same set as filtering `{1,…,N}` because `0 % 25 ≠ 7`. -/
theorem rangeB7_succ_eq_B7 (N : ℕ) : rangeB7 (N + 1) = B7 N := by
  ext n
  simp only [rangeB7, B7, interval, Finset.mem_filter, Finset.mem_range, Finset.mem_Icc]
  constructor
  · rintro ⟨hnlt, hmod⟩
    have hnle : n ≤ N := by omega
    have hnpos : 1 ≤ n := by
      by_contra h
      have hn0 : n = 0 := by omega
      subst n
      norm_num at hmod
    exact ⟨⟨hnpos, hnle⟩, hmod⟩
  · rintro ⟨⟨_hnpos, hnle⟩, hmod⟩
    exact ⟨by omega, hmod⟩

/-- A theorem proved for the zero-based range at `N+1` implies the intended
    one-based theorem at `N`.  This is the exact bridge missing from the
    existing Formal Conjectures statement. -/
theorem rangeStatement_succ_implies_exact (N : ℕ)
    (h : RangeStatement (N + 1)) : Erdos848For N := by
  intro A hA hprop
  have hsub : A ⊆ Finset.range (N + 1) := by
    intro n hn
    exact interval_subset_range_succ N (hA hn)
  have hbound := h A hsub hprop
  rw [rangeB7_succ_eq_B7 N] at hbound
  exact hbound

/-- Any eventual theorem for the zero-based range transfers to an eventual
    theorem for the intended one-based problem, with no asymptotic hand-wave. -/
theorem eventual_range_implies_eventual_exact
    (h : ∃ M₀ : ℕ, ∀ M ≥ M₀, RangeStatement M) :
    ∃ N₀ : ℕ, ∀ N ≥ N₀, Erdos848For N := by
  rcases h with ⟨M₀, hM⟩
  refine ⟨M₀, ?_⟩
  intro N hN
  exact rangeStatement_succ_implies_exact N (hM (N + 1) (by omega))

end Erdos848Exact
