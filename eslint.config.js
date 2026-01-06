const js = require("@eslint/js");
const globals = require("globals");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
      },
    },
    rules: {
      "no-underscore-dangle": ["error", { allow: ["_id"] }],
      "no-unused-vars": ["error", { argsIgnorePattern: "next", caughtErrorsIgnorePattern: "^_|err" }],
    },
  },
  {
    ignores: ["node_modules/**"],
  },
];
