module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['eslint-plugin-tsdoc', 'prettier', '@typescript-eslint', 'simple-import-sort'],
  extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'tsdoc/syntax': 'warn',
    'no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', { useTabs: false }],
    'no-unused-vars': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1 }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'all',
        // argsIgnorePattern: '^_',
      },
    ],
  },
};
