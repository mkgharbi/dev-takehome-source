/**
 * @fileoverview Enforce kebab-case naming for .tsx files in the shared UI package.
 * - All .tsx files in packages/ui/ must use kebab-case (e.g., button.tsx, card.tsx).
 * - Exception: index.tsx.
 */

"use strict";

import path from "path";

function isKebabCase(str) {
  const withoutExt = str.replace(/\.tsx$/, "");
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(withoutExt);
}

const SKIP_PATTERNS = [
  /\.config\.(ts|tsx)$/,
  /\.d\.ts$/,
  /\.test\.(ts|tsx)$/,
  /\.spec\.(ts|tsx)$/,
];

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce kebab-case naming for .tsx files under packages/ui",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      mustBeKebabCase:
        "File '{{filename}}' must use kebab-case naming (e.g., my-component.tsx).",
    },
  },

  create(context) {
    const filename = context.filename;
    const basename = path.basename(filename);

    if (
      !filename.includes("/packages/ui/") &&
      !filename.includes("\\packages\\ui\\")
    ) {
      return {};
    }

    if (SKIP_PATTERNS.some((pattern) => pattern.test(basename))) {
      return {};
    }

    if (basename.endsWith(".tsx")) {
      if (basename === "index.tsx") {
        return {};
      }

      if (!isKebabCase(basename)) {
        return {
          Program(node) {
            context.report({
              node,
              messageId: "mustBeKebabCase",
              data: { filename: basename },
            });
          },
        };
      }
    }

    return {};
  },
};
