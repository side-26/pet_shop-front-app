import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getAllCategoriesAction } from '@/entities/categories/categories.actions';
import type { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { CategoriesTable } from './categories-table';
import { mapCategoriesTableRows } from './categories-table.mapper';

type Props = {
  categoriesPromise: ReturnType<typeof getAllCategoriesAction>;
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
};

export async function CategoriesTableContainer({ categoriesPromise, petTypesPromise }: Props) {
  const [categoriesResult, petTypesResult] = await Promise.all([
    categoriesPromise,
    petTypesPromise,
  ]);

  if (!categoriesResult.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت دسته‌بندی‌ها انجام نشد</EmptyTitle>
          <EmptyDescription>
            {categoriesResult.message ?? 'خطایی در دریافت دسته‌بندی‌ها رخ داد.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const petTypeTitles = new Map(
    petTypesResult.isSuccess ? petTypesResult.data.map(({ id, title }) => [id, title]) : [],
  );
  const petTypes = petTypesResult.isSuccess
    ? petTypesResult.data.map(({ id, title }) => ({ value: id, label: title }))
    : [];

  return (
    <CategoriesTable
      categories={mapCategoriesTableRows(categoriesResult.data, petTypeTitles)}
      petTypes={petTypes}
    />
  );
}
