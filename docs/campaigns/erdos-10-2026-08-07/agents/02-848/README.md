# Prompt 2 — Erdős #848 formal verification

This workspace attempts to turn the exact all-`N` Erdős #848 claim into a Lean-kernel-checked theorem.

Start with:

- `statement.md` — exact quantifiers and one-based indexing;
- `STATUS.md` — what is and is not kernel-checked;
- `formal/README.md` — Lean build and trust model;
- `formal/Erdos848/ExactStatement.lean` — canonical Lean proposition;
- `formal/Erdos848/CertificateSemantics.lean` — untrusted-generator / trusted-checker interface;
- `formal/Erdos848/AllNStitch.lean` — exact five-range coverage theorem;
- `verification.md` — proof acceptance rules;
- `verdict.md` — current campaign label.

The public all-N candidate is treated as a roadmap and source of candidate certificates, not as a trusted theorem. The branch must stay below a full-proof label until the five load-bearing range propositions are themselves kernel-closed.

Draft PR: #11 into `agent/erdos-10-campaign-2026-08-07`.
