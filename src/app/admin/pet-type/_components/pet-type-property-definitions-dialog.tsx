'use client';

import { Dialog } from '@/components/ui/dialog';
import { getPetTypePropertyDefinitionsAction } from '@/entities/pet-types/pet-types.actions';

import { PetTypePropertyDefinitionsDialogContentWrapper } from './pet-type-property-definitions-dialog-content-wrapper';

type Props = {
  petTypeId: string;
  request: ReturnType<typeof getPetTypePropertyDefinitionsAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function PetTypePropertyDefinitionsDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <PetTypePropertyDefinitionsDialogContentWrapper {...props} />
    </Dialog>
  );
}
