---
name: dynamic-dialog-data-architecture
description: Create, refactor, or review data-fetching dynamic dialogs in this Next.js project with an imperative controller, fixed header, scrollable streamed content, and a local skeleton Suspense boundary. Use when a dialog fetches its own read data; do not use for static or mutation-only dialogs.
---

# Dynamic Dialog Data Architecture

Use this architecture when a dynamically loaded dialog fetches data inside its own flow. Also follow the repository `AGENTS.md`, `shadcn-pet-ui-component`, `composition-component-architecture`, and the applicable API/entity workflow skill. Read the installed Next.js documentation before changing Cache Components, `next/dynamic`, Client Component, Server Action, or Suspense behavior.

## Boundaries and ownership

Split the implementation into focused components:

- **Controller:** owns the dialog's `open` state and exposes `open()` and `close()` through `forwardRef` and `useImperativeHandle`. Consumers use the imperative ref rather than receiving controlled state props. The controller clears request state on close when reopening must fetch fresh data.
- **Dialog shell:** renders the shared dialog primitive and structural layout only. Keep it statically imported; dynamically load only the data content when code splitting is useful.
- **Header:** when present, includes at least the dialog title and a close icon button. Give the header `tw:flex-none` so it never shrinks while the content scrolls.
- **Main content:** lives in its own component and owns only its typed data request/result presentation. It does not own dialog visibility, title, or close controls.

Use a column layout whose main content region has `tw:flex-auto tw:overflow-auto`. Do not make the full dialog scroll when a header is present.

## Streamed cached content

The main-content component is a Cache Component and must be inside a narrow `Suspense` boundary with a layout-preserving skeleton fallback. Start the request before rendering the boundary; do not await it before the boundary.

Choose cache scope from the data contract:

- Use `'use cache: private'` for authenticated, user-specific, tenant-specific, or otherwise sensitive data.
- Use `'use cache'` only for public data that is safe to share across users.

Keep cache policy at the service layer and retain the repository's transport-cache rules. The content component receives and awaits/consumes the typed Promise, then renders success, empty, and normalized error states. Do not fetch server-capable data with `useEffect` or make the dialog shell a Client Component solely to handle loading.

## Loading contract

Render loading and resolved content through the same renderer or layout-compatible view model. The fallback must apply the global `.skeleton` class to its outer content region, set `aria-busy`, and disable all skeleton interactions. Do not create a duplicate skeleton dialog, header, or body markup.

## Verification

When this architecture changes, cover:

- imperative `open()` and `close()` behavior;
- fixed header and independently scrollable main region;
- skeleton, loaded, empty, and normalized error states;
- disabled skeleton interactions and stable layout;
- appropriate private versus shared cache selection.

Run the focused tests plus TypeScript, ESLint, and the production build before completing the related implementation.
