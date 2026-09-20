'use server';

import { refresh } from 'next/cache';

import {
  getAllLandingPetTypes,
  getDiscountedLandingProducts,
  getLandingPetBySlug,
  invalidateAllLandingPetTypes,
  invalidateLandingFeaturedProducts,
  invalidateLandingHomeOffers,
  invalidateLandingPopularProducts,
  invalidateLandingPopularBrands,
  invalidateLandingPopularPets,
  invalidateLandingRecentPets,
  invalidateLandingProductDetail,
  invalidateLandingPetDetail,
  getLandingProductList,
  getLandingProductBySlug,
  getPopularLandingBrands,
  getPopularLandingPets,
  getPopularLandingProducts,
  getLandingPetList,
  getPublicLandingProductBySlug,
  getRecentLandingPets,
  getLandingSearch,
} from './landing.service';
import {
  landingDiscountLimitSchema,
  landingPetListRequestSchema,
  landingProductListRequestSchema,
  landingSearchQuerySchema,
  landingSlugSchema,
} from './landing.schema';

export async function getAllLandingPetTypesAction() {
  return getAllLandingPetTypes();
}

export async function getDiscountedLandingProductsAction(input: unknown = {}) {
  const value = await landingDiscountLimitSchema.validate(input, { stripUnknown: true });
  return getDiscountedLandingProducts(value);
}

export async function getPopularLandingProductsAction() {
  return getPopularLandingProducts();
}

export async function getPopularLandingBrandsAction() {
  return getPopularLandingBrands();
}

export async function getPopularLandingPetsAction() {
  return getPopularLandingPets();
}

export async function getRecentLandingPetsAction() {
  return getRecentLandingPets();
}

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

export async function getLandingPetBySlugAction(input: unknown) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return getLandingPetBySlug(slug);
}

export async function getLandingProductBySlugAction(input: unknown) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return getLandingProductBySlug(slug);
}

export async function getPublicLandingProductBySlugAction(input: unknown) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return getPublicLandingProductBySlug(slug);
}

export async function retryLandingProductDetailAction(slug: string) {
  const value = await landingSlugSchema.validate({ slug }, { stripUnknown: true });
  invalidateLandingProductDetail(value.slug);
  refresh();
}

export async function retryLandingPetDetailAction(slug: string) {
  const value = await landingSlugSchema.validate({ slug }, { stripUnknown: true });
  invalidateLandingPetDetail(value.slug);
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
