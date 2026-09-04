import type { ProductTableRow } from './products-table.types';

export const productsTableSkeletonData: ProductTableRow[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `skeleton-product-${index + 1}`,
    title: 'عنوان محصول',
    category: 'دسته‌بندی محصول',
    subCategory: 'زیر دسته‌بندی محصول',
    quantity: 0,
    isEnable: false,
  }),
);
