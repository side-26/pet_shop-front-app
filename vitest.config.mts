import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const resolve = {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    'server-only': fileURLToPath(
      new URL('./node_modules/next/dist/compiled/server-only/empty.js', import.meta.url),
    ),
  },
  tsconfigPaths: true,
};

export default defineConfig({
  plugins: [react()],
  resolve,
  test: {
    projects: [
      {
        resolve,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['**/*.test.unit.ts'],
        },
      },
      {
        resolve,
        test: {
          name: 'integration',
          environment: 'jsdom',
          include: ['**/*.test.integration.{ts,tsx}'],
        },
      },
    ],
  },
});
