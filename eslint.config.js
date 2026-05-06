import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Disallow hover-based visual effects (per project design rule: no hover/click reveals).
// Flags: hover:scale-*, hover:opacity-*, hover:translate-*, hover:-translate-*,
//        group-hover:* (any), and hover:shadow-* transform/opacity reveals.
// Allowed (functional, not decorative): hover:text-*, hover:bg-*, hover:border-*, hover:underline.
const HOVER_FORBIDDEN_RE =
  /(?:^|\s)(?:group-hover\/[\w-]+:|group-hover:)[\w[\].\/-]+|(?:^|\s)hover:(?:scale-|opacity-|-?translate-|shadow-)[\w[\].\/-]+/;

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
        {
          selector: `Literal[value=/${HOVER_FORBIDDEN_RE.source}/]`,
          message:
            "Hover-only reveal effects are forbidden (no group-hover, hover:scale, hover:opacity, hover:translate, hover:shadow). Make the effect always visible instead.",
        },
        {
          selector: `TemplateElement[value.raw=/${HOVER_FORBIDDEN_RE.source}/]`,
          message:
            "Hover-only reveal effects are forbidden (no group-hover, hover:scale, hover:opacity, hover:translate, hover:shadow). Make the effect always visible instead.",
        },
      ],
    },
  },
  {
    // shadcn/ui primitives: leave their default hover affordances alone.
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: { "no-restricted-syntax": "off" },
  },
);
