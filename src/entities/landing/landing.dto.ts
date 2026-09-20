import type { CustomerPetDetailDTO, CustomerPetListItemDTO } from '@/entities/pets/pets.dto';
import type { PaginateDataDTO } from '@/entities/pagination/pagination.dto';
import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';
import type {
  CustomerProductDetailDTO,
  ProductRelationDTO,
} from '@/entities/products/products.dto';

import type {
  LandingDiscountLimitInput,
  LandingPetListQueryInput,
  LandingPetListRequestInput,
  LandingProductListQueryInput,
  LandingProductListRequestInput,
  LandingSlugInput,
  LandingSearchQueryInput,
} from './landing.schema';

export type LandingPetTypeDTO = {
  id: string;
  title: string;
  mainImage: string;
  thumbnail: string;
  summary?: string;
};

/** Popular and recent landing pets use the customer-facing card contract. */
export type LandingPetDTO = CustomerPetListItemDTO;
/** The landing pet-list formatter only emits populated taxonomy titles when the model supplies them. */
export type LandingPetListItemDTO = Omit<CustomerPetListItemDTO, 'petType' | 'breed'> & {
  breed?: string;
  petType?: string;
};
export type LandingPetListPageDTO = PaginateDataDTO<LandingPetListItemDTO, FilterDTO, SortDTO>;

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
  /** Cheapest payable price among the product's configured weights. */
  minimumFinalPrice?: number;
  /** Lowest inventory count among configured weights; zero when no weight exists. */
  minimumQuantity?: number;
};

/**
 * Product summary returned by the popular-products endpoint.
 * Unlike other landing product summaries, `discountPrice` is the final payable price.
 */
export type LandingPopularProductDTO = LandingProductDTO & {
  slug: string;
};

/** Product card returned by the filtered public landing catalogue. */
export type LandingProductListItemDTO = LandingPopularProductDTO;
export type LandingProductListPageDTO = PaginateDataDTO<
  LandingProductListItemDTO,
  FilterDTO,
  SortDTO
>;

/** Enabled brand summary ranked by its enabled-product count. */
export type LandingPopularBrandDTO = {
  id: string;
  title: string;
  title_fa?: string;
  logo: string;
  thumbnailLogo: string;
  slug?: string;
  productCount: number;
};

export type LandingFeaturedProductTag =
  'mostPurchased' | 'mostDiscounted' | 'cheapest' | 'mostWishlisted';

export type LandingFeaturedProductDTO = {
  tag: LandingFeaturedProductTag;
  product: LandingProductDTO;
};

export type LandingPetDetailDTO = CustomerPetDetailDTO;
export type LandingProductPetTypeDTO = {
  id: string;
  title: string;
  displayName: string;
  propertyDefinitions: Array<{
    label: string;
    required?: boolean;
    value: unknown;
  }>;
};
export type LandingProductWeightDTO = {
  _id?: string;
  metric: string;
  quantity: number;
  value: number;
  price?: number;
  discountPercentage?: number;
};
export type LandingProductDetailDTO = Omit<CustomerProductDetailDTO, 'category' | 'weights'> & {
  category: ProductRelationDTO & { petType: LandingProductPetTypeDTO | null };
  weights: LandingProductWeightDTO[];
  userRate: number;
  userRateCount: number;
  canVote: boolean;
  hasRated: boolean;
};
export type LandingSearchResultDTO = {
  title: string;
  mainImage: string;
  thumbnailImage: string;
};
export type LandingDiscountLimitDTO = LandingDiscountLimitInput;
export type LandingProductListQueryDTO = LandingProductListQueryInput;
export type LandingProductListRequestDTO = LandingProductListRequestInput;
export type LandingPetListQueryDTO = LandingPetListQueryInput;
export type LandingPetListRequestDTO = LandingPetListRequestInput;
export type LandingSlugDTO = LandingSlugInput;
export type LandingSearchQueryDTO = LandingSearchQueryInput;
