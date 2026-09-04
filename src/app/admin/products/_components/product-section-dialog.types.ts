import type {
  getProductFormOptionsAction,
  getProductImagesAction,
  getProductMainInfoAction,
  getProductPriceAction,
} from '@/entities/products/products.actions';

export type ProductSection = 'main-info' | 'price' | 'images';
export type ProductSectionRequest =
  | ReturnType<typeof getProductMainInfoAction>
  | ReturnType<typeof getProductPriceAction>
  | ReturnType<typeof getProductImagesAction>;
export type ProductFormOptionsRequest = ReturnType<typeof getProductFormOptionsAction>;
