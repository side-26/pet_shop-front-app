import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';

import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { EncryptJWT } from 'jose';

import {
  dynamicRouteFixtures,
  routeContentSelectors,
  routeInteractionSelectors,
} from '../../core-web-vitals.routes.mjs';
import { discoverAppRoutesSync } from '../../scripts/core-web-vitals/discover-routes.mjs';

type MetricName = 'CLS' | 'INP' | 'LCP';
type MetricResult = { name: MetricName; value: number; rating: string };
type MetricMap = Partial<Record<MetricName, MetricResult>>;
type DeviceProfile = 'desktop' | 'mobile' | 'tablet';
type InteractiveTarget = {
  name: string;
  selector: string;
  type: 'button' | 'link' | 'other';
};
type InteractionTiming = {
  duration: number;
  interactionId: number;
  name: string;
  startTime: number;
};

const require = createRequire(path.join(process.cwd(), 'package.json'));
const nextDirectory = path.dirname(require.resolve('next/package.json'));
const webVitalsSource = readFileSync(
  path.join(nextDirectory, 'dist/compiled/web-vitals/web-vitals.js'),
  'utf8',
);
const routes = discoverAppRoutesSync({ dynamicRouteFixtures });
const protectedRoutePrefixes = ['/admin', '/cart', '/checkout', '/profile'];
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
  tablet: {
    cpuSlowdown: 2,
    latency: 100,
    downloadThroughput: (5 * 1024 * 1024) / 8,
    uploadThroughput: (2 * 1024 * 1024) / 8,
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
    globalThis.__PETSHOP_INTERACTION_TIMINGS__ = [];
    const record = ({ name, value, rating }) => {
      metrics[name] = { name, value, rating };
    };
    onCLS(record, { reportAllChanges: true });
    onINP(record, { reportAllChanges: true, durationThreshold: 0 });
    onLCP(record, { reportAllChanges: true });

    if (PerformanceObserver.supportedEntryTypes.includes('event')) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.interactionId) continue;
          globalThis.__PETSHOP_INTERACTION_TIMINGS__.push({
            duration: entry.duration,
            interactionId: entry.interactionId,
            name: entry.name,
            startTime: entry.startTime,
          });
        }
      }).observe({ type: 'event', buffered: true, durationThreshold: 0 });
    }

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

