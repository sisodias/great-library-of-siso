import Erdos848.ExactStatement

namespace Erdos848Exact

/-- Vertices which can occur in an admissible set, because the diagonal pair
`(a,a)` must itself have nonsquarefree product-plus-one. -/
def DiagonalCandidates (N : ℕ) : Finset ℕ :=
  (interval N).filter (fun a => ¬ Squarefree (a * a + 1))

/-- A certificate coloring is valid when two distinct diagonal candidates with
the same color always have *squarefree* product-plus-one.  Thus no admissible
set can contain two vertices of one color. -/
def ValidColoring (N k : ℕ) (color : ℕ → Fin k) : Prop :=
  ∀ a ∈ DiagonalCandidates N, ∀ b ∈ DiagonalCandidates N,
    a ≠ b → color a = color b → Squarefree (a * b + 1)

/-- Admissibility forces every member onto the diagonal-candidate vertex set. -/
theorem admissible_subset_diagonal {N : ℕ} {A : Finset ℕ}
    (hA : A ⊆ interval N) (hprop : NonSquarefreeProductProp A) :
    A ⊆ DiagonalCandidates N := by
  intro a ha
  simp only [DiagonalCandidates, Finset.mem_filter]
  exact ⟨hA ha, hprop a ha a ha⟩

/-- Core certificate theorem: a verified `k`-coloring of the complement of
admissibility on the diagonal candidates proves every admissible set has at
most `k` members.

This is deliberately independent of any certificate generator.  A future
binary-certificate parser/checker only has to construct `ValidColoring`; this
theorem turns that checked object into the mathematical extremal bound. -/
theorem validColoring_bounds_admissible
    {N k : ℕ} (color : ℕ → Fin k) (hcolor : ValidColoring N k color)
    (A : Finset ℕ) (hA : A ⊆ interval N)
    (hprop : NonSquarefreeProductProp A) :
    A.card ≤ k := by
  have hdiag : A ⊆ DiagonalCandidates N :=
    admissible_subset_diagonal hA hprop
  have hinj : Set.InjOn color (↑A : Set ℕ) := by
    intro a ha b hb hab
    by_contra hne
    have hsquare : Squarefree (a * b + 1) :=
      hcolor a (hdiag ha) b (hdiag hb) hne hab
    exact (hprop a ha b hb) hsquare
  have hcard : (A.image color).card = A.card :=
    Finset.card_image_iff.mpr hinj
  have hsub : A.image color ⊆ (Finset.univ : Finset (Fin k)) := by
    intro x _hx
    exact Finset.mem_univ x
  have hle := Finset.card_le_card hsub
  rw [hcard] at hle
  simpa using hle

/-- If the number of colors is exactly the candidate residue-class cardinality,
a valid coloring proves Erdős #848 for that `N`. -/
theorem validCandidateColoring_implies_erdos848
    {N : ℕ} (color : ℕ → Fin (B7 N).card)
    (hcolor : ValidColoring N (B7 N).card color) :
    Erdos848For N := by
  intro A hA hprop
  exact validColoring_bounds_admissible color hcolor A hA hprop

end Erdos848Exact
