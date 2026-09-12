import type { LandingPopularBrandDTO } from '@/entities/landing/landing.dto';

export const popularBrandsSectionSkeletonData: readonly LandingPopularBrandDTO[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `popular-brand-skeleton-${index}`,
    title: 'برند محبوب',
    logo: '',
    thumbnailLogo: '',
    productCount: 0,
  }),
);
