import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';

import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { EncryptJWT } from 'jose';

import { dynamicRouteFixtures, routeInteractionSelectors } from '../../core-web-vitals.routes.mjs';
import { discoverAppRoutesSync } from '../../scripts/core-web-vitals/discover-routes.mjs';

type MetricName = 'CLS' | 'INP' | 'LCP';
type MetricResult = { name: MetricName; value: number; rating: string };
type MetricMap = Partial<Record<MetricName, MetricResult>>;
type DeviceProfile = 'desktop' | 'mobile';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const nextDirectory = path.dirname(require.resolve('next/package.json'));
const webVitalsSource = readFileSync(
  path.join(nextDirectory, 'dist/compiled/web-vitals/web-vitals.js'),
  'utf8',
);
const routes = discoverAppRoutesSync({ dynamicRouteFixtures });
const protectedRoutePrefixes = ['/admin', '/cart', '/checkout'];
const thresholds: Record<MetricName, number> = { CLS: 0.1, INP: 200, LCP: 2_500 };

const profiles = {
  desktop: {
    cpuSlowdown: 1,
    latency: 40,
    downloadThroughput: (10 * 1024 * 1024) / 8,
    uploadThroughput: (5 * 1024 * 1024) / 8,
  },
  mobile: {
    cpuSlowdown: 4,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  },
} as const;

function metricsInitScript() {
  return `(() => {
    const module = { exports: {} };
    const exports = module.exports;
    const __dirname = '';
    ${webVitalsSource}
    const { onCLS, onINP, onLCP } = module.exports;
    const metrics = {};
    globalThis.__PETSHOP_CORE_WEB_VITALS__ = metrics;
    const record = ({ name, value, rating }) => {
      metrics[name] = { name, value, rating };
    };
    onCLS(record, { reportAllChanges: true });
    onINP(record, { reportAllChanges: true, durationThreshold: 0 });
    onLCP(record, { reportAllChanges: true });

    const addProbe = () => {
      if (!document.body || document.getElementById('__petshop-cwv-interaction-probe')) return;
      const probe = document.createElement('button');
      probe.id = '__petshop-cwv-interaction-probe';
      probe.type = 'button';
      probe.tabIndex = -1;
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = 'position:fixed;inset:auto 0 0 auto;width:1px;height:1px;opacity:0.001;border:0;padding:0;';
      document.body.append(probe);
    };
    document.addEventListener('DOMContentLoaded', addProbe, { once: true });
    addProbe();
  })();`;
}

function isProtectedRoute(pathname: string) {
  return protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function createAdminSessionCookie(baseURL: string) {
  const secret = process.env.NEXT_PUBLIC_SESSION_SECRET_KEY;
  const cookieName = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME;
  if (!secret || !cookieName) throw new Error('Core Web Vitals session environment is missing.');

  const now = Date.now();
  const key = createHash('sha256').update(secret).digest();
  const value = await new EncryptJWT({
    accessExp: now + 60 * 60 * 1_000,
    accessToken: process.env.CORE_WEB_VITALS_ACCESS_TOKEN ?? 'cwv-test-access-token',
    refreshToken: process.env.CORE_WEB_VITALS_REFRESH_TOKEN ?? 'cwv-test-refresh-token',
    role: 'admin',
    sessionExp: now + 2 * 60 * 60 * 1_000,
    userId: process.env.CORE_WEB_VITALS_USER_ID ?? '000000000000000000000001',
  })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(key);

  return { name: cookieName, value, url: baseURL, httpOnly: true, sameSite: 'Strict' as const };
}

async function applyDeviceThrottling(context: BrowserContext, page: Page, profile: DeviceProfile) {
  const client = await context.newCDPSession(page);
  const settings = profiles[profile];

  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: settings.latency,
    downloadThroughput: settings.downloadThroughput,
    uploadThroughput: settings.uploadThroughput,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: settings.cpuSlowdown });
}

async function runInteraction(page: Page, pathname: string, routeTemplate: string) {
  const configuredSelector =
    routeInteractionSelectors[pathname as keyof typeof routeInteractionSelectors] ??
    routeInteractionSelectors[routeTemplate as keyof typeof routeInteractionSelectors];

  if (configuredSelector) {
    const configuredTarget = page.locator(configuredSelector).first();
    await expect(configuredTarget, `Configured interaction target for ${pathname}`).toBeVisible();
    await configuredTarget.click();
    return;
  }

  const safeButton = page
    .locator('button[type="button"]:not([disabled]):not(#__petshop-cwv-interaction-probe)')
    .filter({ visible: true })
    .first();

  if ((await safeButton.count()) > 0) {
    await safeButton.click();
    return;
  }

  await page.locator('#__petshop-cwv-interaction-probe').click({ force: true });
}

async function readMetrics(page: Page): Promise<MetricMap> {
  return page.evaluate(() => {
    const metricsGlobal = globalThis as typeof globalThis & {
      __PETSHOP_CORE_WEB_VITALS__?: MetricMap;
    };
    return JSON.parse(JSON.stringify(metricsGlobal.__PETSHOP_CORE_WEB_VITALS__ ?? {}));
  });
}

for (const route of routes) {
  test(`${route.pathname} (${route.sourceFile}) stays within Core Web Vitals budgets`, async ({
    context,
    page,
    baseURL,
  }, testInfo) => {
    if (!baseURL) throw new Error('The Core Web Vitals base URL is not configured.');

    const profile = testInfo.project.metadata.coreWebVitalsProfile as DeviceProfile;
    await page.addInitScript({ content: metricsInitScript() });
    await applyDeviceThrottling(context, page, profile);

    if (isProtectedRoute(route.pathname)) {
      await context.addCookies([await createAdminSessionCookie(baseURL)]);
    }

    const response = await page.goto(route.pathname, { waitUntil: 'load' });
    expect(response, `No document response received for ${route.pathname}`).not.toBeNull();
    expect(response?.status(), `Unexpected HTTP status for ${route.pathname}`).toBeLessThan(400);
    expect(
      new URL(page.url()).pathname,
      `Unexpected redirect while testing ${route.pathname}`,
    ).toBe(route.pathname);

    await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);
    await page.waitForTimeout(Number(process.env.CORE_WEB_VITALS_SETTLE_MS ?? 1_500));
    await runInteraction(page, route.pathname, route.routeTemplate);

    await expect
      .poll(async () => Object.keys(await readMetrics(page)).sort(), {
        message: `Waiting for CLS, INP, and LCP on ${route.pathname}`,
        timeout: 8_000,
      })
      .toEqual(['CLS', 'INP', 'LCP']);

    const metrics = await readMetrics(page);
    await testInfo.attach('core-web-vitals.json', {
      body: JSON.stringify({ profile, route, metrics, thresholds }, null, 2),
      contentType: 'application/json',
    });

    const failures = (Object.entries(thresholds) as [MetricName, number][]).flatMap(
      ([name, maximum]) => {
        const value = metrics[name]?.value;
        if (typeof value !== 'number') return [`${name} was not reported`];
        return value <= maximum ? [] : [`${name} ${value.toFixed(3)} > ${maximum}`];
      },
    );

    expect(failures, `${profile} budgets failed for ${route.pathname}`).toEqual([]);
  });
}
