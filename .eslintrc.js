module.exports = {
  root: true,
  plugins: ['@tanstack/query'],
  extends: [
    'universe/native',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/stable-query-client': 'error',
    "react-hooks/rules-of-hooks": "error",
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
