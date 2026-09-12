import type { CustomerPetDetailDTO } from '@/entities/pets/pets.dto';
import type { CustomerProductDetailDTO } from '@/entities/products/products.dto';

import type { LandingDiscountLimitInput, LandingSlugInput } from './landing.schema';

export type LandingPetTypeDTO = {
  id: string;
  title: string;
  mainImage: string;
  thumbnail: string;
  summary?: string;
};

export type LandingPetDTO = {
  id: string;
  title: string;
  slug: string;
  mainImage: string;
  mainImageThumbnail?: string;
  petType: string;
  breed: string;
  price: number;
};

export type LandingProductDTO = {
  id: string;
  title: string;
  mainImage: string;
  mainImageThumbnail?: string;
  summary?: string;
  price: number;
  discountPercentage: number;
  /** Discount amount calculated by discounted and featured landing endpoints. */
  discountPrice: number;
};

/**
 * Product summary returned by the popular-products endpoint.
 * Unlike other landing product summaries, `discountPrice` is the final payable price.
 */
export type LandingPopularProductDTO = LandingProductDTO & {
  slug: string;
};

export type LandingFeaturedProductTag =
  'mostPurchased' | 'mostDiscounted' | 'cheapest' | 'mostWishlisted';

export type LandingFeaturedProductDTO = {
  tag: LandingFeaturedProductTag;
  product: LandingProductDTO;
};

export type LandingPetDetailDTO = CustomerPetDetailDTO;
export type LandingProductDetailDTO = CustomerProductDetailDTO;
export type LandingDiscountLimitDTO = LandingDiscountLimitInput;
export type LandingSlugDTO = LandingSlugInput;
