import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import onlyWarn from "eslint-plugin-only-warn";
import tseslint from "typescript-eslint";

import { plugin as customRules } from "./custom-rules.js";

/**
 * Shared ESLint base config.
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["error", { allow: ["warn", "error", "debug"] }],
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: [
            ["external", "builtin"],
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: false },
        },
      ],
      eqeqeq: ["error"],
      "max-depth": ["warn", 4],
    },
  },
  {
    plugins: { certalis: customRules },
    rules: {
      "certalis/enforce-backend-file-naming": "error",
    },
  },
  {
    files: ["**/index.ts"],
    rules: {
      "certalis/no-types-reexport-in-barrel": "error",
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "certalis/enforce-tsx-kebab-case": "error",
    },
  },
  { plugins: { onlyWarn } },
  {
    ignores: [
      "dist/**",
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "**/next-env.d.ts",
    ],
  },
];

export default config;
