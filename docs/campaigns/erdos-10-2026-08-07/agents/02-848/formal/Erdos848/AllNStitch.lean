import Erdos848.ExactStatement

namespace Erdos848Exact

/-- A closed interval of `N` values on which the exact Erdős #848 upper bound holds. -/
def HoldsOn (lo hi : ℕ) : Prop :=
  ∀ N : ℕ, lo ≤ N → N ≤ hi → Erdos848For N

/-- A tail on which the exact Erdős #848 upper bound holds. -/
def HoldsFrom (lo : ℕ) : Prop :=
  ∀ N : ℕ, lo ≤ N → Erdos848For N

/--
The exact arithmetic stitch used by the public all-`N` candidate.

This theorem proves only the *coverage logic*: if each of the five advertised
components establishes the exact `Erdos848For` proposition on its stated range,
then the canonical positive-`N` conjecture follows. No component theorem is
silently assumed.
-/
theorem allN_of_candidate_five_ranges
    (hFinite : HoldsOn 1 100000006)
    (hLower : HoldsOn 100000000 1000000000)
    (hShort : HoldsOn 1000000000 1000000000000)
    (hMiddle : HoldsOn 1000000000000 264000000000000000)
    (hHigh : HoldsFrom 264000000000000000) :
    Erdos848AllN := by
  intro N hNpos
  by_cases h1 : N ≤ 100000006
  · exact hFinite N hNpos h1
  by_cases h2 : N ≤ 1000000000
  · have hlo : 100000000 ≤ N := by omega
    exact hLower N hlo h2
  by_cases h3 : N ≤ 1000000000000
  · have hlo : 1000000000 ≤ N := by omega
    exact hShort N hlo h3
  by_cases h4 : N ≤ 264000000000000000
  · have hlo : 1000000000000 ≤ N := by omega
    exact hMiddle N hlo h4
  · have hlo : 264000000000000000 ≤ N := by omega
    exact hHigh N hlo

/-- The same stitch exposed as five explicit proof obligations. This is the
formal completion checklist for turning the candidate into a kernel theorem. -/
theorem allN_iff_five_range_suffices
    (hFinite : HoldsOn 1 100000006)
    (hLower : HoldsOn 100000000 1000000000)
    (hShort : HoldsOn 1000000000 1000000000000)
    (hMiddle : HoldsOn 1000000000000 264000000000000000)
    (hHigh : HoldsFrom 264000000000000000) :
    ∀ N : ℕ, 1 ≤ N → Erdos848For N :=
  allN_of_candidate_five_ranges hFinite hLower hShort hMiddle hHigh

end Erdos848Exact
