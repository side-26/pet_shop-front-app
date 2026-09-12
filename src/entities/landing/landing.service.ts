import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  LandingDiscountLimitDTO,
  LandingFeaturedProductDTO,
  LandingPetDTO,
  LandingPetDetailDTO,
  LandingPetTypeDTO,
  LandingPopularBrandDTO,
  LandingPopularProductDTO,
  LandingProductDetailDTO,
  LandingProductDTO,
  LandingSlugDTO,
} from './landing.dto';
import { landingDiscountLimitSchema, landingSlugSchema } from './landing.schema';

const landingCache = new EntityTag('landing');
const featuredPetTypesCacheKey = 'pet-types:featured';
const allPetTypesCacheKey = 'pet-types:all';
const discountedProductsCacheKey = (limit: number) => `products:discounted:${limit}`;
const featuredProductsCacheKey = 'products:featured';
const popularProductsCacheKey = 'products:popular';
const popularBrandsCacheKey = 'brands:popular';
const popularPetsCacheKey = 'pets:popular';
const recentPetsCacheKey = 'pets:recent';

async function fetchLandingList<T>(path: string, key: string, query?: Record<string, number>) {
  'use cache';

  landingCache.cacheLife({ stale: 600 });
  landingCache.registerList(key);
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
