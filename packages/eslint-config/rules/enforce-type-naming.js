/**
 * @fileoverview Enforce type naming conventions for repository output types
 * Repository output types should be named:
 * - <Entity>ForGet, <Entity>ForList, <Entity>ForCreate, <Entity>ForUpdate, etc.
 * - Base<Entity> for base entity types
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
      description:
        "Enforce type naming conventions for repository output types (<Entity>For<UseCase>)",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      invalidTypeName:
        "Type '{{name}}' in {{location}} does not follow naming convention. Use '<Entity>For<UseCase>' (e.g., AssetForGet, UserForList) or 'Base<Entity>' for base types.",
    },
  },

  create(context) {
    const filename = context.filename;
    const isRepositoryFile = filename.endsWith(".repository.ts");

    // Check if this is a repository type file
    // Repository type files follow the pattern: <entity>.repository.type.ts
    const isRepositoryTypeFile = filename.endsWith(".repository.type.ts");

    // Only apply to repository type files and repository files
    if (!isRepositoryTypeFile && !isRepositoryFile) return {};

    const location = isRepositoryTypeFile ? "type file" : "repository";

    return createTypeCheckers(context, location);
  },
};

/**
 * Check if type name follows conventions
 */
function isValidTypeName(name) {
  // Explicitly excluded types (Request-related)
  if (/^Request(User|WithUser)$/.test(name)) {
    return true;
  }

  // Pattern 1: <Entity>For<UseCase> (e.g., AssetForGet, UserForList)
  if (/^[A-Z][a-zA-Z]*For[A-Z][a-zA-Z]*$/.test(name)) {
    return true;
  }

  // Pattern 2: Base<Entity> (e.g., BaseAsset, BaseUser)
  if (/^Base[A-Z][a-zA-Z]*$/.test(name)) {
    return true;
  }

  // Pattern 3: <Entity>AllBaseRelations (special case)
  if (/^[A-Z][a-zA-Z]*AllBaseRelations$/.test(name)) {
    return true;
  }

  // Pattern 4: <Entity>With<Details> (e.g., EmployeeWithAllDetails, AttributionWithAllDetails)
  if (/^[A-Z][a-zA-Z]*With[A-Z][a-zA-Z]*$/.test(name)) {
    return true;
  }

  // Pattern 5: <Entity>To<Action> (e.g., TrainingToUpdateSettings, TrainingToAddPastSession)
  if (/^[A-Z][a-zA-Z]*To[A-Z][a-zA-Z]*$/.test(name)) {
    return true;
  }

  // Pattern 6: <Entity>After<Action> (e.g., OrderAfterCreated, UserAfterRegistration)
  if (/^[A-Z][a-zA-Z]*After[A-Z][a-zA-Z]*$/.test(name)) {
    return true;
  }

  // Pattern 7: <Entity>Created/Updated/Deleted (e.g., OrderCreated, UserUpdated)
  if (
    /^[A-Z][a-zA-Z]*(Created|Updated|Deleted|Published|Archived)$/.test(name)
  ) {
    return true;
  }

  // Pattern 8: Created<Entity> (e.g., CreatedOrder, CreatedUser)
  if (
    /^(Created|Updated|Deleted|Published|Archived)[A-Z][a-zA-Z]*$/.test(name)
  ) {
    return true;
  }

  return false;
}

/**
 * Create type checkers for the given context and location
 */
function createTypeCheckers(context, location) {
  return {
    // Check exported type aliases
    "ExportNamedDeclaration > TSTypeAliasDeclaration"(node) {
      const typeName = node.id?.name;

      // Skip generic utility types like Partial, Pick, Omit results
      if (!typeName) return;

      if (!isValidTypeName(typeName)) {
        context.report({
          node: node.id,
          messageId: "invalidTypeName",
          data: {
            name: typeName,
            location,
          },
        });
      }
    },

    // Check exported interfaces (less common but should follow similar rules)
    "ExportNamedDeclaration > TSInterfaceDeclaration"(node) {
      const interfaceName = node.id?.name;

      if (!interfaceName) return;

      // Interfaces are less strict - only enforce for repository files
      if (location === "repository" && !isValidTypeName(interfaceName)) {
        context.report({
          node: node.id,
          messageId: "invalidTypeName",
          data: {
            name: interfaceName,
            location,
          },
        });
      }
    },
  };
}
