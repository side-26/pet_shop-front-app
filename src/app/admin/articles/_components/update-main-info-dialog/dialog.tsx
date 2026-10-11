'use client';

import { Dialog } from '@/components/ui/dialog';

import { UpdateMainInfoDialogContentWrapper } from './content';
import type { ArticlePetTypeOption } from '../create-new-article-dialog/types';
import type { UpdateMainInfoDialogParams } from './types';

export function UpdateMainInfoDialog({
  onClose,
  onUpdated,
  open,
  petTypes,
}: UpdateMainInfoDialogParams & {
  onClose: () => void;
  onUpdated: () => void;
  open: boolean;
  petTypes: readonly ArticlePetTypeOption[];
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <UpdateMainInfoDialogContentWrapper
        onClose={onClose}
        onUpdated={onUpdated}
        petTypes={petTypes}
      />
    </Dialog>
  );
}
