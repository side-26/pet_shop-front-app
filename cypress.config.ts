import { defineConfig } from 'cypress';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const backendDirectory = resolve(process.cwd(), '../pet_shop-backend-app');
const requireBackendDependency = createRequire(resolve(backendDirectory, 'package.json'));
const dotenv = requireBackendDependency('dotenv') as {
  config(options: { path: string }): void;
};

dotenv.config({ path: resolve(backendDirectory, '.env') });

const e2eDatabaseUri = process.env.MONGODB_E2E_URI ?? process.env.MONGODB_URI;
const registerRateLimitKeyPattern = 'rate-limit:users:POST:/api/users/register:*';

async function deleteE2ERegisteredUser(phoneNumber: string) {
  if (!/^09\d{9}$/.test(phoneNumber)) {
    throw new Error('Refusing to delete an E2E user with an invalid phone number.');
  }

  if (!e2eDatabaseUri) {
    throw new Error('MONGODB_E2E_URI or MONGODB_URI is required to clean up E2E users.');
  }

  const mongoose = requireBackendDependency('mongoose') as {
    connect(uri: string): Promise<unknown>;
    connection: {
      collection(name: string): { deleteOne(filter: { phoneNumber: string }): Promise<unknown> };
    };
    disconnect(): Promise<void>;
  };

  await mongoose.connect(e2eDatabaseUri);
  try {
    await mongoose.connection.collection('users').deleteOne({ phoneNumber });
  } finally {
    await mongoose.disconnect();
  }

  return null;
}

async function resetE2ERegisterRateLimit() {
  const { createClient } = requireBackendDependency('redis') as {
    createClient(options?: { url?: string; socket?: { host: string; port: number } }): {
      connect(): Promise<void>;
      del(keys: string[]): Promise<number>;
      isOpen: boolean;
      quit(): Promise<void>;
      scanIterator(options: { MATCH: string }): AsyncIterable<string[]>;
    };
  };
  const redisUrl = process.env.REDIS_URL?.trim();
  const configuredPort = Number.parseInt(process.env.REDIS_PORT ?? '', 10);
  const client = createClient(
    redisUrl
      ? { url: redisUrl }
      : {
          socket: {
            host: process.env.REDIS_HOST?.trim() || '127.0.0.1',
            port: Number.isInteger(configuredPort) ? configuredPort : 6379,
          },
        },
  );

  await client.connect();
  try {
    const keys: string[] = [];
    for await (const batch of client.scanIterator({ MATCH: registerRateLimitKeyPattern })) {
      keys.push(...batch);
    }
    if (keys.length) await client.del(keys);
  } finally {
    if (client.isOpen) await client.quit();
  }

  return null;
}

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
    setupNodeEvents(on) {
      on('task', { deleteE2ERegisteredUser, resetE2ERegisterRateLimit });
    },
  },
});
