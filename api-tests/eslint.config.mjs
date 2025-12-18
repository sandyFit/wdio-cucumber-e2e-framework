import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: [
            'node_modules/**',
            'reports/**'
        ]
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                // Node.js globals
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                console: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',

                // Mocha globals
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                after: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',

                // Chai globals
                expect: 'readonly',
                should: 'readonly',
                assert: 'readonly'
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            ...prettier.rules,

            'no-console': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'indent': ['error', 2],
            'max-len': ['warn', { code: 100 }]
        }
    }
];
