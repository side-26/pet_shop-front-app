// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getLandingProductListAction,
  retryAllLandingPetTypesAction,
  retryLandingFeaturedProductsAction,
  retryLandingHomeOffersAction,
  retryLandingPopularProductsAction,
  retryLandingPopularBrandsAction,
  retryLandingPopularPetsAction,
  retryLandingRecentPetsAction,
} from './landing.actions';
import {
  getLandingProductList,
  invalidateAllLandingPetTypes,
  invalidateLandingFeaturedProducts,
  invalidateLandingHomeOffers,
  invalidateLandingPopularProducts,
  invalidateLandingPopularBrands,
  invalidateLandingPopularPets,
  invalidateLandingRecentPets,
} from './landing.service';

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }));

vi.mock('next/cache', () => ({ refresh: refreshMock }));
vi.mock('./landing.service', () => ({
  getLandingProductList: vi.fn(),
  invalidateAllLandingPetTypes: vi.fn(),
  invalidateLandingFeaturedProducts: vi.fn(),
  invalidateLandingHomeOffers: vi.fn(),
  invalidateLandingPopularProducts: vi.fn(),
  invalidateLandingPopularBrands: vi.fn(),
  invalidateLandingPopularPets: vi.fn(),
  invalidateLandingRecentPets: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('retryAllLandingPetTypesAction', () => {
  it('validates product pagination server-side and keeps its page size out of the action input', async () => {
    await getLandingProductListAction({
      page: 2,
      limit: 100,
      sort: 'less-valued',
      unknown: 'removed',
    });

    expect(getLandingProductList).toHaveBeenCalledWith({ page: 2, sort: 'less-valued' });
  });

  it('expires only the landing pet-type cache before refreshing the client router', async () => {
    await retryAllLandingPetTypesAction();

    expect(invalidateAllLandingPetTypes).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('refreshes only the cache scope requested by each landing retry action', async () => {
    await retryLandingHomeOffersAction();
    await retryLandingFeaturedProductsAction();
    await retryLandingPopularProductsAction();
    await retryLandingPopularBrandsAction();
    await retryLandingPopularPetsAction();
    await retryLandingRecentPetsAction();

    expect(invalidateLandingHomeOffers).toHaveBeenCalledOnce();
    expect(invalidateLandingFeaturedProducts).toHaveBeenCalledOnce();
    expect(invalidateLandingPopularProducts).toHaveBeenCalledOnce();
    expect(invalidateLandingPopularBrands).toHaveBeenCalledOnce();
    expect(invalidateLandingPopularPets).toHaveBeenCalledOnce();
    expect(invalidateLandingRecentPets).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledTimes(6);
  });
});
