import { config } from "@repo/eslint-config/next";

export default [
  ...config,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
