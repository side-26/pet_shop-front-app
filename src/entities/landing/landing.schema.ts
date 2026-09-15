import { boolean, mixed, number, object, string, type InferType } from 'yup';

import '@/configs/yup.config';

export const DEFAULT_LANDING_PRODUCT_LIST_PAGE_SIZE = 20;
export const DEFAULT_LANDING_PET_LIST_PAGE_SIZE = 20;

export const landingSlugSchema = object({
  slug: string()
    .trim()
    .min(2)
    .max(160)
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
});

export const landingDiscountLimitSchema = object({
  limit: number().integer().min(1).max(100).default(4).required(),
});

export const landingSearchQuerySchema = object({
  search: string().trim().min(1).max(100).required(),
});

const objectIdList = string()
  .transform((value, originalValue) =>
    Array.isArray(originalValue) ? originalValue.join(',') : value,
  )
  .trim()
  .matches(/^[a-f\d]{24}(?:,[a-f\d]{24})*$/i);

export const landingProductListRequestSchema = object({
  category: objectIdList.optional(),
  subCategory: objectIdList.optional(),
  brand: objectIdList.optional(),
  priceFrom: number().min(0).optional(),
  priceTo: number().min(0).optional(),
  isEnable: boolean().optional(),
  sort: mixed<'most-valued' | 'less-valued' | 'most-sales' | 'less-sales'>()
    .oneOf(['most-valued', 'less-valued', 'most-sales', 'less-sales'])
    .default('most-sales')
    .required(),
  page: number().integer().min(1).default(1).required(),
}).test('ordered-price-range', 'حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد.', (value) => {
  if (value?.priceFrom === undefined || value.priceTo === undefined) return true;
  return value.priceFrom <= value.priceTo;
});

export const landingProductListQuerySchema = landingProductListRequestSchema.shape({
  limit: number()
    .integer()
    .min(1)
    .max(100)
    .default(DEFAULT_LANDING_PRODUCT_LIST_PAGE_SIZE)
    .required(),
});

export const landingPetListRequestSchema = object({
  petType: objectIdList.optional(),
  breed: objectIdList.optional(),
  priceFrom: number().min(0).optional(),
  priceTo: number().min(0).optional(),
  isEnable: boolean().optional(),
  sort: mixed<'most-valued' | 'less-valued' | 'most-sales' | 'less-sales'>()
    .oneOf(['most-valued', 'less-valued', 'most-sales', 'less-sales'])
    .default('most-sales')
    .required(),
  page: number().integer().min(1).default(1).required(),
}).test('ordered-price-range', 'حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد.', (value) => {
  if (value?.priceFrom === undefined || value.priceTo === undefined) return true;
  return value.priceFrom <= value.priceTo;
});

export const landingPetListQuerySchema = landingPetListRequestSchema.shape({
  limit: number().integer().min(1).max(100).default(DEFAULT_LANDING_PET_LIST_PAGE_SIZE).required(),
});

export type LandingSlugInput = InferType<typeof landingSlugSchema>;
export type LandingDiscountLimitInput = InferType<typeof landingDiscountLimitSchema>;
export type LandingSearchQueryInput = InferType<typeof landingSearchQuerySchema>;
export type LandingProductListRequestInput = InferType<typeof landingProductListRequestSchema>;
export type LandingProductListQueryInput = InferType<typeof landingProductListQuerySchema>;
export type LandingPetListRequestInput = InferType<typeof landingPetListRequestSchema>;
export type LandingPetListQueryInput = InferType<typeof landingPetListQuerySchema>;
