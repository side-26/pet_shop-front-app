'use client';

import { Dialog } from '@/components/ui/dialog';

import { UpdateMainTextDialogContentWrapper } from './content';
import type { UpdateMainTextDialogParams } from './types';

export function UpdateMainTextDialog({
  onClose,
  onUpdated,
  open,
}: UpdateMainTextDialogParams & {
  onClose: () => void;
  onUpdated: () => void;
  open: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <UpdateMainTextDialogContentWrapper onClose={onClose} onUpdated={onUpdated} />
    </Dialog>
  );
}
