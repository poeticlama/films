import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'vite.config.ts'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,

  prettierConfig,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
      '@stylistic': stylistic,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...prettierPlugin.configs.recommended.rules,

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',

      'no-console': 'warn',
      'eqeqeq': 'warn',
      'no-else-return': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'curly': ['error', 'all'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-shadow-restricted-names': 'error',

      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: ['enum', 'interface', 'type'] },
        { blankLine: 'always', prev: ['enum', 'interface', 'type'], next: '*' },
      ],

      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]