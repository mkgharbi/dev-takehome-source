/**
 * @fileoverview Enforce file naming conventions based on module structure.
 * Files should follow these patterns:
 * - Controllers: *.controller.ts (in controllers/)
 * - Services: *.service.ts (in services/)
 * - Repositories: *.repository.ts (in repositories/)
 * - Entities: *.entity.ts (in entities/)
 * - Mappers: *.mapper.ts (in mappers/)
 * - Modules: *.module.ts (in module root)
 * - DTOs: *.dto.ts (in dto/ or in packages/api/)
 */

"use strict";

import path from "path";

/**
 * @type {import('eslint').Rule.RuleModule}
 */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce file naming conventions based on module structure",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      invalidFileName:
        "File '{{filename}}' in '{{directory}}' directory should follow the naming pattern '*.{{suffix}}.ts'.",
      invalidDirectoryUsage:
        "File with suffix '{{suffix}}' should be in a '{{expectedDir}}' directory.",
    },
  },

  create(context) {
    const filename = context.filename;
    const basename = path.basename(filename);
    const dirname = path.dirname(filename);
    const dirbasename = path.basename(dirname);

    if (
      basename.includes(".spec.") ||
      basename.includes(".test.") ||
      basename === "index.ts" ||
      basename.endsWith(".module.ts")
    ) {
      return {};
    }

    const directorySuffixMap = {
      controllers: ["controller"],
      services: ["service"],
      repositories: ["repository"],
      entities: ["entity"],
      mappers: ["mapper"],
      dto: ["dto"],
    };

    const suffixDirectoryMap = {};
    for (const [dir, suffixes] of Object.entries(directorySuffixMap)) {
      for (const suffix of suffixes) {
        suffixDirectoryMap[suffix] = suffixDirectoryMap[suffix] || [];
        suffixDirectoryMap[suffix].push(dir);
      }
    }

    if (directorySuffixMap[dirbasename]) {
      const expectedSuffixes = directorySuffixMap[dirbasename];
      const hasValidSuffix = expectedSuffixes.some((suffix) =>
        basename.endsWith(`.${suffix}.ts`),
      );

      if (!hasValidSuffix) {
        return {
          Program(node) {
            context.report({
              node,
              messageId: "invalidFileName",
              data: {
                filename: basename,
                directory: dirbasename,
                suffix: expectedSuffixes.join("' or '"),
              },
            });
          },
        };
      }
    }

    for (const [suffix, expectedDirs] of Object.entries(suffixDirectoryMap)) {
      const pattern = `.${suffix}.ts`;

      if (basename.endsWith(pattern)) {
        const isInCorrectDir = expectedDirs.some((dir) =>
          dirname.includes(`/${dir}`),
        );

        if (!isInCorrectDir) {
          if (suffix === "dto" && dirname.includes("/packages/api/")) {
            continue;
          }

          return {
            Program(node) {
              context.report({
                node,
                messageId: "invalidDirectoryUsage",
                data: {
                  suffix,
                  expectedDir: expectedDirs.join("' or '"),
                },
              });
            },
          };
        }
      }
    }

    return {};
  },
};
