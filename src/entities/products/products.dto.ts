import type { PaginateDataDTO } from '@/entities/pagination/pagination.dto';
import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';
import type { RichTextFormValue } from '@/lib/rich-text';
import type {
  CustomerProductQueryInput,
  ManagementProductQueryInput,
  ProductInput,
  UpdateProductBaseInfoInput,
  UpdateProductImagesInput,
  UpdateProductUserRateInput,
  ReplaceProductWeightsInput,
  ReplaceProductPropertyDefinitionsInput,
} from './products.schema';

export type ProductRelationDTO = {
  id: string;
  title: string;
  title_fa?: string;
  [key: string]: unknown;
};
export type ProductWeightDTO = {
  /** Section responses use `id`; full product responses retain Mongoose's `_id`. */
  id?: string;
  _id?: string;
  metric: string;
  quantity: number;
  value: number;
  price: number;
  discountPercentage: number;
};
export type ProductPropertyDefinitionDTO = {
  key: string;
  label: string;
  valueType: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  defaultValue?: unknown;
};
export type ManagementProductDTO = {
  id: string;
  title: string;
  mainImage: string;
  images: string[];
  mainImageThumbnail: string;
  summary?: string;
  description: RichTextFormValue;
  category: ProductRelationDTO | string;
  brand: ProductRelationDTO | string;
  subCategory: ProductRelationDTO | string | null;
  quantity: number;
  weights?: ProductWeightDTO[];
  userRate?: number;
  userRateCount?: number;
  price: number;
  discountPercentage: number;
  isEnable: boolean;
  slug: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
};
export type CustomerProductListItemDTO = Pick<
  ManagementProductDTO,
  | 'id'
  | 'title'
  | 'mainImage'
  | 'mainImageThumbnail'
  | 'summary'
  | 'description'
  | 'quantity'
  | 'price'
  | 'discountPercentage'
  | 'isEnable'
  | 'slug'
> & { category: string; brand: string; subCategory: string | null };
export type CustomerProductDetailDTO = Omit<
  CustomerProductListItemDTO,
  'category' | 'brand' | 'subCategory'
> & {
  images: string[];
  category: ProductRelationDTO;
  brand: ProductRelationDTO;
  subCategory: ProductRelationDTO | null;
};
export type ProductImagesDTO = {
  mainImage: string;
  mainImageThumbnail: string;
  imagesList: string[];
};
export type ProductWeightsDTO = ProductWeightDTO[];
export type ReplaceProductWeightsResultDTO = { id: string; weights: ProductWeightDTO[] };
export type ProductPropertyDefinitionsDTO = ProductPropertyDefinitionDTO[];
export type ReplaceProductPropertyDefinitionsResultDTO = {
  id: string;
  propertyDefinitions: ProductPropertyDefinitionDTO[];
};
export type ProductUserRateDTO = { userRate: number; userRateCount: number };
export type ProductBaseInfoDTO = Pick<
  ManagementProductDTO,
  | 'title'
  | 'summary'
  | 'description'
  | 'category'
  | 'brand'
  | 'subCategory'
  | 'quantity'
  | 'weights'
>;
export type ManagementProductListItemDTO = ManagementProductDTO & { salesVolume: number };
export type ManagementProductsPageDTO = PaginateDataDTO<ManagementProductListItemDTO>;
export type CustomerProductsPageDTO = PaginateDataDTO<
  CustomerProductListItemDTO,
  FilterDTO,
  SortDTO
>;
export type CreateProductDTO = ProductInput;
export type UpdateProductBaseInfoDTO = UpdateProductBaseInfoInput;
export type UpdateProductImagesDTO = UpdateProductImagesInput;
export type ReplaceProductWeightsDTO = ReplaceProductWeightsInput;
export type ReplaceProductPropertyDefinitionsDTO = ReplaceProductPropertyDefinitionsInput;
export type UpdateProductUserRateDTO = UpdateProductUserRateInput;
export type CustomerProductQueryDTO = CustomerProductQueryInput;
export type ManagementProductQueryDTO = ManagementProductQueryInput;
export type DeleteProductResultDTO = { id: string };
