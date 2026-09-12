import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

const skeletonTitles = ['نوع حیوان اول', 'نوع حیوان دوم', 'نوع حیوان سوم'];

export const productCategoriesSectionSkeletonData: LandingPetTypeDTO[] = skeletonTitles.map(
  (title, index) => ({
    id: `skeleton-product-pet-type-${index}`,
    title,
    mainImage: '',
    thumbnail: '',
  }),
);
