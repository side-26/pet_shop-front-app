import type { SubCategoryTableRow } from './sub-categories-table.types';

export const subCategoriesTableSkeletonData: SubCategoryTableRow[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `skeleton-sub-category-${index + 1}`,
    title: 'عنوان زیر دسته‌بندی',
    categoryTitle: 'عنوان دسته‌بندی',
    petTypeTitle: 'نوع حیوان',
  }),
);
