import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

const skeletonTitles = ['دسته‌بندی اول', 'دسته‌بندی دوم', 'دسته‌بندی سوم', 'دسته‌بندی چهارم'];

export const petTypesSectionSkeletonData: LandingPetTypeDTO[] = skeletonTitles.map(
  (title, index) => ({
    id: `skeleton-pet-type-${index}`,
    title,
    mainImage: '',
    thumbnail: '',
  }),
);
