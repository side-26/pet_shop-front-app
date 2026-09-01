import { Suspense } from 'react';

import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { CategoriesHeaderActions } from './categories-header-actions';

async function CategoriesHeaderActionsContainer({
  petTypesPromise,
}: {
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
}) {
  const result = await petTypesPromise;
  const petTypes = result.isSuccess
    ? result.data.map(({ id, title }) => ({ value: id, label: title }))
    : [];

  return <CategoriesHeaderActions petTypes={petTypes} />;
}

export function CategoriesHeaderActionsWrapper() {
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: false });

  return (
    <Suspense fallback={<CategoriesHeaderActions petTypes={[]} />}>
      <CategoriesHeaderActionsContainer petTypesPromise={petTypesPromise} />
    </Suspense>
  );
}
