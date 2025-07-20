module.exports = {
  // Line formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // String formatting
  singleQuote: true,
  quoteProps: "as-needed",

  // Object/Array formatting
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,

  // JSX formatting
  jsxSingleQuote: true,

  // Statement formatting
  semi: true,

  // Line endings
  endOfLine: "lf",

  // File inclusion
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200,
      },
    },
    {
      files: "*.md",
      options: {
        printWidth: 80,
        proseWrap: "always",
      },
    },
  ],
};
