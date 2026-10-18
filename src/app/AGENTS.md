# App Router

`app/` owns Next.js routes and route-local composition. Pages should compose feature sections; entity actions/services own data access, and shared UI belongs in `@/components`.

## Contents

- Route groups: `(auth)`, `(default)`, and `(article-preview)` organize public/authenticated presentation without changing URLs.
- Product areas: `admin/`, `cart/`, `order/`, and `payment/` own their route trees and route-local `_components`.
- `api/` contains internal Route Handlers used by browser data flows and observability.
- `core/` contains request middleware and transformation infrastructure.
- `_components/` contains app-wide route composition; `styles/` owns global styles; `ui-components/` is the shared-component gallery.
- Root files `layout.tsx`, `not-found.tsx`, `react-query-provider.tsx`, `instrumentation.ts`, `instrumentation-client.ts`, and `proxy.ts` configure application-wide behavior.

## Rules

- Preserve Server Component defaults. Promise-backed regions must follow the root async-content workflow: wrapper starts the promise, `Suspense` owns skeleton rendering, content resolves it, and the renderer owns resolved and skeleton layouts.
- Use entity Server Actions/services for server reads and mutations; do not call backend endpoints directly from pages or route-local presentation components.
- Keep route-local components under the owning route's `_components`; promote only genuinely reusable UI to `@/components`.
- Keep `ui-components/` current whenever a shared UI component's public contract changes.

## Maintenance

Update this guide whenever a route group, top-level route area, global app file, or ownership boundary changes. Add a more local `AGENTS.md` when a route subtree gains rules that cannot be expressed here.
