import type { PetCardViewModel } from './pet-card.types';

export const petGridSkeletonData: readonly PetCardViewModel[] = Array.from(
  { length: 8 },
  (_, index) => ({
    available: true,
    breed: 'نژاد نمونه',
    discountPercentage: 0,
    id: `pet-skeleton-${index}`,
    image: '',
    imageThumbnail: '',
    petType: 'نوع حیوان',
    price: 100_000,
    slug: 'pet-skeleton',
    title: 'عنوان نمونه حیوان',
  }),
);
