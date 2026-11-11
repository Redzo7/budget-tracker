import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Modular monolith boundary: other code may only import a module via its
  // public API ("@/modules/<name>"), never its internals. Inside a module, use
  // relative imports. See docs/architecture/overview.md.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/shared/db/schema.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*/*"],
              message:
                "Import modules only through their public API: '@/modules/<name>' (see docs/architecture/overview.md).",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated / tooling output
    "drizzle/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
