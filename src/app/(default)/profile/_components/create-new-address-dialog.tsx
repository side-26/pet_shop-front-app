'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import type { DialogHandle } from '@/_types';
import { Dialog } from '@/components/ui/dialog';

const CreateNewAddressDialogContentWrapper = dynamic(
  () =>
    import('./create-new-address-dialog-content-wrapper').then(
      (module) => module.CreateNewAddressDialogContentWrapper,
    ),
  { ssr: false },
);

export type CreateNewAddressDialogHandle = DialogHandle<void>;

export const CreateNewAddressDialog = forwardRef<CreateNewAddressDialogHandle>(
  function CreateNewAddressDialog(_, ref) {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, () => ({ open: () => setOpen(true), close }), [close]);

    return (
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setOpen(true);
          else close();
        }}
      >
        {open ? <CreateNewAddressDialogContentWrapper onClose={close} /> : null}
      </Dialog>
    );
  },
);
