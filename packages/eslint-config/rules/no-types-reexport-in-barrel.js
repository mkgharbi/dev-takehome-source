/**
 * @fileoverview Prevents barrel files (index.ts) in @repo/api from re-exporting
 * types/constants/utils files. These should only be exported via constants.ts so
 * that auto-import suggests `@repo/api/constants` instead of `@repo/api`.
 */

"use strict";

const TYPES_PATTERN = /\.(types|constants|utils)$/;

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Prevent barrel files from re-exporting types/constants/utils (use constants.ts instead)",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noTypesReexport:
        "Do not re-export '{{source}}' from barrel files. Types, constants, and utils should only be exported via constants.ts so that auto-import suggests @repo/api/constants.",
    },
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    if (
      !filename.includes("packages/api/src") ||
      !filename.endsWith("index.ts")
    ) {
      return {};
    }

    const check = (node) => {
      const source = node.source?.value;
      if (!source) return;

      if (TYPES_PATTERN.test(source)) {
        context.report({
          node: node.source,
          messageId: "noTypesReexport",
          data: { source },
        });
      }
    };

    return {
      ExportAllDeclaration: check,
      ExportNamedDeclaration: check,
    };
  },
};
