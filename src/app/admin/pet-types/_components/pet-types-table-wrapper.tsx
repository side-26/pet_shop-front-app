import { Suspense } from 'react';

import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { PetTypesTableContainer } from './pet-types-table-container';
import { petTypesTableSkeletonData } from './pet-types-table-skeleton-data';
import { PetTypesTable } from './pet-types-table';

export function PetTypesTableWrapper() {
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: true });

  return (
    <Suspense fallback={<PetTypesTable petTypes={petTypesTableSkeletonData} isLoading />}>
      <PetTypesTableContainer petTypesPromise={petTypesPromise} />
    </Suspense>
  );
}
