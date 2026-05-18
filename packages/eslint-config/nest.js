import { config as base } from "./base.js";

/**
 * ESLint config for the NestJS backend.
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...base,
  {
    languageOptions: {
      globals: {
        node: true,
        jest: true,
      },
    },
  },
  {
    files: ["**/*.repository.ts", "**/*.repository.types.ts"],
    rules: {
      "certalis/enforce-type-naming": "error",
    },
  },
  {
    files: ["**/*.repository.ts"],
    rules: {
      "certalis/no-entity-return-in-repositories": "error",
    },
  },
];

export default config;
