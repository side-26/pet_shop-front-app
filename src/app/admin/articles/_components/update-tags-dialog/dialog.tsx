'use client';

import { Dialog } from '@/components/ui/dialog';

import { UpdateTagsDialogContentWrapper } from './content';

export function UpdateTagsDialog({
  onClose,
  onUpdated,
  open,
}: Readonly<{ onClose: () => void; onUpdated: () => void; open: boolean }>) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <UpdateTagsDialogContentWrapper onClose={onClose} onUpdated={onUpdated} />
    </Dialog>
  );
}
