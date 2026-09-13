import 'server-only';

import { customFetcher, type QueryParams } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  LandingDiscountLimitDTO,
  LandingFeaturedProductDTO,
  LandingPetDTO,
  LandingPetDetailDTO,
  LandingPetTypeDTO,
  LandingPopularBrandDTO,
  LandingPopularProductDTO,
  LandingProductListPageDTO,
  LandingProductListRequestDTO,
  LandingProductDetailDTO,
  LandingProductDTO,
  LandingSlugDTO,
} from './landing.dto';
import {
  landingDiscountLimitSchema,
  landingProductListQuerySchema,
  DEFAULT_LANDING_PRODUCT_LIST_PAGE_SIZE,
  landingSlugSchema,
} from './landing.schema';

const landingCache = new EntityTag('landing');
const featuredPetTypesCacheKey = 'pet-types:featured';
const allPetTypesCacheKey = 'pet-types:all';
const discountedProductsCacheKey = (limit: number) => `products:discounted:${limit}`;
const featuredProductsCacheKey = 'products:featured';
const popularProductsCacheKey = 'products:popular';
const popularBrandsCacheKey = 'brands:popular';
const popularPetsCacheKey = 'pets:popular';
const recentPetsCacheKey = 'pets:recent';
const landingProductListCacheKey = (query: LandingProductListRequestDTO & { limit: number }) =>
  `products:list:v3:${new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, String(value)]),
  ).toString()}`;

async function fetchLandingList<T>(
  path: string,
  key: string,
  query?: QueryParams,
  fetchCache: 'force-cache' | 'no-store' = 'force-cache',
) {
  'use cache';

  landingCache.cacheLife({ stale: 600 });
  landingCache.registerList(key);

  if (fetchCache === 'no-store') {
    return customFetcher<T>({
      url: path,
      method: 'GET',
      query,
      auth: false,
      cache: 'no-store',
    });
  }

  return customFetcher<T>({
    url: path,
    method: 'GET',
    query,
    auth: false,
    cache: 'force-cache',
    next: { tags: [landingCache.list, landingCache.query(key)] },
  });
}

async function fetchLandingDetail<T>(path: string, slug: string) {
  'use cache';

  landingCache.cacheLife({ stale: 600 });
  landingCache.registerDetail(slug);
  return customFetcher<T>({
    url: path,
    method: 'GET',
    auth: false,
    cache: 'force-cache',
    next: { tags: [landingCache.detail(slug)] },
  });
}

export function getFeaturedLandingPetTypes() {
  return fetchLandingList<LandingPetTypeDTO[]>('/landing/pet-types', featuredPetTypesCacheKey);
}

export function getAllLandingPetTypes() {
  return fetchLandingList<LandingPetTypeDTO[]>('/landing/pet-types/all', allPetTypesCacheKey);
}

export function invalidateAllLandingPetTypes() {
  landingCache.invalidateQuery(allPetTypesCacheKey);
}

export function invalidateLandingPetTypeCollections() {
  landingCache.invalidateQuery(featuredPetTypesCacheKey);
  landingCache.invalidateQuery(allPetTypesCacheKey);
}

export async function getDiscountedLandingProducts(input: Partial<LandingDiscountLimitDTO> = {}) {
  const { limit } = await landingDiscountLimitSchema.validate(input, { stripUnknown: true });
  return fetchLandingList<LandingProductDTO[]>(
    '/landing/products/discounted',
    discountedProductsCacheKey(limit),
    {
      limit,
    },
  );
}

export function getPopularLandingProducts() {
  return fetchLandingList<LandingPopularProductDTO[]>(
    '/landing/products/popular',
    popularProductsCacheKey,
  );
}

export function getPopularLandingBrands() {
  return fetchLandingList<LandingPopularBrandDTO[]>(
    '/landing/brands/popular',
    popularBrandsCacheKey,
  );
}

export function getFeaturedLandingProducts() {
  return fetchLandingList<LandingFeaturedProductDTO[]>(
    '/landing/products/featured',
    featuredProductsCacheKey,
  );
}

export async function getLandingProductList(input: Partial<LandingProductListRequestDTO> = {}) {
  const query = await landingProductListQuerySchema.validate(
    { ...input, limit: DEFAULT_LANDING_PRODUCT_LIST_PAGE_SIZE },
    { stripUnknown: true },
  );
  const key = landingProductListCacheKey(query);
  return fetchLandingList<LandingProductListPageDTO>('/landing/products', key, query, 'no-store');
}

export function getPopularLandingPets() {
  return fetchLandingList<LandingPetDTO[]>('/landing/pets/popular', popularPetsCacheKey);
}

export function getRecentLandingPets() {
  return fetchLandingList<LandingPetDTO[]>('/landing/pets/recent', recentPetsCacheKey);
}

export function invalidateLandingHomeOffers() {
  landingCache.invalidateQuery(discountedProductsCacheKey(5));
}

export function invalidateLandingPopularProducts() {
  landingCache.invalidateQuery(popularProductsCacheKey);
}

export function invalidateLandingPopularBrands() {
  landingCache.invalidateQuery(popularBrandsCacheKey);
}

export function invalidateLandingFeaturedProducts() {
  landingCache.invalidateQuery(featuredProductsCacheKey);
}

/** Product catalogue queries share the landing list tag, so one product mutation expires every variant. */
export function invalidateLandingProductLists() {
  landingCache.invalidateList();
}

export function invalidateLandingPopularPets() {
  landingCache.invalidateQuery(popularPetsCacheKey);
}

export function invalidateLandingRecentPets() {
  landingCache.invalidateQuery(recentPetsCacheKey);
}

export async function getLandingPetBySlug(input: LandingSlugDTO['slug']) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return fetchLandingDetail<LandingPetDetailDTO>(`/landing/pets/${slug}`, slug);
}

export async function getLandingProductBySlug(input: LandingSlugDTO['slug']) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return fetchLandingDetail<LandingProductDetailDTO>(`/landing/products/${slug}`, slug);
}
