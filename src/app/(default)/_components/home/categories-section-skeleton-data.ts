import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

const skeletonTitles = ['گربه‌ها', 'سگ‌ها', 'پرندگان', 'جوندگان'];

export const categoriesSectionSkeletonData: LandingPetTypeDTO[] = skeletonTitles.map((title) => ({
  id: `skeleton-${title}`,
  title,
  mainImage: '',
  thumbnail: '',
}));
