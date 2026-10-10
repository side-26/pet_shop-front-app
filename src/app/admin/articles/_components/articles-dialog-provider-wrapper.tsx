import { Suspense, type ReactNode } from 'react';

import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { ArticlesTableDialogProvider } from './articles-table-dialog-provider';

type ArticlesDialogProviderContainerProps = Readonly<{
  children: ReactNode;
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
}>;

async function ArticlesDialogProviderContainer({
  children,
  petTypesPromise,
}: ArticlesDialogProviderContainerProps) {
  const result = await petTypesPromise;
  const petTypes = result.isSuccess
    ? result.data.map(({ id, mainImage, title }) => ({ id, image: mainImage, title }))
    : [];

  return <ArticlesTableDialogProvider petTypes={petTypes}>{children}</ArticlesTableDialogProvider>;
}

export function ArticlesDialogProviderWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: false });

  return (
    <Suspense
      fallback={<ArticlesTableDialogProvider petTypes={[]}>{children}</ArticlesTableDialogProvider>}
    >
      <ArticlesDialogProviderContainer petTypesPromise={petTypesPromise}>
        {children}
      </ArticlesDialogProviderContainer>
    </Suspense>
  );
}
