import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module"
      }
    },
    plugins: {
      react
    },
    rules: {
      "react/jsx-uses-vars": "error",
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z]" }],
      "brace-style": "error",
      "comma-dangle": ["error", "never"],
      "indent": ["error", 2],
      "no-eval": "error",
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 0 }],
      "no-trailing-spaces": "error",
      "no-var": "error",
      "prefer-const": ["error"],
      "quotes": ["error", "double"],
      "semi": ["error", "always"]
    }
  }
]);
