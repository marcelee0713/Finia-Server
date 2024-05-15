import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        jest: true,
        module: "readonly",
      },
    },
    files: ["src/**/*.ts", "**/*.js"],
    ignores: ["node_modules/", "dist/"],
    rules: {
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-types": "error",
      "no-array-constructor": "off",
      "@typescript-eslint/prefer-as-const": "warn",
    },
  },
];
