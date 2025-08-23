import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
    plugins: { js },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
    },
    extends: [prettierConfig],
    ignores: ["node_modules"],
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
]);
