// Next 16 removed `next lint`, and `next build` no longer lints. Linting is now
// plain ESLint against the flat configs eslint-config-next ships natively —
// the old FlatCompat shim crashed against v16, which meant nothing had been
// linted since the upgrade.
//
// See node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  // eslint-config-next ignores these by default; re-stating them keeps the
  // list visible when this config grows its own ignores.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
