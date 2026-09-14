import globals from 'globals'
import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
    {
        // Build output. backend/www is gitignored here and rebuilt by CI, but a
        // developer who has run a build still has it on disk, and linting a
        // minified bundle says nothing about this source.
        ignores: ['backend/www/**', 'backend/target/**'],
    },
    js.configs.recommended,
    {
        // Both extensions, matching the webpack resolver, even though every
        // frontend file is currently .js -- so the first .jsx added here is
        // linted rather than quietly skipped the way an .eslintrc would.
        files: ['frontend/**/*.{js,jsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            parser: babelParser,
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                babelOptions: {
                    presets: ['@babel/preset-react'],
                },
                requireConfigFile: false,
            },
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/prop-types': 0,
            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            // eslint 9 flips no-unused-vars' `caughtErrors` default from 'none'
            // to 'all', so an unused catch binding now reports. The third
            // pattern extends the repo's existing `^_` convention to catch
            // bindings rather than rewriting source to suit a changed default.
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
        },
    },
]
