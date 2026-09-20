import 'server-only';

import { customFetcher, type QueryParams } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';
import { getSession } from '@/utils/session';

import type {
  LandingDiscountLimitDTO,
  LandingFeaturedProductDTO,
  LandingPetDTO,
  LandingPetListPageDTO,
  LandingPetListRequestDTO,
  LandingPetDetailDTO,
  LandingPetTypeDTO,
  LandingPopularBrandDTO,
  LandingPopularProductDTO,
  LandingProductListPageDTO,
  LandingProductListRequestDTO,
  LandingProductDetailDTO,
  LandingProductDTO,
  LandingSlugDTO,
  LandingSearchQueryDTO,
  LandingSearchResultDTO,
} from './landing.dto';
import {
  landingDiscountLimitSchema,
  landingProductListQuerySchema,
  DEFAULT_LANDING_PRODUCT_LIST_PAGE_SIZE,
  DEFAULT_LANDING_PET_LIST_PAGE_SIZE,
  landingPetListQuerySchema,
  landingSlugSchema,
  landingSearchQuerySchema,
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
const landingSearchCacheKey = (search: string) => `search:${search}`;
const landingProductListCacheKey = (query: LandingProductListRequestDTO & { limit: number }) =>
  `products:list:v3:${new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, String(value)]),
  ).toString()}`;
const landingPetListCacheKey = (query: LandingPetListRequestDTO & { limit: number }) =>
  `pets:list:v1:${new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, String(value)]),
  ).toString()}`;

async function fetchLandingList<T>(path: string, key: string, query?: QueryParams) {
  'use cache';

  landingCache.cacheLife({ stale: 600 });
  landingCache.registerList(key);

  return customFetcher<T>({
    url: path,
    method: 'GET',
    query,
    auth: false,
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
  });
}

async function fetchAuthenticatedLandingProductDetail(slug: string) {
  'use cache: private';

  landingCache.cacheLife({ stale: 360 });
  landingCache.registerDetail(slug);
  return customFetcher<LandingProductDetailDTO>({
    url: `/landing/products/${slug}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
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

export async function getLandingSearch(input: LandingSearchQueryDTO) {
  const { search } = await landingSearchQuerySchema.validate(input, { stripUnknown: true });
  return fetchLandingList<LandingSearchResultDTO[]>(
    '/landing/search',
    landingSearchCacheKey(search),
    { search },
  );
}

export async function getLandingProductList(input: Partial<LandingProductListRequestDTO> = {}) {
  const query = await landingProductListQuerySchema.validate(
    { ...input, limit: DEFAULT_LANDING_PRODUCT_LIST_PAGE_SIZE },
    { stripUnknown: true },
  );
  const key = landingProductListCacheKey(query);
  return fetchLandingList<LandingProductListPageDTO>('/landing/products', key, query);
}

export async function getLandingPetList(input: Partial<LandingPetListRequestDTO> = {}) {
  const query = await landingPetListQuerySchema.validate(
    { ...input, limit: DEFAULT_LANDING_PET_LIST_PAGE_SIZE },
    { stripUnknown: true },
  );
  return fetchLandingList<LandingPetListPageDTO>(
    '/landing/pets-paginate',
    landingPetListCacheKey(query),
    query,
  );
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

/**
 * Product and pet mutations identify records by ID while landing details are cached by slug.
 * Expire the landing entity when a precise detail tag cannot be determined safely.
 */
export function invalidateLandingCatalog() {
  landingCache.invalidateAll();
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

export function invalidateLandingProductDetail(slug: string) {
  landingCache.invalidateDetail(slug);
}

export function invalidateLandingPetDetail(slug: string) {
  landingCache.invalidateDetail(slug);
}

export async function getLandingPetBySlug(input: LandingSlugDTO['slug']) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return fetchLandingDetail<LandingPetDetailDTO>(`/landing/pets/${slug}`, slug);
}

export async function getLandingProductBySlug(input: LandingSlugDTO['slug']) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  const session = await getSession();
  if (session) return fetchAuthenticatedLandingProductDetail(slug);
  return fetchLandingDetail<LandingProductDetailDTO>(`/landing/products/${slug}`, slug);
}

export async function getPublicLandingProductBySlug(input: LandingSlugDTO['slug']) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return fetchLandingDetail<LandingProductDetailDTO>(`/landing/products/${slug}`, slug);
}
