import enforceBackendFileNaming from "./rules/enforce-backend-file-naming.js";
import enforceTsxKebabCase from "./rules/enforce-tsx-kebab-case.js";
import enforceTypeNaming from "./rules/enforce-type-naming.js";
import noEntityReturnInRepositories from "./rules/no-entity-return-in-repositories.js";
import noTypesReexportInBarrel from "./rules/no-types-reexport-in-barrel.js";

export const plugin = {
  rules: {
    "enforce-backend-file-naming": enforceBackendFileNaming,
    "enforce-tsx-kebab-case": enforceTsxKebabCase,
    "enforce-type-naming": enforceTypeNaming,
    "no-entity-return-in-repositories": noEntityReturnInRepositories,
    "no-types-reexport-in-barrel": noTypesReexportInBarrel,
  },
};
