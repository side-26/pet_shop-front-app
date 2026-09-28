---
name: show-confirm-dialog
description: Use the project’s shared store-backed ConfirmDialog for destructive or consequential user confirmations. Apply when opening a confirmation dialog from application UI; do not use for local, one-off alert dialogs.
---

# Show Confirm Dialog

Use the shared confirmation flow instead of mounting a feature-local `AlertDialog`.

## Contract

- The dialog host is already mounted by the default and admin layout shells through `ConfirmDialog`. Do not mount another host in application features.
- Read `showConfirmDialog` from `useCommonStore` in the interactive component that owns the action.
- Call it with a Persian `title` and `message`, a meaningful Lucide `icon`, the semantic button `variant`, and an async `onSuccess` callback.
- `size` defaults to `sm`; specify another supported size only when the confirmation content needs it.
- Keep the triggering control disabled when the feature itself cannot perform the action.

```tsx
const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);

function confirmDeletion() {
  showConfirmDialog({
    title: 'کالا حذف شود؟',
    message: 'این عمل قابل بازگشت نیست.',
    icon: Trash2Icon,
    variant: 'error',
    onSuccess: async () => {
      const result = await deleteItem();
      if (!result.isSuccess) return globalErrorHandler(result);
      router.refresh();
    },
  });
}
```

## Lifecycle and state ownership

- The store makes the dialog pending while `onSuccess` runs, disables cancellation, then closes it in `finally`. Do not add duplicate dialog-open or pending state in the feature.
- Put the mutation and feature-specific UI update in `onSuccess`; use the project’s normal error handling for unsuccessful results.
- Use `onIgnore` only when the feature has meaningful cleanup beyond closing the dialog.
- Do not use the shared confirm dialog for informational, non-blocking feedback; use the appropriate toast or inline UI instead.

## Verification

- In feature tests, render `ConfirmDialog` only when the layout host is absent from the test tree.
- Reset the shared dialog state with `useCommonStore.getState().hideConfirmDialog()` after each test.
- Assert the title/message, confirmation activation, pending behavior when relevant, and the resulting mutation or feature update.
