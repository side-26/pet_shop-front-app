import type { LandingPopularProductDTO } from '@/entities/landing/landing.dto';

const placeholder = (id: string): LandingPopularProductDTO => ({
  id,
  slug: id,
  title: 'محصول محبوب',
  mainImage: '',
  price: 0,
  discountPercentage: 0,
  discountPrice: 0,
});

export const featuredProductsSectionSkeletonData = [
  placeholder('popular-product-skeleton-1'),
  placeholder('popular-product-skeleton-2'),
  placeholder('popular-product-skeleton-3'),
  placeholder('popular-product-skeleton-4'),
] as const;
