// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        ignores: [
            'dist',
            'node_modules',
            'eslint.config.mjs',
            'jest.config.js',
            'scripts/generateKeys.mjs',
            'scripts/convertPemToJwk.mjs',
            'tests',
            '*.spec.ts',
            'coverage',
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-console': 'off',
            // 'dot-notation': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
        },
    },
);
