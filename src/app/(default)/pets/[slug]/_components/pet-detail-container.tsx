import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { getLandingPetBySlugAction } from '@/entities/landing/landing.actions';

import { PetDetailRenderer } from './pet-detail-renderer';
import { createPetDetailViewModel } from './pet-detail-data';
import { PetDetailEmptyFetch } from './pet-detail-empty-fetch';

type PetDetailContainerProps = Readonly<{
  petPromise: ReturnType<typeof getLandingPetBySlugAction>;
}>;

export function PetDetailContainer({ petPromise }: PetDetailContainerProps) {
  const pet = use(petPromise);
  const petViewModel = pet?.id ? createPetDetailViewModel(pet) : null;

  return (
    <EmptyStateBoundary
      data={petViewModel}
      fallback={<PetDetailEmptyFetch />}
      isEmpty={() => !petViewModel?.id}
    >
      {petViewModel ? <PetDetailRenderer pet={petViewModel} /> : null}
    </EmptyStateBoundary>
  );
}
