import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { defineConfig, devices } from '@playwright/test';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const requireFromNext = createRequire(require.resolve('next/package.json'));
const { loadEnvConfig } = requireFromNext('@next/env') as {
  loadEnvConfig: (directory: string, dev?: boolean) => void;
};

loadEnvConfig(process.cwd(), false);

process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ??= 'petshop-cwv-session';
process.env.NEXT_PUBLIC_SESSION_SECRET_KEY ??= 'petshop-core-web-vitals-test-secret';

const port = Number(process.env.CORE_WEB_VITALS_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${port}`;
const repeatEach = Number(process.env.CORE_WEB_VITALS_RUNS ?? 1);
const installedChromePaths = {
  darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
  linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ],
} as const;
const installedChrome =
  installedChromePaths[process.platform as keyof typeof installedChromePaths]?.some(existsSync);
const browserChannel =
  process.env.CORE_WEB_VITALS_BROWSER_CHANNEL || (installedChrome ? 'chrome' : undefined);

export default defineConfig({
  testDir: './tests/core-web-vitals',
  outputDir: './test-results/core-web-vitals/artifacts',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  repeatEach: Number.isInteger(repeatEach) && repeatEach > 0 ? repeatEach : 1,
  timeout: 45_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['json', { outputFile: './test-results/core-web-vitals/results.json' }],
    ['html', { outputFolder: './playwright-report/core-web-vitals', open: 'never' }],
  ],
  use: {
    baseURL,
    browserName: 'chromium',
    channel: browserChannel,
    headless: true,
    ignoreHTTPSErrors: false,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `pnpm start --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { ...process.env, NODE_ENV: 'production' },
  },
  projects: [
    {
      name: 'desktop-chromium',
      metadata: { coreWebVitalsProfile: 'desktop' },
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-chromium',
      metadata: { coreWebVitalsProfile: 'mobile' },
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
});
