# Internal API Boundary

Apply these rules only to the browser -> internal Route Handler -> external backend flow described by the
parent skill. Inspect the existing implementations before editing them; preserve their established types,
envelope handling, and route conventions.

## Security and server boundary

- The browser calls only same-origin `/api` routes through `internalFetcher`. It relies on HTTP-only cookies;
  it must never construct a backend `Authorization` header or import session/server-only utilities.
- Route Handlers make authorization decisions on the server. A browser-provided `auth` flag is not evidence
  of authorization. Protected backend calls use the server fetcher's authenticated mode by default; use a
  public mode only for an endpoint explicitly intended to be public.
- Preserve the application's CSRF protections for state-changing cookie-authenticated routes.
- Return only the existing safe error shape. Never serialize access or refresh tokens, internal URLs,
  sensitive backend detail, or stacks.

## Transport and error behavior

- Reuse the project's `internalFetcher`, server `customFetcher`, and Route Handler wrapper. Do not call the
  external backend from a client service or reimplement shared parsing/error normalization per route.
- `fetch` resolving does not mean a request succeeded. Preserve a real upstream HTTP status through the
  route/error contract, including 400, 401, 403, 404, 422, and 5xx. Treat an explicitly unsuccessful
  application envelope as a failure even if its upstream response is 2xx, according to the shared contract.
- When no upstream HTTP response exists, use the application's documented gateway/timeout behavior rather
  than inventing a backend status.
- Keep intentional TanStack Query cancellation distinguishable from timeout and network failures. Do not
  swallow it into a generic client error.
- Services receive successful data after the internal fetcher has unwrapped it; they should not return a
  result union merely because the server fetcher uses one internally.

## Boundary test matrix

Cover the portions affected by the change:

- protected requests use server-side session/auth handling and no token becomes client-visible;
- public endpoints are explicitly public;
- upstream HTTP and application failures produce the existing safe status/error contract;
- network and timeout failures follow the established fallback policy;
- the client fetcher unwraps success, throws/returns the existing normalized failure type, and propagates an
  abort signal;
- services return raw wire data, while optional `select` projection returns the expected client DTOs;
- query keys vary with all request-driving inputs, mutations invalidate only relevant cached queries, and
  Suspense/Error Boundary retry behavior works at the actual UI boundary.
