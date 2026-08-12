import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: '**/**/**.cy.ts',
    excludeSpecPattern: ['node_modules/**', '.next/**'],
    supportFile: 'cypress/support/e2e.ts',
  },
});
