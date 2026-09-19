'use server';

import { refresh } from 'next/cache';

import {
  invalidateAllLandingPetTypes,
  invalidateLandingFeaturedProducts,
  invalidateLandingHomeOffers,
  invalidateLandingPopularProducts,
  invalidateLandingPopularBrands,
  invalidateLandingPopularPets,
  invalidateLandingRecentPets,
  invalidateLandingProductDetail,
  getLandingProductList,
  getLandingPetList,
  getLandingSearch,
} from './landing.service';
import {
  landingPetListRequestSchema,
  landingProductListRequestSchema,
  landingSearchQuerySchema,
  landingSlugSchema,
} from './landing.schema';

export async function getLandingProductListAction(input: unknown = {}) {
  const query = await landingProductListRequestSchema.validate(input, { stripUnknown: true });
  return getLandingProductList(query);
}

export async function getLandingPetListAction(input: unknown = {}) {
  const query = await landingPetListRequestSchema.validate(input, { stripUnknown: true });
  return getLandingPetList(query);
}

export async function getLandingSearchAction(input: unknown) {
  const query = await landingSearchQuerySchema.validate(input, { stripUnknown: true });
  return getLandingSearch(query);
}

export async function retryLandingProductDetailAction(slug: string) {
  const value = await landingSlugSchema.validate({ slug }, { stripUnknown: true });
  invalidateLandingProductDetail(value.slug);
  refresh();
}

/** Expires only the home pet-type collection, then requests updated route data. */
export async function retryAllLandingPetTypesAction() {
  invalidateAllLandingPetTypes();
  refresh();
}

export async function retryLandingHomeOffersAction() {
  invalidateLandingHomeOffers();
  refresh();
}

export async function retryLandingFeaturedProductsAction() {
  invalidateLandingFeaturedProducts();
  refresh();
}

export async function retryLandingPopularProductsAction() {
  invalidateLandingPopularProducts();
  refresh();
}

export async function retryLandingPopularBrandsAction() {
  invalidateLandingPopularBrands();
  refresh();
}

export async function retryLandingPopularPetsAction() {
  invalidateLandingPopularPets();
  refresh();
}

export async function retryLandingRecentPetsAction() {
  invalidateLandingRecentPets();
  refresh();
}
