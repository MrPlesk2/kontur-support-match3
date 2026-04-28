import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "ImportDeclaration[source.value=/\\.(js|jsx|ts|tsx)$/]",
          message: 'Do not include file extensions in import paths.',
        },
        {
          selector: "ExportAllDeclaration[source.value=/\\.(js|jsx|ts|tsx)$/]",
          message: 'Do not include file extensions in export paths.',
        },
        {
          selector: "ExportNamedDeclaration[source.value=/\\.(js|jsx|ts|tsx)$/]",
          message: 'Do not include file extensions in export paths.',
        },
        {
          selector: "ImportExpression[source.value=/\\.(js|jsx|ts|tsx)$/]",
          message: 'Do not include file extensions in import paths.',
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
