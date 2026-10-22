'use server';

import { refresh } from 'next/cache';
import { connection } from 'next/server';
import { unwrapResult } from '@/lib/utils';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  getAllLandingPetTypes,
  getDiscountedLandingProducts,
  getLandingPetBySlug,
  getLandingWishlist,
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
} from './landing.service';
import {
  landingDiscountLimitSchema,
  landingPetListRequestSchema,
  landingProductListRequestSchema,
  landingSlugSchema,
} from './landing.schema';

function accessError(message: string): FetcherError {
  return {
    isSuccess: false,
    message,
    data: { messages: {}, details: {} },
  };
}

export async function getAllLandingPetTypesAction() {
  return getAllLandingPetTypes();
}

export async function getLandingWishlistAction() {
  const session = await getSession();
  return session
    ? getLandingWishlist(session.userId)
    : accessError('برای مشاهده علاقه‌مندی‌ها وارد حساب کاربری شوید.');
}

/** Server-rendered home categories unwrap failures for their local Suspense error boundary. */
export async function getHomeLandingPetTypesAction() {
  await connection();
  return unwrapResult(getAllLandingPetTypes(), 'دریافت دسته‌بندی حیوانات انجام نشد.');
}

/** Server-rendered product categories unwrap failures for their local Suspense error boundary. */
export async function getProductLandingPetTypesAction() {
  await connection();
  return unwrapResult(getAllLandingPetTypes(), 'دریافت دسته‌بندی محصولات انجام نشد.');
}

export async function getDiscountedLandingProductsAction(input: unknown = {}) {
  await connection();
  const value = await landingDiscountLimitSchema.validate(input, { stripUnknown: true });
  return getDiscountedLandingProducts(value);
}

export async function getPopularLandingProductsAction() {
  await connection();
  return unwrapResult(getPopularLandingProducts(), 'دریافت محصولات محبوب انجام نشد.');
}

export async function getPopularLandingBrandsAction() {
  await connection();
  return unwrapResult(getPopularLandingBrands(), 'دریافت برندهای محبوب انجام نشد.');
}

export async function getPopularLandingPetsAction() {
  return getPopularLandingPets();
}

export async function getRecentLandingPetsAction() {
  return getRecentLandingPets();
}

export async function getLandingProductListAction(input: unknown = {}) {
  const query = await landingProductListRequestSchema.validate(input, { stripUnknown: true });
  return unwrapResult(getLandingProductList(query));
}

export async function getLandingPetListAction(input: unknown = {}) {
  const query = await landingPetListRequestSchema.validate(input, { stripUnknown: true });
  return unwrapResult(getLandingPetList(query));
}

export async function getLandingPetBySlugAction(input: unknown) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return unwrapResult(getLandingPetBySlug(slug), 'نمایش حیوان انجام نشد.');
}

export async function getPublicLandingPetBySlugAction(input: unknown) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return getLandingPetBySlug(slug);
}

export async function getLandingProductBySlugAction(input: unknown) {
  const { slug } = await landingSlugSchema.validate({ slug: input }, { stripUnknown: true });
  return unwrapResult(getLandingProductBySlug(slug), 'نمایش محصول انجام نشد.');
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
