import { Suspense } from 'react';

import { getAllCategoriesAction } from '@/entities/categories/categories.actions';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { CategoriesTable } from './categories-table';
import { CategoriesTableContainer } from './categories-table-container';
import { categoriesTableSkeletonData } from './categories-table-skeleton-data';

export function CategoriesTableWrapper() {
  const categoriesPromise = getAllCategoriesAction({ includeDisabled: true });
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: true });

  return (
    <Suspense fallback={<CategoriesTable categories={categoriesTableSkeletonData} isSkeleton />}>
      <CategoriesTableContainer
        categoriesPromise={categoriesPromise}
        petTypesPromise={petTypesPromise}
      />
    </Suspense>
  );
}
