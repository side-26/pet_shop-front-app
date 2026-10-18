# Source Architecture

`src/` contains the application code for the Pet Shop frontend. Keep dependencies directed from route/UI layers toward entity and infrastructure layers:

```text
app, components → entities → lib, configs, utils
                   hooks, contexts, stores
```

## Core folders

- `app/` — Next.js App Router routes, layouts, route handlers, and route-local components.
- `components/` — shared UI primitives, compositions, layouts, and templates. Read its local `AGENTS.md` before changing shared UI.
- `entities/` — feature/domain DTOs, schemas, API services, Server Actions, and client orchestration.
- `lib/` — cross-cutting infrastructure such as API transport, logging, queries, rich text, and shared helpers.
- `configs/` — static application configuration, route paths, UI constants, and Yup setup.
- `contexts/`, `hooks/`, and `stores/` — cross-route client state, reusable client behavior, and Zustand state.
- `utils/` — framework-neutral helpers for sessions, caching, addresses, and other shared mechanics.
- `test/` — shared test setup and test-only helpers.

## Maintenance

When a change adds, removes, renames, or materially changes a file in a core folder, update that folder's `AGENTS.md` in the same change. Keep its file inventory, ownership, dependency direction, and test guidance current. Do not document implementation details that will immediately become stale.

Read the nearest `AGENTS.md` before editing; its local rules refine this source-level map.
