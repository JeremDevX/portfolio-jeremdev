import nextConfig from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextConfig,
  {
    rules: {
      // Disable this rule as it's too strict for animation state management
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
