# UI Components Workflow

## Purpose

This workflow governs:

```text
src/components/ui/
```

It is intended for **Codex** and **Claude Code**.

This folder is the frontend implementation of the project's design-system primitives.

The expected pipeline is:

```text
Figma Design System
        ↓
Figma MCP
        ↓
shadcn/ui
        ↓
Tailwind CSS tokens
        ↓
tailwind-variants
        ↓
components/ui
```

---

# Responsibility

A UI component must be domain-neutral.

Ask:

> Could this component be used without knowing what Product, Pet, Cart, Order, User, Address, or Auth means?

If yes, it may belong here.

Examples:

```text
button.tsx
input.tsx
textarea.tsx
checkbox.tsx
select.tsx
dialog.tsx
sheet.tsx
tooltip.tsx
badge.tsx
card.tsx
tabs.tsx
accordion.tsx
skeleton.tsx
spinner.tsx
```

Domain components belong under:

```text
entities/<entity>/components/
```

---

# shadcn/ui Rule

Prefer using or adapting an existing shadcn/ui primitive before creating a new primitive from scratch.

Once a shadcn component is added to this repository, treat it as project-owned source code.

It must follow:

```text
Figma design system
project tokens
Tailwind conventions
tailwind-variants conventions
accessibility requirements
testing requirements
```

Do not repeatedly reinstall/overwrite customized components without inspecting existing modifications.

---

# Figma Implementation Workflow

For a Figma-driven component:

1. Inspect the exact design-system component through Figma MCP.
2. Identify its variants and states.
3. Identify token usage:
   - colors
   - spacing
   - typography
   - radius
   - shadows
4. Compare against existing project tokens.
5. Reuse existing tokens whenever possible.
6. Use shadcn/Radix primitive behavior where applicable.
7. Implement supported visual variants using `tailwind-variants`.
8. Keep unsupported one-off page styles outside the primitive.
9. Verify accessibility and browser behavior.
10. Add tests.

Do not blindly paste generated MCP output.

---

# tailwind-variants

Use `tailwind-variants` for reusable variant/state APIs.

Typical dimensions:

```text
variant
size
intent
state
```

Example conceptual API:

```tsx
<Button variant="primary" size="md" />
<Button variant="destructive" size="sm" />
```

Avoid creating separate components such as:

```text
primary-button.tsx
secondary-button.tsx
danger-button.tsx
```

when one variant-based component is sufficient.

---

# Styling

Use Tailwind and project design tokens.

Avoid repeated arbitrary values when a design token should exist.

Do not make primitives aware of page-specific spacing.

Keep the design-system API intentional rather than exposing unlimited arbitrary styling props.

`className` may be supported according to existing repository conventions, but should not become a replacement for missing design-system variants.

---

# Dependencies

Allowed:

```text
React
Next.js primitives when appropriate
shadcn/Radix dependencies
tailwind-variants
generic helpers
generic hooks
```

Forbidden:

```text
entities
domain stores
server actions
business DTOs
business schemas
domain calculations
page components
layouts
common components
```

---

# Accessibility

Accessibility is mandatory.

Examples:

```text
Button → semantic button
Dialog → focus management and Escape behavior
Select → keyboard navigation
Tabs → correct roles and keyboard behavior
Input → label/error association
Icon button → accessible name
```

Preserve accessible behavior supplied by shadcn/Radix.

---

# Testing Model

UI components may have both Vitest Integration and Cypress Component tests when they test different responsibilities.

## Vitest Integration

Naming:

```text
button.integration.test.tsx
dialog.integration.test.tsx
```

Use for fast React contract testing:

```text
props
callbacks
accessible roles
disabled/loading state
conditional rendering
variant API behavior when meaningful
```

## Cypress Component

Naming:

```text
dialog.component.cy.tsx
select.component.cy.tsx
sheet.component.cy.tsx
```

### Required when the primitive has meaningful real-browser interaction

Examples:

```text
Dialog
Select
DropdownMenu
Popover
Tooltip
Combobox
Command
Drawer
Sheet
Tabs
Accordion
DatePicker
ContextMenu
NavigationMenu
```

Use Cypress Component Testing for:

```text
keyboard interaction
focus movement
focus restoration
Escape
portals
visibility
pointer interaction
open/close behavior
disabled interaction
browser event behavior
```

### Optional for simple primitives

Usually unnecessary for:

```text
Badge
Separator
Skeleton
simple Card
static typography
simple Label
```

A Button may need Cypress Component coverage if project-specific interaction/state behavior justifies it, but it is not required merely because it is a component.

## Cypress E2E

Do not use E2E to test a primitive in isolation.

E2E covers the primitive indirectly through real application journeys.

---

# Avoid Duplicate Tests

Bad:

```text
Vitest: button is disabled
Cypress Component: button is disabled
E2E: button is disabled
```

with no additional behavioral purpose.

Prefer:

```text
Vitest
→ React contract

Cypress Component
→ browser interaction

E2E
→ business/user journey
```

---

# Helpers

Use:

```text
<component>.helpers.ts
```

for reusable pure logic.

Do not add `.utils.ts`.

---

# Client Boundary

Do not automatically add `'use client'`.

Add it only when required.

Keep interactive boundaries as small as possible.

---

# Agent Workflow

Before creating/modifying a UI component:

1. Inspect the Figma design-system definition when applicable.
2. Search existing UI primitives.
3. Inspect existing shadcn implementation/customization.
4. Reuse before creating.
5. Confirm domain neutrality.
6. Map Figma values to project tokens.
7. Implement reusable variants with `tailwind-variants`.
8. Preserve shadcn/Radix accessibility.
9. Add/update Vitest Integration coverage.
10. Add/update Cypress Component coverage for meaningful browser behavior.
11. Run relevant component tests.
12. Run typecheck and lint.
13. Do not weaken existing tests.

---

# Definition of Done

```text
[ ] Domain-neutral
[ ] Existing primitive reused when possible
[ ] Figma contract implemented
[ ] shadcn/Radix behavior preserved
[ ] Design tokens used
[ ] tailwind-variants used appropriately
[ ] Props strictly typed
[ ] Accessibility correct
[ ] Vitest Integration coverage appropriate
[ ] Cypress Component coverage exists for meaningful browser interaction
[ ] No duplicated meaningless tests
[ ] TypeScript passes
[ ] ESLint passes
```
