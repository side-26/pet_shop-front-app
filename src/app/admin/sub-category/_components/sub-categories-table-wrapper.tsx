import { Suspense } from 'react';

import { getAllCategoriesAction } from '@/entities/categories/categories.actions';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';
import { getAllSubCategoriesAction } from '@/entities/sub-categories/sub-categories.actions';

import { SubCategoriesTable } from './sub-categories-table';
import { SubCategoriesTableContainer } from './sub-categories-table-container';
import { subCategoriesTableSkeletonData } from './sub-categories-table-skeleton-data';

export function SubCategoriesTableWrapper() {
  const subCategoriesPromise = getAllSubCategoriesAction();
  const categoriesPromise = getAllCategoriesAction({ includeDisabled: true });
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: true });

  return (
    <Suspense fallback={<SubCategoriesTable rows={subCategoriesTableSkeletonData} isSkeleton />}>
      <SubCategoriesTableContainer
        subCategoriesPromise={subCategoriesPromise}
        categoriesPromise={categoriesPromise}
        petTypesPromise={petTypesPromise}
      />
    </Suspense>
  );
}
