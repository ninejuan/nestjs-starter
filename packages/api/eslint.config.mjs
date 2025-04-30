import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  { plugins: { '@stylistic': stylistic } },
  {
    rules: {
      '@stylistic/array-bracket-newline': [
        'error',
        { multiline: true, minItems: 3 },
      ],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      'array-element-newline': [
        'error',
        {
          ArrayExpression: 'consistent',
          ArrayPattern: { minItems: 3 },
        },
      ],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/arrow-spacing': [
        'error',
        {
          after: true,
          before: true,
        },
      ],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/brace-style': [
        'error',
        'stroustrup',
        { allowSingleLine: true },
      ],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/computed-property-spacing': ["error", "never", { "enforceForClassMembers": true }],
      '@typescript-eslint/no-explicit-any': ['off', {}],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
    linterOptions: {},
  },
  pluginJs.configs.recommended,
  stylistic.configs.recommended,
  ...tseslint.configs.recommended,
];
