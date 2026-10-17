import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettierConfig from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  // Keep this last so Prettier owns all formatting decisions.
  prettierConfig,
  {
    files: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    rules: { 'no-console': 'error' },
  },
  {
    files: ['src/scripts/**'],
    rules: { 'no-console': 'off' },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    // Agent skill snapshots are reference material, not application source.
    '.agents/**',
    '.claude/**',
  ]),
]);

export default eslintConfig;
