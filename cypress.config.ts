import { defineConfig } from 'cypress';

process.env.PETSHOP_CYPRESS_COMPONENT_TEST = 'true';

export default defineConfig({
  allowCypressEnv: false,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.component.cy.tsx',
    supportFile: 'cypress/support/component.tsx',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: '**/**/**.cy.ts',
    excludeSpecPattern: ['node_modules/**', '.next/**'],
    supportFile: 'cypress/support/e2e.ts',
  },
});
