import Lake
open Lake DSL

package erdos where
  leanOptions := #[
    ⟨`autoImplicit, false⟩,
    ⟨`pp.unicode.fun, true⟩,
  ]

require mathlib from git
  "https://github.com/leanprover-community/mathlib4.git" @ "v4.27.0"

@[default_target]
lean_lib Erdos where
  roots := #[`Erdos]
  globs := #[.one `Erdos, .submodules `Erdos848, .one `ErdosBanger848]
