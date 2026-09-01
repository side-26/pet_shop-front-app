import type { CategoryTableRow } from './categories-table.types';

const SKELETON_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';

export const categoriesTableSkeletonData: CategoryTableRow[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `skeleton-category-${index + 1}`,
    title: 'عنوان دسته‌بندی',
    petTypeTitle: 'نوع حیوان',
    mainImage: SKELETON_IMAGE,
    mainThumbnailImage: SKELETON_IMAGE,
    isEnable: false,
  }),
);
