'use client';

import { Dialog } from '@/components/ui/dialog';
import { getPetTypeByIdAction } from '@/entities/pet-types/pet-types.actions';

import { PetTypeDetailDialogContentWrapper } from './pet-type-detail-dialog-content-wrapper';

type Props = {
  petTypeId: string;
  request: ReturnType<typeof getPetTypeByIdAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function PetTypeDetailDialog({ petTypeId, request, onClose, onUpdated }: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <PetTypeDetailDialogContentWrapper
        petTypeId={petTypeId}
        request={request}
        onClose={onClose}
        onUpdated={onUpdated}
      />
    </Dialog>
  );
}
