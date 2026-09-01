import { Suspense } from 'react';

import { getAllCategoriesAction } from '@/entities/categories/categories.actions';

import { mapSubCategoryOptions } from './sub-categories-form.mapper';
import { SubCategoriesHeaderActions } from './sub-categories-header-actions';

async function SubCategoriesHeaderActionsContainer({
  categoriesPromise,
}: {
  categoriesPromise: ReturnType<typeof getAllCategoriesAction>;
}) {
  const result = await categoriesPromise;
  const categories = result.isSuccess ? mapSubCategoryOptions(result.data) : [];

  return <SubCategoriesHeaderActions categories={categories} />;
}

export function SubCategoriesHeaderActionsWrapper() {
  const categoriesPromise = getAllCategoriesAction({ includeDisabled: true });

  return (
    <Suspense fallback={<SubCategoriesHeaderActions categories={[]} />}>
      <SubCategoriesHeaderActionsContainer categoriesPromise={categoriesPromise} />
    </Suspense>
  );
}
