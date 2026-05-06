import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Disallow hover-based visual effects (per project design rule: no hover/click reveals).
// Flags any group-hover: variant, plus hover:scale-, hover:opacity-, hover:translate-, hover:shadow-.
// Allowed (functional, non-decorative): hover:text-, hover:bg-, hover:border-, hover:underline.
const FORBIDDEN_HOVER_PATTERN =
  "(group-hover|hover:scale-|hover:opacity-|hover:translate-|hover:-translate-|hover:shadow-)";

const message =
  "Hover-only reveal effects are forbidden (no group-hover, hover:scale, hover:opacity, hover:translate, hover:shadow). Make the effect always visible instead.";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=/${FORBIDDEN_HOVER_PATTERN}/]`, message },
        { selector: `TemplateElement[value.raw=/${FORBIDDEN_HOVER_PATTERN}/]`, message },
      ],
    },
  },
  {
    // shadcn/ui primitives keep their default hover affordances.
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": "off" },
  },
);
