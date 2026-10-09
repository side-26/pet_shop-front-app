# Controller usage reference

This example is **illustrative**: match the actual project's `useDialogController` and `DialogHandle` definitions before applying it.

```tsx
'use client';

import { useRef } from 'react';
import type { DialogHandle } from '@/_types';
import { useDialogController } from '@/hook/use-dialog-contoller';
import CreateOrderDialogWrapper from './create-order/wrapper';
import UpdateOrderDialogWrapper from './update-order/wrapper';

// Prefer the existing DTO when available.
type UpdateOrderParams = Readonly<{ id: number }>;

export function OrderActions() {
  const createRef = useRef<DialogHandle<void>>(null);
  const updateRef = useRef<DialogHandle<UpdateOrderParams>>(null);

  const dialogs = useDialogController({
    createOrder: { ref: createRef },
    updateOrder: { ref: updateRef },
  });

  return (
    <>
      <button type="button" onClick={() => dialogs.open('createOrder')}>
        Create order
      </button>
      <button type="button" onClick={() => dialogs.open('updateOrder', { id: 123 })}>
        Update order
      </button>
      <CreateOrderDialogWrapper ref={createRef} />
      <UpdateOrderDialogWrapper ref={updateRef} />
    </>
  );
}
```

## Verification

- Every key resolves to the intended wrapper, not merely a second alias of the same import.
- No-argument dialogs open without fake payloads.
- Parameterized dialogs require exactly their expected DTO-derived payloads.
- Controller operations match the existing hook's real public API.
- Multiple triggers can address the same dialog safely.
- If only one dialog may be visible, opening B while A is open follows an explicit, tested policy (close A first, reject B, or queue B).
- Close/exit callbacks from A cannot accidentally unmount a newly opened B.
- Accessibility, focus restoration, and animation lifecycle remain delegated to the dialog implementation.
