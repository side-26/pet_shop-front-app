import type { WishListItemViewModel } from './wish-list.types';

export const wishListSkeletonData: WishListItemViewModel[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `wish-list-skeleton-${index}`,
    itemType: index % 2 === 0 ? 'product' : 'pet',
    title: 'در حال دریافت علاقه‌مندی‌ها',
    mainImage: '',
  }),
);
