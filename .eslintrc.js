module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true,
    },
  },
  ignorePatterns: ['node_modules/**/*'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['prettier', 'simple-import-sort'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'react/prop-types': 'off',
    'max-len': ['error', { code: 180, ignoreComments: true, ignoreTrailingComments: true, ignoreStrings: true }],
  },
  overrides: [
    {
      files: ['./src/interfaces/*'],
      rules: {
        '@typescript-eslint/camelcase': [0],
      },
    },
  ],
};
