# Shared Infrastructure

`lib/` contains shared infrastructure that does not belong to one business entity.

## Contents

- `api/` — `customFetcher`, request normalization, API error/result contracts, and server API helpers.
- `logging/` — safe browser/server observability, request IDs, sanitization, and log contracts.
- `query/` — shared TanStack Query client configuration and query utilities.
- `rich-text.ts` and `transform.ts` — reusable data transformation utilities.
- `utils.ts` — framework-level helpers such as `cn`, result unwrapping, and common composition helpers.

## Rules

- Keep infrastructure entity-neutral and avoid importing route components or entity-specific business rules.
- Mark server-only modules with `server-only`; never expose credentials, raw backend errors, cookies, or authorization headers through client-reachable code or logs.
- Logging must be non-blocking and must not change application behavior. In particular, prerender-time paths cannot read dynamic clocks or other request-time values merely to emit telemetry.
- Add focused tests for shared contracts because changes here have a broad blast radius.

## Maintenance

Update this guide when a subfolder, public infrastructure API, or dependency-direction rule changes. Add a nested guide for a subsystem with its own operational constraints.
