// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getLandingProductListAction,
  getLandingPetListAction,
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
  getLandingPetList,
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
  getLandingPetList: vi.fn(),
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
  it('validates the backend product-list filters and keeps its page size out of the action input', async () => {
    await getLandingProductListAction({
      brand: '507f1f77bcf86cd799439011,507f1f77bcf86cd799439012',
      isEnable: 'false',
      limit: 100,
      page: '2',
      priceFrom: '100',
      priceTo: '300',
      sort: 'less-valued',
      unknown: 'removed',
    });

    expect(getLandingProductList).toHaveBeenCalledWith({
      brand: '507f1f77bcf86cd799439011,507f1f77bcf86cd799439012',
      isEnable: false,
      page: 2,
      priceFrom: 100,
      priceTo: 300,
      sort: 'less-valued',
    });
  });

  it('validates backend pet-list filters before calling its landing service', async () => {
    await getLandingPetListAction({
      petType: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
      breed: '507f1f77bcf86cd799439013',
      isEnable: 'true',
      page: '2',
      sort: 'less-sales',
    });

    expect(getLandingPetList).toHaveBeenCalledWith({
      breed: '507f1f77bcf86cd799439013',
      isEnable: true,
      page: 2,
      petType: '507f1f77bcf86cd799439011,507f1f77bcf86cd799439012',
      sort: 'less-sales',
    });
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
