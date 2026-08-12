import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['**/*.test.unit.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'jsdom',
          include: ['**/*.test.integration.ts'],
        },
      },
    ],
  },
});
