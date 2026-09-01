import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getAllCategoriesAction } from '@/entities/categories/categories.actions';
import type { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';
import type { getAllSubCategoriesAction } from '@/entities/sub-categories/sub-categories.actions';

import { SubCategoriesTable } from './sub-categories-table';
import { mapSubCategoryOptions } from './sub-categories-form.mapper';
import { mapSubCategoriesTableRows } from './sub-categories-table.mapper';

type Props = {
  subCategoriesPromise: ReturnType<typeof getAllSubCategoriesAction>;
  categoriesPromise: ReturnType<typeof getAllCategoriesAction>;
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
};

export async function SubCategoriesTableContainer({
  subCategoriesPromise,
  categoriesPromise,
  petTypesPromise,
}: Props) {
  const [subCategoriesResult, categoriesResult, petTypesResult] = await Promise.all([
    subCategoriesPromise,
    categoriesPromise,
    petTypesPromise,
  ]);

  if (!subCategoriesResult.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت زیر دسته‌بندی‌ها انجام نشد</EmptyTitle>
          <EmptyDescription>
            {subCategoriesResult.message ?? 'خطایی در دریافت زیر دسته‌بندی‌ها رخ داد.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const categories = categoriesResult.isSuccess ? categoriesResult.data : [];
  const categoryOptions = mapSubCategoryOptions(categories);
  const petTypeTitles = new Map(
    petTypesResult.isSuccess ? petTypesResult.data.map(({ id, title }) => [id, title]) : [],
  );

  return (
    <SubCategoriesTable
      rows={mapSubCategoriesTableRows(subCategoriesResult.data, categories, petTypeTitles)}
      categories={categoryOptions}
    />
  );
}
