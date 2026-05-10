import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'coverage', 'eslint.config.mjs', 'prisma.config.ts', 'vitest.config.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      local: {
        rules: {
          'no-line-comments': {
            meta: {
              type: 'problem',
              docs: { description: 'Disallow line comments (//)' },
              schema: [],
            },
            create(context) {
              return {
                Program() {
                  const sourceCode = context.sourceCode;
                  const comments = sourceCode.getAllComments();
                  comments.forEach((comment) => {
                    if (comment.type === 'Line') {
                      context.report({
                        loc: comment.loc,
                        message: 'Use block comments (/* ... */) instead of line comments (//) for professional code.',
                      });
                    }
                  });
                },
              };
            },
          },
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSAnyKeyword',
          message: 'Explicit "any" type is not allowed. Use a specific interface or "unknown".',
        },
        {
          selector: 'TSAsExpression > TSAnyKeyword',
          message: 'Type assertion "as any" is not allowed. Use a more specific type.',
        },
      ],
      'local/no-line-comments': 'error',
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    // Overrides for test files
    files: ['tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-syntax': 'off',
    },
  }
);
