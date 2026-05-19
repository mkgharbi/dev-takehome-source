import { config } from "@repo/eslint-config/next";

export default [
  ...config,
  {
    settings: {
      "import/ignore": ["@testing-library/react"],
    },
  },
];
