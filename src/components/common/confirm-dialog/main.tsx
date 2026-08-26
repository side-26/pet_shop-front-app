'use client';

import { lazy, Suspense } from 'react';

import { AlertDialog } from '@/components/ui/alert-dialog';
import { useCommonStore } from '@/stores/common.store';

const ConfirmDialogContent = lazy(async () => {
  const content = await import('./content');

  return { default: content.ConfirmDialogContent };
});

export function ConfirmDialog() {
  const open = useCommonStore((state) => state.confirmDialog.open);
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen && eventDetails.reason === 'escape-key') {
          eventDetails.cancel();
        }
      }}
    >
      <Suspense fallback={null}>{open ? <ConfirmDialogContent /> : null}</Suspense>
    </AlertDialog>
  );
}
