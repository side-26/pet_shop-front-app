---
name: form-dialog-content-architecture
description: Create, refactor, or review API-backed form dialogs in this Next.js project using separate dialog shell, FormDialogContent wrapper, dynamically imported async content, and renderer-backed loading states. Use for create, detail, or edit dialogs whose body waits for fetched data or submits a mutation.
---

# Form Dialog Content Architecture

Build fetched form dialogs as three explicit boundaries while reusing one form-body renderer for loading and resolved data.

Also follow the repository `AGENTS.md`, `shadcn-pet-ui-component`, `composition-component-architecture`, and the applicable API/entity workflow skill. Read the installed Next.js documentation before changing `next/dynamic`, Client Component, Server Action, or Suspense behavior.

## Required file structure

For a dialog named `<feature>-dialog`, use:

```text
<feature>-dialog.tsx
<feature>-dialog-content-wrapper.tsx
<feature>-dialog-content.tsx
```

Keep a renderer such as `<Feature>FormBody` in the wrapper file unless it has a separate, reusable domain responsibility.

## Ownership

### `<feature>-dialog.tsx`

- Own only the shared `Dialog`, its controlled open/close behavior, and composition of the content wrapper.
- Do not fetch, await/use a request, render form fields, own mutation pending state, or own Suspense.
- Keep the dialog shell statically imported. Do not make the entire dialog the dynamic component.

### `<feature>-dialog-content-wrapper.tsx`

- Own `FormDialogContent`, title, size, form ID, submit/cancel labels, and dialog layout classes.
- Own the mutation client hook or submit transition, including `formRef`, submit handler, and mutation `isPending` state.
- Dynamically import `<feature>-dialog-content.tsx` with a top-level `next/dynamic` declaration.
- Own the narrow `Suspense` boundary around only the Promise-backed body.
- Render normalized failure content inside `FormDialogContent` so the dialog remains structurally complete.

### `<feature>-dialog-content.tsx`

- Consume the typed detail request Promise with React `use()` and expose the resolved normalized result to the wrapper's renderer composition.
- Do not render `Dialog`, `FormDialogContent`, headers, footers, or duplicate form markup.
- Do not own mutation hooks, toast, navigation, or close behavior.

## Request ownership

Start a detail/read Server Action only from an allowed event boundary, normally the row or header action that opens the dialog. Store its typed Promise in state and pass it through the dialog and wrapper to the async content module.

Do not invoke a Server Action during Client Component render. Do not defer the initial request to `useEffect`; this adds an unnecessary render and can duplicate or stale the request. Clear the stored Promise when the dialog closes so reopening starts a fresh request.

## Loading renderer contract

The wrapper must define one real form-body renderer used for both states:

```tsx
<Suspense
  fallback={
    <FeatureFormBody
      formRef={formRef}
      handleSubmit={handleSubmit}
      isLoading
    />
  }
>
  <AsyncFeatureDialogContent request={request}>
    {(result) =>
      result.isSuccess ? (
        <FeatureFormBody
          formRef={formRef}
          handleSubmit={handleSubmit}
          value={mapResult(result.data)}
        />
      ) : (
        <p role="alert">{result.message}</p>
      )
    }
  </AsyncFeatureDialogContent>
</Suspense>
```

Never use `fallback={null}` for the async form body. Never create a separate skeleton form with duplicated fields.

The shared form-body renderer must:

- accept `isLoading?: boolean`;
- use deterministic placeholder/view-model values that preserve the loaded layout;
- apply the global `.skeleton` class at its outer form region;
- set `aria-busy={isLoading || undefined}`;
- apply `pointer-events-none` and `select-none` while loading;
- disable its fieldset and all add/remove/upload or other nested interactions;
- preserve the same form fields, image regions, and layout in loading and loaded states.

`FormDialogContent.isLoading` represents mutation submission pending state. The form-body `isLoading` represents the read/detail request pending state. Keep these states distinct.

## Dynamic boundary

Declare the dynamic import at module scope:

```tsx
const AsyncFeatureDialogContent = dynamic(
  () => import('./feature-dialog-content'),
);
```

Let the explicit Suspense fallback render the real loading form body. Do not configure a `null` loading component and do not dynamically import the outer dialog shell.

## Tests

Cover the responsibilities that changed:

- the opening action starts the request only after user selection and exactly once;
- the dialog shell appears immediately;
- the fallback uses the real form body with `.skeleton`, `aria-busy`, and disabled fields/actions;
- resolved data replaces placeholder values;
- normalized errors remain inside the named dialog;
- mutation pending state uses `FormDialogContent`/shared Button loading behavior;
- close and successful update clear request state and refresh only when appropriate.

Await interactions that cause suspension with async `act` or Testing Library async queries. Account for Base UI dialog content being rendered in a portal.

Before completion, run focused tests, TypeScript, ESLint, and the production build. Do not weaken existing assertions to accommodate the refactor.
