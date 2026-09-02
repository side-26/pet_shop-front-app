'use client';

import { Dialog } from '@/components/ui/dialog';

import { PetSectionDialogContentWrapper } from './pet-section-dialog-content-wrapper';
import type {
  PetFormOptionsRequest,
  PetSection,
  PetSectionRequest,
} from './pet-section-dialog.types';

type Props = {
  petId: string;
  petTitle: string;
  section: PetSection;
  request: PetSectionRequest;
  optionsRequest: PetFormOptionsRequest;
  onClose: () => void;
  onUpdated: () => void;
};

export function PetSectionDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <PetSectionDialogContentWrapper {...props} />
    </Dialog>
  );
}
