import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  eslintConfigPrettier,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    files: ["test/**/*"],
    ignores: ["node_modules/", "dist/"],
    rules: {
      "no-unused-vars": "off",
      "no-console": "warn",
      "no-empty": "warn",
      "@typescript-eslint/ban-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
    env: {
      "jest/globals": true,
    },
  },
];
