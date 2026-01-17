import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ),
  {
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // React specific rules
      "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }],
      "react/self-closing-comp": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // General code quality
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "eqeqeq": "error",
      
      // Accessibility
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error"
    }
  }
];

export default eslintConfig;
