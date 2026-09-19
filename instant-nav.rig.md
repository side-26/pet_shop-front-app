# instant-nav rig: Pet Shop frontend

- BUILD: `EXPOSE_TESTING_API=1 pnpm build` followed by `pnpm start --hostname 127.0.0.1 --port 3101`.
- EXPOSE: `EXPOSE_TESTING_API=1` enables `experimental.exposeTestingApiInProductionBuild`; normal production builds leave it disabled.
- RUN: `pnpm exec playwright test --config=playwright.instant-navigation.config.ts` against `http://127.0.0.1:3101`.
- TEST USER: anonymous customer; no login is required for catalog navigation. Rating eligibility is expected to be read-only for this user.
- DRIFT: authentication cookie, purchase history, prior product rating, catalog seed data, and backend availability.
- LOOP: local production build → start on port 3101 → Playwright; fully agent-drivable when the backend and system Chrome are available.
- LIVENESS: not applicable; the rig serves the freshly completed local build.
- WALLS: Playwright CDN access is unavailable in this location, so the rig uses the installed Google Chrome channel. The backend must contain `product-0de16436`.
