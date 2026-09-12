import type { LandingPetDTO } from '@/entities/landing/landing.dto';

const skeletonTitles = ['حیوان اول', 'حیوان دوم', 'حیوان سوم', 'حیوان چهارم'];

export const popularPetsSectionSkeletonData: LandingPetDTO[] = skeletonTitles.map(
  (title, index) => ({
    id: `skeleton-popular-pet-${index}`,
    title,
    slug: `skeleton-popular-pet-${index}`,
    mainImage: '',
    petType: 'نوع حیوان',
    breed: 'نژاد',
    price: 0,
  }),
);
