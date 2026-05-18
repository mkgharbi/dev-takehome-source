/**
 * @fileoverview Rule to enforce that repositories do not return entities
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce that repositories methods do not return entities",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingReturnType: "All repositories methods must have a return type.",
      noEntityReturnInRepositories:
        "All repositories methods must not return entities.",
    },
  },

  create(context) {
    const filename = context.filename;
    const isRepository = filename.endsWith(".repository.ts");

    if (!isRepository) return {};

    const entityIdentifiers = new Set();

    return {
      ImportDeclaration(node) {
        const sourceValue = node.source.value;
        if (sourceValue.includes("entity")) {
          for (const specifier of node.specifiers) {
            if (
              specifier.type === "ImportSpecifier" ||
              specifier.type === "ImportDefaultSpecifier"
            ) {
              entityIdentifiers.add(specifier.local.name);
            }
          }
        }
      },

      "FunctionDeclaration, MethodDefinition"(node) {
        const returnType = node.value.returnType?.typeAnnotation;
        if (!returnType) {
          if (node.kind === "constructor") return;
          context.report({
            node: node.value,
            messageId: "missingReturnType",
          });
          return;
        }

        const sourceCode = context.sourceCode;
        const typeText = sourceCode.getText(returnType);

        for (const entityId of entityIdentifiers) {
          const regex = new RegExp(`\\b${entityId}\\b`);
          if (regex.test(typeText)) {
            // Allow FindOptionsWhere<Entity> and SelectQueryBuilder<Entity> types
            const allowedTypesRegex = new RegExp(
              `(FindOptionsWhere|FindManyOptions|SelectQueryBuilder|FindOptionsRelations)<[^>]*\\b${entityId}\\b[^>]*>`,
            );
            if (allowedTypesRegex.test(typeText)) {
              continue;
            }

            context.report({
              node: returnType,
              messageId: "noEntityReturnInRepositories",
            });
            return;
          }
        }
      },
    };
  },
};
