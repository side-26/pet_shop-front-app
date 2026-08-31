'use client';

import { Dialog } from '@/components/ui/dialog';
import { getBreedAction } from '@/entities/breeds/breeds.actions';

import { BreedDetailDialogContentWrapper } from './breed-detail-dialog-content-wrapper';
import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

type Props = {
  breedId: string;
  request: ReturnType<typeof getBreedAction>;
  countries: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
  onClose: () => void;
  onUpdated: () => void;
};

export function BreedDetailDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <BreedDetailDialogContentWrapper {...props} />
    </Dialog>
  );
}
