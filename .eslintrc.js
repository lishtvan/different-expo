module.exports = {
  root: true,
  plugins: ['@tanstack/query'],
  extends: ['universe/native', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/stable-query-client': 'error',
  },
};
