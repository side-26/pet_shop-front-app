import { Suspense } from 'react';

import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { ArticlesHeaderActions } from './articles-header-actions';

type ArticlesHeaderActionsContainerProps = Readonly<{
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
}>;

async function ArticlesHeaderActionsContainer({
  petTypesPromise,
}: ArticlesHeaderActionsContainerProps) {
  const result = await petTypesPromise;
  const petTypes = result.isSuccess
    ? result.data.map(({ id, mainImage, title }) => ({ id, image: mainImage, title }))
    : [];

  return <ArticlesHeaderActions petTypes={petTypes} />;
}

export function ArticlesHeaderActionsWrapper() {
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: false });

  return (
    <Suspense fallback={<ArticlesHeaderActions petTypes={[]} />}>
      <ArticlesHeaderActionsContainer petTypesPromise={petTypesPromise} />
    </Suspense>
  );
}
