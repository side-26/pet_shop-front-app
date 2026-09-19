import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/instant-navigation',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3101',
    channel: 'chrome',
    locale: 'fa-IR',
  },
  webServer: {
    command: 'EXPOSE_TESTING_API=1 pnpm build && pnpm start --hostname 127.0.0.1 --port 3101',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
