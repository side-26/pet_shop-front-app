# Layout Components Workflow

## Purpose

This workflow governs:

```text
src/components/layouts/
```

It is intended for **Codex** and **Claude Code**.

Layouts provide reusable application structure and compose the project's UI/common design-system layers.

---

# Position in Architecture

```text
Figma layout/navigation patterns
        ↓
components/ui
        ↓
components/common
        ↓
components/layouts
        ↓
app/**/layout.tsx
        ↓
pages
```

---

# Responsibility

Layout components primarily manage:

```text
application shells
headers
footers
sidebars
navigation regions
responsive structural behavior
content placement
slots/children
```

Examples:

```text
header.tsx
footer.tsx
admin-sidebar.tsx
profile-sidebar.tsx
admin-shell.tsx
profile-shell.tsx
mobile-navigation.tsx
```

Reusable authentication structure lives under `components/layouts/auth` and is
composed by `app/(auth)/layout.tsx`. `AuthLayoutShell` owns the responsive,
RTL-first brand and content regions while nested routes own headings, forms,
validation, actions, and auth business logic. Keep the shell server-rendered;
use the existing CSS/Tailwind motion utilities for entry sequencing unless a
future interaction genuinely requires a focused Client Component. The auth
card uses the shared `Card` glass variant and semantic theme tokens only.

Auth layout behavior is stacked and content-first through tablet widths. Desktop
starts at 1025px and uses a semantic-token scene composed in code, with the auth
content aligned to the logical start (the physical right in RTL). Let the coded
desktop scene extend across the full viewport. Keep the auth form plane in its
1536px desktop coordinate space and anchor that space to the physical left on
wider viewports, so the form does not drift after 1536px. Reference artwork
must not be shipped as the desktop background; use it only to guide the coded scene.
Never use fixed content heights, create fake auth methods/OTP UI, or let
decorative visuals reduce form readability. Preserve short-height scrolling and
reduced-motion behavior.

---

# Next.js Layout Rule

Next.js routing layouts stay in:

```text
src/app/**/layout.tsx
```

Reusable structural implementations may live in:

```text
src/components/layouts/
```

Example:

```tsx
// app/(admin)/admin/layout.tsx

import { AdminShell } from '@/components/layouts/admin-shell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
```

Do not replace Next.js routing layouts with component-folder files.

---

# Design-System Rule

Layouts should compose:

```text
components/ui
components/common
```

Do not independently recreate Button, Sheet, Dialog, navigation-control, or other primitive styling inside layouts.

If Figma specifies a new reusable primitive/variant, implement it in `components/ui` first.

If it specifies a reusable application composition, consider `components/common`.

---

# Figma + MCP Workflow

When implementing a layout from Figma:

1. Inspect the relevant frame/component through Figma MCP.
2. Identify:
   - structural regions
   - responsive behavior
   - navigation patterns
   - spacing/tokens
   - reusable primitives
3. Map primitive UI to `components/ui`.
4. Map application compositions to `components/common`.
5. Keep only structural composition in `components/layouts`.
6. Use project design tokens instead of scattered arbitrary values.
7. Verify mobile and desktop behavior.
8. Add appropriate tests.

Do not blindly generate a monolithic layout from Figma.

---

# Dependencies

Layouts may depend on:

```text
components/ui
components/common
generic hooks
providers
config
navigation helpers
```

They may compose entity components when necessary, but entity business logic must remain in the entity.

---

# Business Logic

Good layout responsibilities:

```text
render sidebar
render navigation
position main content
open/close mobile menu
render children
responsive shell behavior
```

Bad:

```text
calculate cart totals
validate checkout
transform Product DTO
determine delivery eligibility
perform entity API actions
```

---

# Client Boundaries

Prefer Server Components where possible.

Extract interactive pieces:

```text
admin-shell.tsx
→ server-capable structural shell

admin-mobile-menu.tsx
→ client component when interaction requires it
```

Do not turn an entire layout tree into client-side code unnecessarily.

---

# Accessibility

Use semantic landmarks:

```text
<header>
<nav>
<aside>
<main>
<footer>
```

Interactive navigation must support keyboard behavior and accessible names.

Drawers/menus must handle focus appropriately.

---

# Testing Model

## Vitest Integration

Use for meaningful structural/component contracts.

Examples:

```text
shell renders navigation and children
expected landmarks exist
sidebar receives/render navigation items
conditional navigation is displayed from supplied state
```

Naming:

```text
admin-shell.integration.test.tsx
profile-sidebar.integration.test.tsx
```

Do not test static wrappers merely for coverage.

## Cypress Component

Use selectively for interactive layout components whose browser behavior matters.

Strong candidates:

```text
MobileNavigation
ResponsiveHeader
interactive AdminSidebar
drawer-based navigation
collapsible navigation
```

Naming:

```text
mobile-navigation.component.cy.tsx
admin-sidebar.component.cy.tsx
```

Test:

```text
open/close behavior
keyboard navigation
focus
Escape
responsive interaction
pointer interaction
navigation menu visibility
```

Static shells such as:

```text
ContentContainer
simple Footer
non-interactive AdminShell
```

normally do not require Cypress Component tests.

## Cypress E2E

Navigation and layout integration with the real application should be protected through E2E journeys.

Examples:

```text
admin navigates between product/order pages
profile user navigates between orders/addresses
mobile user opens navigation and changes page
```

E2E files live under:

```text
cypress/e2e/
```

---

# Responsive Testing

Do not test every Tailwind class or breakpoint.

Test meaningful behavior differences.

Example:

```text
desktop → sidebar available
mobile → menu trigger available
mobile trigger → navigation drawer opens
```

Cypress Component Testing is appropriate when browser viewport/interaction behavior is central to the component.

---

# tailwind-variants

Use `tailwind-variants` only when the layout component has legitimate reusable variants.

Do not duplicate UI primitive variants at the layout level.

---

# Helpers

Use:

```text
*.helpers.ts
```

not `.utils.ts`.

Pure navigation/layout logic can receive unit tests when warranted.

---

# Agent Workflow

Codex/Claude Code must:

1. Inspect the corresponding Next.js `app/**/layout.tsx`.
2. Inspect Figma through MCP when design-driven.
3. Inspect existing layout/common/UI components.
4. Keep routing responsibility in `app`.
5. Reuse design-system components.
6. Keep business logic outside layouts.
7. Keep client boundaries small.
8. Preserve semantic landmarks/accessibility.
9. Add/update Vitest Integration tests when meaningful.
10. Add/update Cypress Component tests for important interactive browser behavior.
11. Update E2E navigation journeys when application navigation changes.
12. Run relevant tests, typecheck, lint, and build validation.
13. Never weaken existing tests merely to pass CI.

---

# Definition of Done

```text
[ ] Component is structurally owned
[ ] Next.js routing layout remains in app
[ ] Figma structure correctly interpreted
[ ] UI/common components reused
[ ] Design tokens respected
[ ] Business logic remains outside layout
[ ] Client boundary minimized
[ ] Semantic landmarks/accessibility correct
[ ] Vitest Integration coverage appropriate
[ ] Cypress Component coverage added for interactive layout behavior
[ ] E2E navigation updated when relevant
[ ] Existing tests pass
[ ] TypeScript passes
[ ] ESLint passes
[ ] Production build passes when applicable
```
