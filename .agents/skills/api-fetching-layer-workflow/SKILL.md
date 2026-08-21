---
name: api-fetching-layer-workflow
description: Implement, edit, or review API-backed entity flows in this Next.js project. Use whenever adding or changing endpoint fetching, DTOs, schemas, services, Server Actions, client form orchestration, backend error handling, success toasts, redirects, or submit loading behavior.
---

# API Fetching Layer Workflow

Keep API-backed forms split by responsibility and keep route components presentation-only.

## Inspect first

1. Read `AGENTS.md`, the affected entity, consumers, `customFetcher`, shared error handling, route paths, and nearby tests.
2. Read the installed Next.js guide before using Server Actions, redirects, caching, or invalidation.
3. Load `entity-layer-architecture`; for forms or UI states also load `shadcn-pet-ui-component`.

## Required layers

- **DTO (`*.dto.ts`)**: Define request and response wire contracts. Preserve backend `TData`, including `null`.
- **Schema (`*.schema.ts`)**: Own every form validation rule, validation message, normalization, and inferred input type. Components must not declare Yup/Zod rules or duplicate form types.
- **Service (`*.service.ts`)**: Call `customFetcher` with explicit endpoint, method, typed body, auth, and cache policy. Keep it server-only and free of toast, redirect, and React behavior.
- **Server Action (`*.actions.ts`)**: Revalidate untrusted input with the entity schema, call the service, and own server redirects or invalidation. Keep `redirect()` outside caught control flow.
- **Client (`*.client.ts`)**: Own submit handlers/hooks, form refs, field-error setters, action calls, success-toast timing, and client-to-action orchestration. On failure, pass the complete fetcher error directly to `globalErrorHandler`; do not inspect its message or duplicate its field-error behavior.
- **Component**: Render the shared `Form`, fields, and visual states. Consume the schema and a client-layer hook/handler. Do not call actions, toast, redirect, normalize errors, or own submit orchestration.

Dependency direction:

```text
Component -> client hook -> Server Action -> service -> customFetcher
                  |              |
                schema         schema
```

## Form rules

1. Export the schema and infer the form input type from it.
2. Pass that schema to the shared `Form`; validate again in the Server Action.
3. Keep form refs and `setError` plumbing in the client layer.
4. Pass form submission state to the shared Button through `isLoading` and its required `loadingText`. Button owns busy behavior and replaces its children; do not render loading Spinner or conditional loading text at the call site.
5. Use Button's `block` prop for full-width form actions instead of passing `tw:w-full` through `className`.

## Messages and navigation

- On failure, call `globalErrorHandler(error, { showErrorFields })` once. It owns the error toast and server field messages.
- On success, pass the server message directly to the success toast with the requested timeout; do not add a redundant truthiness guard when the endpoint contract supplies the message.
- If the success message must remain visible before a server redirect, wait for the toast duration in the client layer, then call a dedicated Server Action that executes `redirect(PATHS....)`.
- Use centralized paths; never inline route literals.

## Completion gate

1. Confirm validation exists only in the schema layer and is enforced server-side.
2. Confirm client orchestration is absent from the component.
3. Confirm auth and cache are explicit on every fetch.
4. Confirm errors flow unchanged into `globalErrorHandler`.
5. Confirm loading uses Button's `isLoading` plus required `loadingText`, and full width uses `block`.
6. Test schema boundaries, service options, action validation/redirect, client toast/error behavior, and form loading rendering.
7. Run typecheck, lint, focused Vitest/Cypress tests, and the production build.
