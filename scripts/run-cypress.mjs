import { readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

const ignoredDirectories = new Set(['.git', '.next', 'node_modules']);

async function findCypressSpec(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.cy.ts')) {
      return true;
    }

    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      if (await findCypressSpec(join(directory, entry.name))) {
        return true;
      }
    }
  }

  return false;
}

if (!(await findCypressSpec(process.cwd()))) {
  console.log('No Cypress E2E specs found; skipping E2E tests.');
  process.exit(0);
}

const cypress = spawn(process.execPath, ['node_modules/cypress/bin/cypress', 'run', '--e2e'], {
  stdio: 'inherit',
});

cypress.on('exit', (code) => process.exit(code ?? 1));
