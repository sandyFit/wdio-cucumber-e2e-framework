import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import * as wdio from 'eslint-plugin-wdio';
import globals from 'globals';

export default [
    {
        ignores: [
            'node_modules/**',
            'reports/**',
            'api-tests/**',
            'public/contrib/**',
            'dist/**',
            'coverage/**'
        ]
    },
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,

                // ESLint should not flag WebdriverIO globals
                browser: 'readonly',
                $: 'readonly',
                $$: 'readonly',
                expect: 'readonly'
            }
        },
        plugins: {
            wdio
        },
        rules: {
            ...js.configs.recommended.rules,
            ...prettier.rules,

            'no-console': 'warn',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'indent': ['error', 4],
            'max-len': ['warn', { code: 126 }]
        }
    }
];
