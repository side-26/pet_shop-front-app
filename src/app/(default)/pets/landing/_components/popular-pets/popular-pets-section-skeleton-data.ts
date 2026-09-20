import type { LandingPetDTO } from '@/entities/landing/landing.dto';

const skeletonTitles = ['حیوان اول', 'حیوان دوم', 'حیوان سوم', 'حیوان چهارم'];

export const popularPetsSectionSkeletonData: LandingPetDTO[] = skeletonTitles.map(
  (title, index) => ({
    id: `skeleton-popular-pet-${index}`,
    title,
    slug: `skeleton-popular-pet-${index}`,
    mainImage: '',
    mainImageThumbnail: '',
    description: { type: 'doc', content: [] },
    petType: 'نوع حیوان',
    breed: 'نژاد',
    quantity: 0,
    price: 0,
    discountPercentage: 0,
    inEnable: false,
  }),
);
