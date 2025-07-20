module.exports = {
  root: true,
  extends: ["react-app", "react-app/jest"],
  rules: {
    // Enterprise Code Quality Rules - File Length Limit (STRICT)
    "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
    // Function Length - More realistic for React components
    "max-lines-per-function": ["error", { max: 80, skipBlankLines: true, skipComments: true }],
    complexity: ["error", 15],
    "max-depth": ["error", 4],
    "max-params": ["error", 4],

    // Basic Code Quality
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",

    // Import rules - enforce absolute imports using @ alias
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../*", "./*", "!./*.css", "!./*.scss", "!./*.sass", "!./*.less"],
            message: "Relative imports are not allowed. Use absolute imports with @ alias instead.",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx"],
      rules: {
        "max-lines": "off",
        "max-lines-per-function": "off",
      },
    },
  ],
};
