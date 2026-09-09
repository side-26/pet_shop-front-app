'use client';

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { Dialog } from '@/components/ui/dialog';

import { BrandDetailDialogContentWrapper } from './brand-detail-dialog-content-wrapper';
import type { BrandDetailRequest, BrandFormDialogHandle } from './brand-form-dialog.types';

type Props = {
  brandId: string;
  request: BrandDetailRequest;
  openOnMount?: boolean;
  onClosed: () => void;
  onUpdated: () => void;
};

export const BrandDetailDialog = forwardRef<BrandFormDialogHandle, Props>(
  function BrandDetailDialog({ brandId, request, openOnMount = false, onClosed, onUpdated }, ref) {
    const [open, setOpen] = useState(openOnMount);
    const close = useCallback(() => {
      setOpen(false);
      onClosed();
    }, [onClosed]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close,
        toggle: () => (open ? close() : setOpen(true)),
      }),
      [close, open],
    );

    return (
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setOpen(true);
          else close();
        }}
      >
        <BrandDetailDialogContentWrapper
          brandId={brandId}
          request={request}
          onClose={close}
          onUpdated={() => {
            setOpen(false);
            onUpdated();
          }}
        />
      </Dialog>
    );
  },
);
