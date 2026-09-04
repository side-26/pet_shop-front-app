# Core Web Vitals pre-push tests

`pnpm run test:core-web-vitals` builds the application, starts `next start`, discovers every
`page.tsx` below `src/app`, and measures CLS, INP, and LCP in Chromium using desktop and mobile
profiles. The test uses Next.js's bundled `web-vitals` implementation and gates the standard good
thresholds:

| Metric |   Budget |
| ------ | -------: |
| CLS    |      0.1 |
| INP    |   200 ms |
| LCP    | 2,500 ms |

These are controlled lab gates for regression detection. They do not replace CrUX or first-party RUM
at the 75th percentile and should not be reported as field performance.

The mobile project uses a Pixel 5 viewport, 4× CPU slowdown, and a Slow 4G-style network profile.
The desktop project uses a 1440×900 viewport with lighter network shaping. Reports are written to
`test-results/core-web-vitals/results.json` and `playwright-report/core-web-vitals`.

## First-time setup

```sh
pnpm install
pnpm run core-web-vitals:install
```

The runner automatically uses Google Chrome when it finds a standard installation; otherwise it uses
Playwright's installed Chromium. `CORE_WEB_VITALS_BROWSER_CHANNEL` can explicitly select another
supported Chromium channel.

The Husky `pre-push` hook runs the complete suite automatically. Run it manually while tuning a page:

```sh
pnpm run test:core-web-vitals
```

Set `CORE_WEB_VITALS_RUNS=3` to repeat every route/device sample. Set
`CORE_WEB_VITALS_SETTLE_MS` to change the post-load settling window.

## Route coverage

Static routes are discovered automatically. A dynamic App Router page must have a concrete test URL
in `core-web-vitals.routes.mjs`; route discovery intentionally fails when a fixture is missing. Run
`pnpm run test:core-web-vitals:routes` for a fast discovery check.

The runner creates a short-lived encrypted admin session for `/admin`, `/cart`, and `/checkout` so
those URLs are measured instead of their login redirect. To render authenticated backend data, set
`CORE_WEB_VITALS_ACCESS_TOKEN`, `CORE_WEB_VITALS_REFRESH_TOKEN`, and `CORE_WEB_VITALS_USER_ID` in the
local environment. Without them, protected pages still exercise their production shell and normalized
error/loading behavior.

INP needs a real browser interaction. A page-specific safe selector can be registered in
`routeInteractionSelectors`. Otherwise the runner clicks the first visible non-submit button and uses
a fixed, layout-neutral probe only when the page has no suitable control.
