# Entity Layer

`entities/` owns domain-specific integration and contracts. Each entity directory—for example `products/`, `pets/`, `orders/`, `landing/`, or `users/`—keeps its DTOs, validation schemas, service calls, Server Actions, and client orchestration together.

## Standard files

- `*.dto.ts` — backend response/request shapes and entity-facing types.
- `*.schema.ts` — Yup validation and typed input derivation.
- `*.service.ts` — server-only endpoint access through `customFetcher`, cache policy, and invalidation tags.
- `*.actions.ts` — Server Action boundary: validate untrusted input, authorize if needed, and unwrap results for server-rendered reads.
- `*.client.ts` — browser-only mutation/query orchestration when an entity needs it.
- Colocated `*.test.*` files — entity contract and integration coverage.

## Rules

- Keep backend URLs and transport calls in services; components call entity actions or the approved client-fetch layer.
- Preserve the service cache policy. `customFetcher` remains transport-level `no-store`; entity services own Cache Components directives, `cacheLife`, and `EntityTag` registration.
- Server-rendered actions return valid typed data or throw user-safe errors. Do not leak `FetcherResult` into section components.
- Keep schemas, DTOs, services, actions, and tests synchronized whenever an endpoint contract changes.

## Maintenance

Update this guide when the common entity file contract, cache rules, or available entity directories change. Add a local entity `AGENTS.md` when its domain has additional workflow or authorization rules.
