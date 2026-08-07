import Erdos848.ExactStatement

namespace Erdos848Exact

/-- If two naturals are both `7 mod 25`, then `25 ∣ ab+1`. -/
lemma mod25_divisibility (a b : ℕ) (ha : a % 25 = 7) (hb : b % 25 = 7) :
    25 ∣ (a * b + 1) := by
  have hmul : a * b % 25 = (a % 25) * (b % 25) % 25 := Nat.mul_mod a b 25
  rw [ha, hb] at hmul
  have hz : (a * b + 1) % 25 = 0 := by omega
  exact Nat.dvd_of_mod_eq_zero hz

/-- A positive natural divisible by `5²` is not squarefree. -/
lemma not_squarefree_of_dvd_25 {n : ℕ} (_hn : n > 0) (h : 25 ∣ n) : ¬ Squarefree n := by
  intro hsq
  have h25 : (25 : ℕ) = 5 ^ 2 := by norm_num
  rw [h25] at h
  have hunit : IsUnit (5 : ℕ) := hsq 5 h
  have hfive : (5 : ℕ) = 1 := Nat.isUnit_iff.mp hunit
  omega

/-- The proposed residue class really is admissible in the exact interval `{1,…,N}`. -/
theorem B7_has_property (N : ℕ) : NonSquarefreeProductProp (B7 N) := by
  intro a ha b hb
  simp only [B7, Finset.mem_filter] at ha hb
  have hdiv : 25 ∣ (a * b + 1) := mod25_divisibility a b ha.2 hb.2
  exact not_squarefree_of_dvd_25 (Nat.succ_pos _) hdiv

/-- The proposed class is, by definition, a subset of the allowed interval. -/
theorem B7_subset_interval (N : ℕ) : B7 N ⊆ interval N := by
  intro n hn
  exact (Finset.mem_filter.mp hn).1

end Erdos848Exact
