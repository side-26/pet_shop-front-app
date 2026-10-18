# React Contexts

`contexts/` owns cross-tree React context that cannot be expressed as route props, entity data access, or a focused Zustand store.

## Contents

- `admin/` provides admin-layout state and header-action configuration.
- `dialogs/` provides shared dialog controller/context composition.

## Rules

- Keep context values small, stable, and scoped to a real cross-tree concern. Prefer local state or a store when context would become a broad mutable data container.
- Preserve provider/consumer type safety and avoid placing backend transport logic in contexts.
- Follow the project dialog-controller architecture for imperative dialogs.

## Maintenance

Update this guide when adding/removing a context domain or changing its ownership boundary. Add a local guide when a context acquires non-obvious lifecycle or accessibility rules.
