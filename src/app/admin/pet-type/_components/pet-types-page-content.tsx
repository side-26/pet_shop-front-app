import { Suspense } from 'react';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';
import { PetTypesTable } from './pet-types-table';
export function PetTypesPageContent() {
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: true });
  return (
    <Suspense fallback={<PetTypesTable petTypes={[]} isLoading />}>
      <PetTypesContainer petTypesPromise={petTypesPromise} />
    </Suspense>
  );
}
async function PetTypesContainer({
  petTypesPromise,
}: {
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
}) {
  const result = await petTypesPromise;
  return (
    <PetTypesTable
      petTypes={result.isSuccess ? result.data : []}
      error={result.isSuccess ? null : result.message}
    />
  );
}
