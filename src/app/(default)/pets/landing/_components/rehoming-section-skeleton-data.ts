import type { LandingPetDTO } from '@/entities/landing/landing.dto';

const skeletonTitles = [
  'حیوان آماده واگذاری اول',
  'حیوان آماده واگذاری دوم',
  'حیوان آماده واگذاری سوم',
  'حیوان آماده واگذاری چهارم',
];

export const rehomingSectionSkeletonData: LandingPetDTO[] = skeletonTitles.map((title, index) => ({
  id: `skeleton-rehoming-pet-${index}`,
  title,
  slug: `skeleton-rehoming-pet-${index}`,
  mainImage: '',
  petType: 'نوع حیوان',
  breed: 'نژاد',
  price: 0,
}));
