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
  /** Calculated by the landing API; it is not persisted on the product. */
  discountPrice: number;
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
