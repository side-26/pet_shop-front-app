'use client';

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { Dialog } from '@/components/ui/dialog';

import { CreateNewAddressDialogContentWrapper } from './create-new-address-dialog-content-wrapper';

export type CreateNewAddressDialogHandle = Readonly<{
  open: () => void;
  close: () => void;
}>;

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
        <CreateNewAddressDialogContentWrapper onClose={close} />
      </Dialog>
    );
  },
);
