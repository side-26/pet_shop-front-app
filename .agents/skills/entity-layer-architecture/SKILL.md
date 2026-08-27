---
name: entity-layer-architecture
description: Design, implement, refactor, or review feature and entity layers in this Next.js project. Use for DTOs, schemas, helpers, services, Server Actions, customFetcher calls, authentication tokens, cache policy and invalidation, client-side toast/navigation handling, error contracts, or unit/integration/regression testing of an entity flow.
---

# Entity Layer Architecture

Enforce this default dependency flow:

```text
Client UI -> Server Action -> Entity Service -> customFetcher -> Backend API
```

Allow Server Components and Route Handlers to call an entity service directly when no Server Action boundary is needed. Treat the action as an adapter, not the owner of the service.

## Inspect before changing code

1. Read the entity, its consumers, `src/lib/api/customFetcher.ts`, and nearby tests.
2. Read the relevant installed Next.js guide in `node_modules/next/dist/docs/` before using Server Actions, caching, or invalidation APIs. Do not rely on remembered Next.js behavior. Load `entity-service-action-workflow` for this repository's required `EntityTag` cache and mutation-invalidation convention; that more specific skill owns cache placement when both apply.
3. Follow the repository `AGENTS.md`. For UI work, also load `shadcn-pet-ui-component`; for routed navigation, also load `manage-route-paths`; for test implementation, load the applicable testing skill.
4. Preserve established project conventions unless they violate the boundaries below.

## Assign one owner to each responsibility

### DTO

- Model backend request and response wire contracts.
- Keep transport contracts separate from forms, UI view models, and action results.
- Do not weaken DTOs to manufacture skeleton or test data.

### Schema

- Validate every untrusted action input at the server boundary.
- Infer input types from the schema when practical and avoid parallel handwritten types.
- Remember that shape validation is not authentication, authorization, or ownership validation.

### Helpers

- Keep helpers pure, deterministic, domain-specific, and independently testable.
- Use helpers for mapping, normalization, and calculations shared within the entity.
- Search before adding a helper. Consolidate duplicates under the narrowest shared owner.
- Move genuinely cross-entity utilities to an appropriate shared module; do not create a miscellaneous helper bucket.
- Keep HTTP, session, cache, toast, navigation, and React behavior out of helpers.

### Service

- Implement entity use cases and business rules.
- Call `customFetcher` and choose endpoint, method, typed body, parsers, and declarative auth/cache options.
- Map transport results into stable domain or use-case outcomes when callers should not depend on transport details.
- Keep the service server-only where appropriate with `import 'server-only'`; do not mark service functions as Server Actions.
- Do not toast, navigate, render, or use browser APIs.
- Do not manually read the session or construct an Authorization header when `customFetcher({ auth: true })` owns token injection.

### Server Action

- Use `'use server'` only at the action boundary.
- Treat every action as a remotely callable, untrusted entry point.
- Validate input, authenticate and authorize as required, call one or more services, and return a minimal serializable result for the client.
- Keep actions thin. Do not duplicate endpoint calls, response normalization, or business rules from services.
- Perform Next.js mutation orchestration here when it is presentation delivery behavior: cache invalidation, refresh, or server redirect. Keep domain decisions in the service.
- Never return secrets, raw session data, or unnecessary backend records.

### Client orchestration

- Own browser-only effects: toast, focus, local pending state, field-error display, and route navigation.
- Interpret typed action outcomes instead of parsing exception strings.
- Use centralized route paths and accessible pending/error behavior.
- Keep business decisions out of event handlers. The service/action result should expose the condition; the client decides how to present it.

### customFetcher

