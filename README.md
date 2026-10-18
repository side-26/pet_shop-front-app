# Pet Shop Frontend

A Persian, RTL-first web application for browsing and managing a pet shop. It provides a public storefront for pet products, pets, and care content, alongside authenticated customer journeys and an administrative back office.

The frontend is built with Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/Base UI primitives. It consumes the Pet Shop backend through a typed entity/service layer.

## What it includes

### Public storefront

- Home, about, and care-article experiences.
- Product catalogue with detail pages, brand/category filters, search, featured and popular selections.
- Pet catalogue with type/breed filters and pet detail pages.
- Responsive product, pet, category, brand, article, and carousel components.
- Persian copy, RTL layout, local Iranian Yekan fonts, and light/dark theme support.

### Customer flows

- Registration, login, password recovery, encrypted session handling, and profile management.
- Persistent shopping cart and checkout flow.
- Address and delivery-service selection, map support through Neshan, and payment-result handling.
- Order history and detail views.

## Cart synchronization and payment lifecycle

The cart works for guests and signed-in customers without mixing data between accounts.

1. **Guest cart:** product/weight and pet lines are stored in browser storage. Guest changes are timestamped, and local removals are retained as tombstones so a later sync does not accidentally restore a removed line.
2. **After sign-in:** the authenticated identity is hydrated, then the root `CartSyncInitializer` requests the user's current server cart (outside checkout). Guest-only lines are copied to the server; for a matching line changed in both places, the newer line timestamp wins. A newer local removal deletes the older server line.
3. **Same user, returning session:** the persisted cart is associated with its `cartUserId`. Returning to the same account refreshes and reconciles that account's server cart, retaining pending local work where needed.
4. **Different user protection:** if browser storage belongs to another signed-in account, the local persisted lines and pending operations are discarded before the newly signed-in user's cart is loaded. Guest carts remain eligible for merge because they have no account owner.
5. **Reliable retries:** cart writes carry idempotency keys. Failed authenticated additions are stored as a local outbox and retried when the browser reconnects; simultaneous sync attempts share one in-flight request.

At checkout, the customer selects the required delivery information and requests payment for the prepared order. The application navigates the current tab to the gateway URL returned by the backend. The payment-result route displays the gateway outcome; after a successful payment it empties the server cart, clears local cart state, and redirects the customer to their orders. Failed payments direct the customer back to checkout.

### Administration

- Dashboard and role-aware administrative navigation.
- Management of users, products, pets, pet types, breeds, brands, categories, sub-categories, and articles.
- Server-rendered admin reads with private Cache Components caching and targeted invalidation.

### Engineering foundations

- Feature-oriented `entities/` layer for DTOs, Yup validation, services, Server Actions, and client orchestration.
- Independently streamed sections with Suspense, accessible skeletons, empty states, and error recovery.
- Shared RTL-capable UI primitives in `src/components/ui` and a `/ui-components` visual gallery.
- TanStack Query for approved browser data flows, Zustand for shared client state, and React Hook Form for forms.
- Structured, sanitized browser/server observability and client-error reporting.
- Vitest, React Testing Library, Cypress, Playwright, ESLint, Prettier, and TypeScript validation.

## Architecture at a glance

```text
src/app          Next.js routes, layouts, Route Handlers, and route-local sections
src/components   Shared UI primitives, layouts, and reusable compositions
src/entities     Domain DTOs, schemas, services, Server Actions, and client flows
src/lib          API transport, logging, query infrastructure, and shared helpers
src/configs      Route builders and static application configuration
src/contexts     Cross-tree React context
src/hooks        Reusable client behavior
src/stores       Shared Zustand client state
src/utils        Session, cache, and framework-neutral utility helpers
```

Read the nearest `AGENTS.md` before changing a source area. These guides document ownership, file contracts, and maintenance rules for the core folders.

## Requirements

- Node.js 20 or later
- pnpm 12 (the pinned package manager)
- A running Pet Shop backend reachable through `API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL`
- A Neshan browser API key when map functionality is enabled

## Local setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a local `.env` file with the values supplied by your environment or backend deployment. Do not commit real keys.

   ```dotenv
   API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_SESSION_COOKIE_NAME=pet_shop_auth
   NEXT_PUBLIC_SESSION_SECRET_KEY=replace-with-a-secure-value
   NEXT_PUBLIC_TEMPORARY_SESSION_SECRET_KEY=replace-with-a-secure-value
   NEXT_PUBLIC_CART_STORAGE_KEY=pet_shop_cart
   NEXT_PUBLIC_NESHAN_API_KEY=replace-with-your-neshan-key
   ```

   Optional observability settings include `LOG_LEVEL`, `LOG_SERVICE_NAME`, `LOG_ENVIRONMENT`, `RELEASE_VERSION`, `CLIENT_ERROR_REPORTING_ENABLED`, `NEXT_PUBLIC_CLIENT_ERROR_REPORTING_ENABLED`, and `NEXT_PUBLIC_CLIENT_ERROR_SAMPLE_RATE`.

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Useful routes

| Route                            | Purpose                                                   |
| -------------------------------- | --------------------------------------------------------- |
| `/`                              | Storefront home page                                      |
| `/products` and `/products/list` | Product landing page and catalogue                        |
| `/pets` and `/pets/list`         | Pet landing page and catalogue                            |
| `/articles`                      | Care articles                                             |
| `/cart` and `/cart/checkout`     | Cart and checkout                                         |
| `/profile`                       | Customer profile, orders, and addresses                   |
| `/admin`                         | Administrative dashboard                                  |
| `/ui-components`                 | Shared UI component gallery (not available in production) |

## Commands

| Command                        | Purpose                                       |
| ------------------------------ | --------------------------------------------- |
| `pnpm dev`                     | Start the development server                  |
| `pnpm build`                   | Create a production build                     |
| `pnpm start`                   | Run the production server after a build       |
| `pnpm lint`                    | Run ESLint across the repository              |
| `pnpm format`                  | Format supported files and apply ESLint fixes |
| `pnpm test:unit`               | Run Vitest unit tests                         |
| `pnpm test:integration`        | Run Vitest/RTL integration tests              |
| `pnpm test:component`          | Run Cypress component tests                   |
| `pnpm test:e2e`                | Run Cypress end-to-end tests                  |
| `pnpm test`                    | Run the full test suite                       |
| `pnpm test:core-web-vitals`    | Build and run Core Web Vitals checks          |
| `pnpm test:instant-navigation` | Run client-navigation performance checks      |

## Development conventions

- Use `routePaths` from `src/configs/route.path.ts`; do not duplicate route strings.
- Keep endpoint access in entity services and use Server Actions as the server-rendered component boundary.
- For Promise-backed sections, keep the static wrapper outside Suspense, resolve data with `use(promise)` in a content component, and use the renderer for both resolved and skeleton states.
- Reuse `src/components/ui` primitives. Update `/ui-components` only when a shared component API, behavior, or visual state changes.
- Add focused tests for changed behavior, then run lint, type checking, and the appropriate test suite.

## Notes on secrets and telemetry

Environment files may contain credentials and map/API keys. Keep them outside version control and rotate any value that has been exposed. Logs and client telemetry are intentionally sanitized; never add raw tokens, cookies, session contents, backend payloads, or personally identifiable information to telemetry context.
