# Components Folder Workflow

## Purpose

This document defines the architecture, responsibilities, placement rules, design-system integration, testing strategy, and agent workflow for:

```text
src/components/
├── ui/
├── common/
└── layouts/
```

This workflow is intended for both **Codex** and **Claude Code**.

The project uses a design-system-first workflow:

```text
Figma Design System
        ↓
Figma MCP
        ↓
shadcn/ui primitives
        ↓
Tailwind CSS design tokens / CSS variables
        ↓
tailwind-variants
        ↓
src/components/ui
        ↓
src/components/common
        ↓
src/components/layouts
        ↓
entities + route-local components
        ↓
pages
```

The goal is to prevent duplicated UI, uncontrolled Tailwind styling, design drift, brittle tests, and domain leakage into global components.

---

# Source of Truth

Use this responsibility model:

```text
Figma
→ visual design, component variants, states, tokens, interaction specification

Tailwind/CSS variables
→ implementation of design tokens

tailwind-variants
→ allowed component variants and state combinations

shadcn/ui
→ accessible primitive/component foundation

components/ui
→ project design-system implementation

components/common
→ reusable application-level compositions

components/layouts
→ reusable application structure

entities/<entity>/components
→ reusable domain-owned components

app/**/_components
→ route-only components
```

Do not copy arbitrary Tailwind classes from Figma into every page when an existing design-system component should be used.

---

# Placement Decision

Before creating a component, determine ownership:

```text
Used only by one route?
    → app/**/_components

Owned by Product/Pet/Cart/Order/Auth/etc.?
    → entities/<entity>/components

Domain-neutral visual primitive?
    → components/ui

Reusable across unrelated application areas?
    → components/common

Reusable structural shell/navigation component?
    → components/layouts
```

The component must live at the narrowest correct scope.

Reuse does not automatically mean `common`.

---

# Folder Responsibilities

## `components/ui`

Generic design-system primitives.

Examples:

```text
button.tsx
input.tsx
select.tsx
dialog.tsx
sheet.tsx
tabs.tsx
badge.tsx
card.tsx
tooltip.tsx
skeleton.tsx
```

These components may be based on shadcn/ui, but once added to the repository they are project-owned code and must follow the project design system.

---

## `components/common`

Reusable application-level components that are not owned by one domain.

Examples:

```text
pagination.tsx
empty-state.tsx
error-state.tsx
page-header.tsx
confirm-dialog.tsx
image-uploader.tsx
search-box.tsx
```

---

## `components/layouts`

Reusable structural components.

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

Next.js routing `layout.tsx` files remain inside `app/`.

---

# Dependency Direction

Prefer:

```text
layouts
   ↓
common
   ↓
ui
```

All may use appropriate generic:

```text
lib/
hooks/
providers/
config/
```

Avoid:

```text
ui → common
ui → layouts
common → layouts
```

`components/ui` must not depend on business entities.

---

# Figma + MCP Workflow

When implementing a component from Figma:

1. Inspect the relevant Figma design-system component through the configured Figma MCP workflow.
2. Identify:
   - tokens
   - variants
   - sizes
   - states
   - typography
   - spacing
   - radius
   - interaction behavior
3. Search the existing repository for a matching component.
4. Search existing shadcn/ui primitives before implementing a new primitive.
5. Extend the existing project component rather than duplicating it.
6. Map reusable visual values to design tokens/CSS variables.
7. Represent supported variants with `tailwind-variants`.
8. Do not create page-specific one-off variants inside global UI primitives.
9. Preserve shadcn/Radix accessibility behavior.
10. Add appropriate tests.

Do not assume generated Figma/MCP code is production-ready. Adapt it to repository architecture.

---

# Styling Rules

Use:

```text
Tailwind CSS
tailwind-variants
project design tokens / CSS variables
```

Do not introduce another styling framework.

Do not hard-code repeated Figma values throughout components if they should be represented by a token.

Prefer:

```text
token → Tailwind/CSS variable → tailwind-variants → component
```

over:

```text
Figma value → arbitrary class repeated everywhere
```

---

# Client Component Rule

Do not automatically add:

```tsx
'use client';
```

Use it only when required by:

```text
state
effects
event handlers
browser APIs
client-only hooks/libraries
```

Keep client boundaries as low as practical.

---

# Naming

Files:

```text
kebab-case.tsx
```

Components:

```text
PascalCase
```

Tests:

```text
*.unit.test.ts
*.integration.test.tsx
*.component.cy.tsx
*.cy.ts
```

Meaning:

```text
*.unit.test.ts
→ Vitest pure logic

*.integration.test.tsx
→ Vitest + React Testing Library

*.component.cy.tsx
→ Cypress Component Testing

*.cy.ts
→ Cypress E2E user journeys
```

The project uses `.helpers.ts`, not `.utils.ts`.

---

# Testing Strategy

Do not require every component to have every test type.

Test each behavior at the level that provides meaningful confidence without duplicating the same assertion.

## Unit — Vitest

Use for pure logic:

```text
helpers
variant calculations when non-trivial
formatters
transformations
isolated calculations
```

## Integration — Vitest + React Testing Library

Use for React contracts and user-observable component behavior:

```text
rendered accessible roles
props
callbacks
validation state
disabled/loading state
conditional rendering
component composition
```

Avoid implementation-detail assertions.

## Cypress Component Testing

Cypress Component Testing is part of the design-system workflow.

Use it for components whose behavior benefits from a real browser.

### Required for interactive UI primitives with meaningful browser behavior

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
NavigationMenu
interactive Input variants
```

Test relevant behavior such as:

```text
focus
keyboard navigation
Escape behavior
portals
visibility
pointer interaction
open/close behavior
disabled behavior
focus restoration
```

### Selective for common components

Use when browser interaction is complex or critical:

```text
ImageUploader
FileDropzone
ConfirmDialog
Pagination
SearchBox
DateRangePicker
```

### Selective for layouts

Use for interactive layout behavior:

```text
MobileNavigation
AdminSidebar interactions
ResponsiveHeader
drawer navigation
```

Do not create Cypress Component tests for static wrappers merely to increase coverage.

## Cypress E2E

Reserve for complete user journeys:

```text
login
product browsing
cart
checkout
payment
orders
profile
admin CRUD
```

E2E tests belong under:

```text
cypress/e2e/
```

---

# Testing Non-Duplication Rule

Vitest Integration and Cypress Component tests must not simply repeat identical assertions.

Example:

```text
Vitest Integration
→ component React contract and fast behavior validation

Cypress Component
→ real-browser interaction, focus, portal, keyboard, visibility behavior

Cypress E2E
→ application-level journey
```

---

# Visual Testing

Normal Cypress assertions are not a substitute for visual regression testing.

Do not introduce screenshot/visual-regression infrastructure unless explicitly requested or already established.

The architecture should remain compatible with adding visual regression later.

---

# Accessibility

Shared components must use semantic HTML and accessible interaction patterns.

Test accessibility-relevant behavior especially for interactive design-system primitives.

Do not remove accessibility behavior inherited from shadcn/Radix primitives unless there is an explicit justified requirement.

---

# Agent Workflow

For every component task, Codex/Claude Code must:

1. Inspect repository conventions.
2. Inspect the relevant Figma design-system source when the task is design-driven.
3. Search existing `ui`, `common`, `layouts`, entity components, and route-local components.
4. Reuse before creating.
5. Determine correct ownership.
6. Use shadcn/ui as the primitive foundation when appropriate.
7. Use project tokens and Tailwind conventions.
8. Use `tailwind-variants` for reusable variants.
9. Preserve accessibility.
10. Keep client boundaries minimal.
11. Add/update the appropriate test level.
12. Add Cypress Component coverage when real-browser interaction warrants it.
13. Update E2E only when an application journey changes.
14. Run relevant tests, type checking, linting, and build validation.
15. Never delete, skip, or weaken a valid existing test merely to make CI pass.

---

# Forbidden Patterns

Do not create:

```text
components/pages/
components/global/
components/shared/
components/base/
```

unless the entire architecture is intentionally changed.

Do not put domain logic, DTOs, stores, API actions, schemas, or entity calculations inside global components.

Do not duplicate shadcn-based primitives under new names when variants/composition solve the requirement.

Do not manually recreate a Figma design on individual pages if the design belongs to the shared design system.

---

# Definition of Done

```text
[ ] Correct component ownership
[ ] Existing component reused when possible
[ ] Figma/design-system contract respected
[ ] shadcn primitive reused when appropriate
[ ] Tailwind design tokens used consistently
[ ] tailwind-variants used for reusable variants
[ ] Props strictly typed
[ ] Accessibility preserved
[ ] Client boundary justified
[ ] Appropriate Vitest tests added/updated
[ ] Cypress Component tests added when browser behavior warrants them
[ ] Cypress E2E updated when a critical user journey changes
[ ] Existing tests remain green
[ ] TypeScript passes
[ ] ESLint passes
[ ] Production build passes when applicable
```