- Own URL/query construction, serialization, HTTP headers, token injection, timeout/network handling, response parsing, and transport-level error normalization.
- Select authentication declaratively with `auth: true`; authenticated/user-specific requests must remain `no-store` unless a reviewed design explicitly provides safe private caching.
- Default every request to `cache: 'no-store'`. Make caching an explicit opt-in for data proven safe to cache; never depend on Next.js's implicit fetch default.
- When the fetcher exposes a boolean no-store option, default it to `true`. Only an explicit `false` or explicit cache policy may enable caching, and the resulting fetch options must not combine `no-store` with revalidation settings.
- Require one or more cache tags whenever a read opts into persistent caching. Tags on `no-store` requests do not create cached data and therefore provide nothing to invalidate.
- Define each entity's cache tags once with the shared `EntityTag` class from `src/utils/entityCache.ts`. Reuse one module-level instance in its service for cached-read registration and successful mutation invalidation; do not scatter string literals or create a parallel tag registry.
- Invalidate only after a successful mutation result and choose the narrowest complete combination of list, detail, or all scopes. The Server Action calls the service and must not repeat service-owned invalidation.
- `EntityTag` invalidation delegates to `updateTag`, so invalidating mutation services must execute within a Server Action. Route Handlers require a separately reviewed `revalidateTag` design because `updateTag` is not legal there.
- Keep endpoint-specific business interpretation in the entity service, not the generic fetcher.

Use a module-level tag owner shaped like this, adapting names to the entity:

```ts
const productCache = new EntityTag('products');
```

Register cached reads with `productCache.registerList(queryKey)` or `productCache.registerDetail(id)`. After a successful mutation, invalidate the affected scopes with `invalidateList()`, `invalidateDetail(id)`, or `invalidateAll()` inside the service.

## Use explicit result contracts

Prefer discriminated unions across action/client boundaries:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      kind: 'validation' | 'unauthorized' | 'forbidden' | 'backend' | 'network' | 'timeout';
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
```

Adapt the union to the use case. Keep discriminants stable and exhaustive. Do not expose raw thrown errors or make the client recognize backend message text. Use exceptions for exceptional/control-flow behavior, not routine expected outcomes.

## Keep dependencies pointed inward

- Client code may depend on action contracts, not service internals or backend DTOs.
- Actions may depend on schemas and services.
- Services may depend on DTOs, schemas/parsers, entity helpers, and `customFetcher`.
- Generic transport code must not import an entity, action, or UI module.
- Prevent circular imports. Split contracts into server-safe modules when a client needs their types.

## Test behavior by layer

Do not unit-test TypeScript types at runtime. Run TypeScript checking, and add compile-time tests only for contracts whose inference or invalid states need protection.

### Unit tests

- Schemas: accepted, rejected, boundary, and normalization cases.
- Helpers: representative inputs, edge cases, invariants, and regressions.
- Services: every business branch and mapping; mock the `customFetcher` boundary rather than global `fetch`.
- Actions: invalid input, authentication/authorization, service invocation, serialization, and invalidation decisions; mock services.
- Client orchestration: toast, field errors, navigation, pending state, and retry behavior; mock actions.

### Integration tests

- Test `customFetcher` separately against mocked HTTP responses for headers, token behavior, serialization, cache options, parsing, timeout, network, backend, and invalid-response cases.
- Test each meaningful entity flow across real adjacent layers while mocking only the external backend or browser boundary.
- Cover success, validation failure, empty/alternate outcome, unauthorized/forbidden, backend rejection, timeout/network failure, and relevant cache invalidation.
- Prefer flow-focused tests over one integration test per function.

### Component and end-to-end tests

- Use component tests for form wiring, visible errors, accessibility, pending interactions, toast calls, and navigation requests.
- Reserve Cypress end-to-end coverage for critical user journeys and previously escaped regressions.
- Add a focused regression test next to the lowest layer that can reproduce each fixed defect.

## Completion gate

1. Confirm every concern has one owner and no business rule or error normalization is duplicated.
2. Confirm authenticated requests obtain tokens only through the shared transport/session mechanism.
3. Confirm action input is validated and authorization is enforced independently of UI visibility.
4. Confirm `no-store` is the explicit default, every cached read opts in, and private data is not shared-cached.
5. Confirm every cached read and successful mutation reuse the entity service's module-level `EntityTag`; do not accept duplicate tag strings, direct cache primitives, or parallel registries.
6. Confirm client effects are absent from server modules and services are not exported as actions.
7. Add or update tests in proportion to changed behavior, including default `no-store`, cache opt-in, shared tags, invalidation, and a regression test for a bug fix.
8. Run typecheck (or `tsc --noEmit` if no script exists), lint, applicable Vitest/Cypress suites, and the production build as required by `AGENTS.md`.
