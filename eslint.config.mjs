import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // This helper "transforms" the old config into the new flat format
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"), // Optional: if using TS
  {
    // Your custom rules here
    rules: {
      "no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;