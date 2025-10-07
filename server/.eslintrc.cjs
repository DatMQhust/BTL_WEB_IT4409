module.exports = {
  env: {
    node: true,
    es2021: true,
    commonjs: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/__tests__/**'],
      env: { jest: true }
    }
  ]
};
