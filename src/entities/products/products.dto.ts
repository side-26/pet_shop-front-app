import type { PaginateDataDTO } from '@/lib/api/pagination.dto';
import type {
  CustomerProductQueryInput,
  ManagementProductQueryInput,
  ProductInput,
  UpdateProductBaseInfoInput,
  UpdateProductImagesInput,
  UpdateProductPriceInput,
} from './products.schema';

export type ProductRelationDTO = { id: string; title: string; [key: string]: unknown };
export type ManagementProductDTO = {
  id: string;
  title: string;
  mainImage: string;
  images: string[];
  mainImageThumbnail: string;
  summary?: string;
  description: string;
  category: ProductRelationDTO | string;
  subCategory: ProductRelationDTO | string | null;
  quantity: number;
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
> & { category: string; subCategory: string | null };
export type CustomerProductDetailDTO = CustomerProductListItemDTO & {
  images: string[];
  category: ProductRelationDTO;
  subCategory: ProductRelationDTO | null;
};
export type ProductImagesDTO = {
  mainImage: string;
  mainImageThumbnail: string;
  imagesList: string[];
};
export type ProductPriceDTO = { price: number; discountPercentage: number };
export type ProductBaseInfoDTO = Pick<
  ManagementProductDTO,
  'title' | 'summary' | 'description' | 'category' | 'subCategory' | 'quantity'
>;
export type ManagementProductsPageDTO = PaginateDataDTO<ManagementProductDTO>;
export type CustomerProductsPageDTO = PaginateDataDTO<CustomerProductListItemDTO>;
export type CreateProductDTO = ProductInput;
export type UpdateProductBaseInfoDTO = UpdateProductBaseInfoInput;
export type UpdateProductImagesDTO = UpdateProductImagesInput;
export type UpdateProductPriceDTO = UpdateProductPriceInput;
export type CustomerProductQueryDTO = CustomerProductQueryInput;
export type ManagementProductQueryDTO = ManagementProductQueryInput;
export type DeleteProductResultDTO = { id: string };
