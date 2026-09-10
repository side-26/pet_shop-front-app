import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  LandingDiscountLimitDTO,
  LandingPetDTO,
  LandingPetDetailDTO,
  LandingPetTypeDTO,
  LandingProductDetailDTO,
  LandingProductDTO,
  LandingSlugDTO,
} from './landing.dto';
import { landingDiscountLimitSchema, landingSlugSchema } from './landing.schema';

const landingCache = new EntityTag('landing');

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
    next: { tags: [landingCache.list] },
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
  return fetchLandingList<LandingPetTypeDTO[]>('/landing/pet-types', 'pet-types:featured');
}

export function getAllLandingPetTypes() {
  return fetchLandingList<LandingPetTypeDTO[]>('/landing/pet-types/all', 'pet-types:all');
}

export async function getDiscountedLandingProducts(input: Partial<LandingDiscountLimitDTO> = {}) {
  const { limit } = await landingDiscountLimitSchema.validate(input, { stripUnknown: true });
  return fetchLandingList<LandingProductDTO[]>(
    '/landing/products/discounted',
    `products:discounted:${limit}`,
    {
      limit,
    },
  );
}

export function getPopularLandingProducts() {
  return fetchLandingList<LandingProductDTO[]>('/landing/products/popular', 'products:popular');
}

export function getPopularLandingPets() {
  return fetchLandingList<LandingPetDTO[]>('/landing/pets/popular', 'pets:popular');
}

export async function getLandingPetBySlug(input: LandingSlugDTO['slug']) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return fetchLandingDetail<LandingPetDetailDTO>(`/landing/pets/${slug}`, slug);
}

export async function getLandingProductBySlug(input: LandingSlugDTO['slug']) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return fetchLandingDetail<LandingProductDetailDTO>(`/landing/products/${slug}`, slug);
}
