'use client';

import { Dialog } from '@/components/ui/dialog';
import { getBreedPropertyDefinitionsAction } from '@/entities/breeds/breeds.actions';

import { BreedPropertyDefinitionsDialogContentWrapper } from './breed-property-definitions-dialog-content-wrapper';

type Props = {
  breedId: string;
  request: ReturnType<typeof getBreedPropertyDefinitionsAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function BreedPropertyDefinitionsDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <BreedPropertyDefinitionsDialogContentWrapper {...props} />
    </Dialog>
  );
}
