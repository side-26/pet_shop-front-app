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
  getLandingProductList,
} from './landing.service';
import { landingProductListRequestSchema } from './landing.schema';

export async function getLandingProductListAction(input: unknown = {}) {
  const query = await landingProductListRequestSchema.validate(input, { stripUnknown: true });
  return getLandingProductList(query);
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
