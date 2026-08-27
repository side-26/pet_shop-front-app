# Common Components Workflow

## Purpose

This workflow governs:

```text
src/components/common/
```

It is intended for **Codex** and **Claude Code**.

Common components are reusable application-level compositions built primarily from the project's `components/ui` design system.

---

# Position in Architecture

```text
Figma
  ↓
components/ui
  ↓
components/common
  ↓
layouts / entities / pages
```

Common components should consume design-system primitives rather than recreating their visual foundations.

---

# Responsibility

A common component is:

```text
shared across unrelated application areas
application-aware
not owned by one entity
higher-level than a UI primitive
not primarily a structural shell
```

Examples:

```text
pagination.tsx
empty-state.tsx
error-state.tsx
page-header.tsx
confirm-dialog.tsx
image-uploader.tsx
file-dropzone.tsx
search-box.tsx
date-range-picker.tsx
```

---

# Ownership Decision

If used by one route:

```text
app/**/_components/
```

If owned by one domain:

```text
entities/<entity>/components/
```

If low-level/domain-neutral:

```text
components/ui/
```

If structural:

```text
components/layouts/
```

Otherwise, when genuinely application-wide:

```text
components/common/
```

Reuse alone does not remove domain ownership.

---

# Design-System Rule

Common components must use `components/ui` primitives whenever an appropriate primitive exists.

Bad:

```text
Common ConfirmDialog manually recreates button/dialog styles
```

Good:

```text
ConfirmDialog
├── Dialog from components/ui
├── Button from components/ui
└── application-level confirmation behavior
```

Do not copy Figma styling independently into common components when that styling belongs to a primitive.

If Figma reveals a missing reusable primitive or variant, improve the design-system component first.

---

# Dependencies

Allowed:

```text
components/ui
generic hooks
generic helpers
providers
config
framework primitives
```

Entity dependencies should be treated as a warning.

If a component strongly depends on one entity's model/business rules, move it to that entity.

---

# Business Logic

Common components may manage generic UI behavior.

They must not own:

```text
pricing rules
inventory rules
checkout rules
order delivery rules
auth authorization rules
domain transformations
```

---

# tailwind-variants

Use `tailwind-variants` when the common component itself has stable reusable variants.

Do not duplicate variants already provided by its UI primitives.

Prefer composition.

---

# Testing Model

## Vitest Integration

Primary test level for common components.

Naming:

```text
pagination.integration.test.tsx
empty-state.integration.test.tsx
confirm-dialog.integration.test.tsx
```

Test:

```text
props
callbacks
conditional states
accessible output
component composition
application-level behavior
```

## Cypress Component

Use selectively when real-browser behavior is complex, important, or difficult to validate meaningfully in a simulated DOM.

Strong candidates:

```text
ImageUploader
FileDropzone
ConfirmDialog
DateRangePicker
interactive Pagination
SearchBox with complex keyboard behavior
```

Naming:

```text
image-uploader.component.cy.tsx
confirm-dialog.component.cy.tsx
```

Test browser-specific behavior such as:

```text
file selection/drop interaction
focus
keyboard navigation
visibility
portals
real pointer behavior
browser event sequences
```

Do not add Cypress Component tests to static components simply to increase coverage.

Examples that normally do not need Cypress Component tests:

```text
EmptyState
simple PageHeader
static StatusMessage
```

## Cypress E2E

Use only when the component participates in a complete application journey that needs protection.

The E2E test belongs under:

```text
cypress/e2e/
```

not beside the common component.

---

# Non-Duplication

If both Vitest Integration and Cypress Component tests exist, each must have a distinct purpose.

Do not duplicate every assertion between runners.

---

# Figma Workflow

When a common component is represented in Figma:

1. Inspect its design.
2. Identify which pieces map to existing UI primitives.
3. Verify required primitive variants already exist.
4. Add missing design-system variants at the UI level when appropriate.
5. Compose the common component.
6. Keep application-specific behavior in common.
7. Add appropriate tests.

---

# Helpers

Use:

```text
*.helpers.ts
```

not `.utils.ts`.

Pure reusable logic may receive:

```text
*.unit.test.ts
```

---

# Client Boundary

Use `'use client'` only when required.

If only one child is interactive, prefer keeping the client boundary around that child.

---

# Agent Workflow

Codex/Claude Code must:

1. Search existing route, entity, common, and UI components.
2. Confirm the component is genuinely application-wide.
3. Reuse UI design-system primitives.
4. Inspect Figma when design-driven.
5. Avoid duplicating primitive styles.
6. Keep domain logic out.
7. Add Vitest Integration tests for meaningful behavior.
8. Add Cypress Component tests when browser interaction warrants them.
9. Update Cypress E2E only when a complete journey changes.
10. Run tests, typecheck, and lint.
11. Never weaken existing tests merely to pass CI.

---

# Definition of Done

```text
[ ] Correct common ownership
[ ] Existing UI primitives reused
[ ] Figma/design-system rules respected
[ ] No duplicated primitive styling
[ ] No entity business logic
[ ] Props strictly typed
[ ] Accessibility correct
[ ] Vitest Integration coverage appropriate
[ ] Cypress Component coverage added for complex browser interaction
[ ] E2E updated only when relevant
[ ] Existing tests pass
[ ] TypeScript passes
[ ] ESLint passes
```

## Form dialog content

`FormDialogContent` composes `DialogContent` with a filled `Card`, a `CardHeader` containing the
required `DialogTitle`, a customizable `CardContent`, and a `CardFooter` action row. The submit
button is `fill + primary`, supports an optional external `formId`, owns Button loading through
`isLoading`, and defaults its label to `agree`. The cancel button is `outlined + error`, invokes the
required `onClose`, and is disabled while submission is loading. Both actions occupy equal width
with an 8px gap.

`FilterFormDialogContent` builds on that contract for filter forms, defaulting to the Persian
`فیلترها` title and `اعمال فیلتر` submit label while leaving both customizable.