async function createSessionCookie(baseURL: string, role: 'admin' | 'customer') {
  const secret = process.env.NEXT_PUBLIC_SESSION_SECRET_KEY;
  const cookieName = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME;
  if (!secret || !cookieName) throw new Error('Core Web Vitals session environment is missing.');

  const now = Date.now();
  const key = createHash('sha256').update(secret).digest();
  const value = await new EncryptJWT({
    accessExp: now + 60 * 60 * 1_000,
    accessToken: process.env.CORE_WEB_VITALS_ACCESS_TOKEN ?? 'cwv-test-access-token',
    refreshToken: process.env.CORE_WEB_VITALS_REFRESH_TOKEN ?? 'cwv-test-refresh-token',
    role,
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
    await configuredTarget.scrollIntoViewIfNeeded();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
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

async function readInteractionTimings(page: Page): Promise<InteractionTiming[]> {
  return page.evaluate(() => {
    const timingsGlobal = globalThis as typeof globalThis & {
      __PETSHOP_INTERACTION_TIMINGS__?: InteractionTiming[];
    };
    return JSON.parse(JSON.stringify(timingsGlobal.__PETSHOP_INTERACTION_TIMINGS__ ?? []));
  });
}

async function discoverInteractiveTargets(page: Page): Promise<InteractiveTarget[]> {
  return page.evaluate(() => {
    const selector = [
      'button:not([disabled])',
      'a[href]',
      '[role="button"]:not([aria-disabled="true"])',
      'input[type="button"]:not([disabled])',
      'input[type="submit"]:not([disabled])',
      'summary',
    ].join(',');
    const isVisible = (element: Element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.pointerEvents !== 'none' &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const cssPath = (element: Element) => {
      const segments: string[] = [];
      let current: Element | null = element;
      while (current && current !== document.body) {
        const tag = current.tagName.toLowerCase();
        let index = 1;
        let sibling = current.previousElementSibling;
        while (sibling) {
          if (sibling.tagName === current.tagName) index += 1;
          sibling = sibling.previousElementSibling;
        }
        segments.unshift(`${tag}:nth-of-type(${index})`);
        current = current.parentElement;
      }
      return `body > ${segments.join(' > ')}`;
    };
    const accessibleName = (element: Element) => {
      const labelledBy = element.getAttribute('aria-labelledby');
      const labelledByText = labelledBy
        ?.split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim())
        .filter(Boolean)
        .join(' ');
      return (
        element.getAttribute('aria-label') ??
        labelledByText ??
        element.textContent?.replace(/\s+/g, ' ').trim() ??
        element.tagName.toLowerCase()
      );
    };

    return Array.from(document.querySelectorAll(selector))
      .filter(
        (element) =>
          element.id !== '__petshop-cwv-interaction-probe' &&
          !element.closest('[aria-busy="true"], .skeleton') &&
          isVisible(element),
      )
      .map((element) => ({
        name: accessibleName(element),
        selector: cssPath(element),
        type: element.matches('a[href]')
          ? 'link'
          : element.matches('button, input[type="button"], input[type="submit"]')
            ? 'button'
            : 'other',
      }));
  });
}

async function prepareCartInteractionPage(
  context: BrowserContext,
  page: Page,
  baseURL: string,
  profile: DeviceProfile,
) {
  await page.addInitScript({ content: metricsInitScript() });
  await page.addInitScript(() => {
    document.addEventListener(
      'click',
      (event) => {
        if ((event.target as Element | null)?.closest('a[href]')) event.preventDefault();
      },
      true,
    );
  });
  await applyDeviceThrottling(context, page, profile);
  await context.addCookies([await createSessionCookie(baseURL, 'admin')]);

  // Quantity and removal controls are included in INP coverage, but benchmark runs
  // must never change the account/cart represented by the optional test credentials.
  await page.route('**/*', async (route) => {
    const method = route.request().method();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      await route.abort('blockedbyclient');
      return;
    }
    await route.continue();
  });
}

async function visitCart(page: Page) {
  const response = await page.goto('/cart', { waitUntil: 'load' });
  expect(response, 'No document response received for /cart').not.toBeNull();
  expect(response?.status(), 'Unexpected HTTP status for /cart').toBeLessThan(400);
  await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);
  await page.waitForTimeout(Number(process.env.CORE_WEB_VITALS_SETTLE_MS ?? 1_500));
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
      await context.addCookies([
        await createSessionCookie(
          baseURL,
          route.pathname.startsWith('/profile') ? 'customer' : 'admin',
        ),
      ]);
    }

    const response = await page.goto(route.pathname, { waitUntil: 'load' });
    expect(response, `No document response received for ${route.pathname}`).not.toBeNull();
    expect(response?.status(), `Unexpected HTTP status for ${route.pathname}`).toBeLessThan(400);
    expect(
      new URL(page.url()).pathname,
      `Unexpected redirect while testing ${route.pathname}`,
    ).toBe(route.pathname);

    const contentSelector =
      routeContentSelectors[route.pathname as keyof typeof routeContentSelectors] ??
      routeContentSelectors[route.routeTemplate as keyof typeof routeContentSelectors];
    if (contentSelector) {
      await expect(
        page.locator(contentSelector).first(),
        `Expected detail content for ${route.pathname}, not the route fallback`,
      ).toBeVisible();
    }

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

test.describe('/cart INP interaction coverage', () => {
  test('measures every visible clickable control without mutating the cart', async ({
    browser,
    baseURL,
  }, testInfo) => {
    if (!baseURL) throw new Error('The Core Web Vitals base URL is not configured.');

    const profile = testInfo.project.metadata.coreWebVitalsProfile as DeviceProfile;
    const discoveryContext = await browser.newContext({
      ...testInfo.project.use,
      baseURL,
    });
    const discoveryPage = await discoveryContext.newPage();
    await prepareCartInteractionPage(discoveryContext, discoveryPage, baseURL, profile);
    await visitCart(discoveryPage);
    const targets = await discoverInteractiveTargets(discoveryPage);
    await discoveryContext.close();

    expect(targets, 'No visible clickable controls were found on /cart.').not.toEqual([]);

    const results: Array<
      InteractiveTarget & { inp: number | null; status: 'measured' | 'not-reported' }
    > = [];

    for (const target of targets) {
      await test.step(`${target.type}: ${target.name}`, async () => {
        const context = await browser.newContext({ ...testInfo.project.use, baseURL });
        const page = await context.newPage();
        try {
          await prepareCartInteractionPage(context, page, baseURL, profile);
          await visitCart(page);

          const locator = page.locator(target.selector);
          await expect(locator, `Clickable control disappeared: ${target.name}`).toBeVisible();
          await locator.scrollIntoViewIfNeeded();
          const timingCount = (await readInteractionTimings(page)).length;
          await locator.click();
          await page.waitForTimeout(350);

          const newTimings = (await readInteractionTimings(page)).slice(timingCount);
          const interactionGroups = new Map<number, InteractionTiming[]>();
          for (const timing of newTimings) {
            const group = interactionGroups.get(timing.interactionId) ?? [];
            group.push(timing);
            interactionGroups.set(timing.interactionId, group);
          }
          const latestInteraction = Array.from(interactionGroups.values())
            .sort((left, right) => right[0].startTime - left[0].startTime)[0]
            ?.reduce((maximum, timing) => Math.max(maximum, timing.duration), 0);

          results.push({
            ...target,
            inp: latestInteraction ?? null,
            status: latestInteraction === undefined ? 'not-reported' : 'measured',
          });
          expect(
            latestInteraction,
            `No Event Timing entry was reported for ${target.type} “${target.name}”.`,
          ).toBeDefined();
          expect(
            latestInteraction,
            `INP budget failed for ${target.type} “${target.name}”.`,
          ).toBeLessThanOrEqual(thresholds.INP);
        } finally {
          await context.close();
        }
      });
    }

    await testInfo.attach('cart-inp-interactions.json', {
      body: JSON.stringify(
        { profile, route: '/cart', threshold: thresholds.INP, results },
        null,
        2,
      ),
      contentType: 'application/json',
    });
  });
});
