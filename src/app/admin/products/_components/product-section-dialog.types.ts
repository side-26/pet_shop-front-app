import type {
  getProductFormOptionsAction,
  getProductImagesAction,
  getProductMainInfoAction,
} from '@/entities/products/products.actions';

export type ProductSection = 'main-info' | 'images';
export type ProductSectionRequest =
  ReturnType<typeof getProductMainInfoAction> | ReturnType<typeof getProductImagesAction>;
export type ProductFormOptionsRequest = ReturnType<typeof getProductFormOptionsAction>;
