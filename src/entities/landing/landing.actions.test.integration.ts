// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getAllLandingPetTypesAction,
  getDiscountedLandingProductsAction,
  getLandingPetBySlugAction,
  getLandingProductBySlugAction,
  getLandingProductListAction,
  getLandingPetListAction,
  getPopularLandingBrandsAction,
  getPopularLandingPetsAction,
  getPopularLandingProductsAction,
  getPublicLandingProductBySlugAction,
  getRecentLandingPetsAction,
  getLandingSearchAction,
  retryAllLandingPetTypesAction,
  retryLandingFeaturedProductsAction,
  retryLandingHomeOffersAction,
  retryLandingPopularProductsAction,
  retryLandingPopularBrandsAction,
  retryLandingPopularPetsAction,
  retryLandingRecentPetsAction,
  retryLandingProductDetailAction,
  retryLandingPetDetailAction,
} from './landing.actions';
import {
  getAllLandingPetTypes,
  getDiscountedLandingProducts,
  getLandingPetBySlug,
  getLandingProductBySlug,
  getLandingProductList,
  getLandingPetList,
  getPopularLandingBrands,
  getPopularLandingPets,
  getPopularLandingProducts,
  getPublicLandingProductBySlug,
  getRecentLandingPets,
  getLandingSearch,
  invalidateAllLandingPetTypes,
  invalidateLandingFeaturedProducts,
  invalidateLandingHomeOffers,
  invalidateLandingPopularProducts,
  invalidateLandingPopularBrands,
  invalidateLandingPopularPets,
  invalidateLandingRecentPets,
  invalidateLandingProductDetail,
  invalidateLandingPetDetail,
} from './landing.service';

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }));

vi.mock('next/cache', () => ({ refresh: refreshMock }));
vi.mock('./landing.service', () => ({
  getAllLandingPetTypes: vi.fn(),
  getDiscountedLandingProducts: vi.fn(),
  getLandingPetBySlug: vi.fn(),
  getLandingProductBySlug: vi.fn(),
  getLandingProductList: vi.fn(),
  getLandingPetList: vi.fn(),
  getPopularLandingBrands: vi.fn(),
  getPopularLandingPets: vi.fn(),
  getPopularLandingProducts: vi.fn(),
  getPublicLandingProductBySlug: vi.fn(),
  getRecentLandingPets: vi.fn(),
  getLandingSearch: vi.fn(),
  invalidateAllLandingPetTypes: vi.fn(),
  invalidateLandingFeaturedProducts: vi.fn(),
  invalidateLandingHomeOffers: vi.fn(),
  invalidateLandingPopularProducts: vi.fn(),
  invalidateLandingPopularBrands: vi.fn(),
  invalidateLandingPopularPets: vi.fn(),
  invalidateLandingRecentPets: vi.fn(),
  invalidateLandingProductDetail: vi.fn(),
  invalidateLandingPetDetail: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('retryAllLandingPetTypesAction', () => {
  it('validates read-action input and delegates uncached orchestration to the service cache layer', async () => {
    await getAllLandingPetTypesAction();
    await getDiscountedLandingProductsAction({ limit: '5', ignored: true });
    await getPopularLandingProductsAction();
    await getPopularLandingBrandsAction();
    await getPopularLandingPetsAction();
    await getRecentLandingPetsAction();
    await getLandingPetBySlugAction('persian-cat');
    await getLandingProductBySlugAction('product-0de16436');
    await getPublicLandingProductBySlugAction('product-0de16436');

    expect(getAllLandingPetTypes).toHaveBeenCalledOnce();
    expect(getDiscountedLandingProducts).toHaveBeenCalledWith({ limit: 5 });
    expect(getPopularLandingProducts).toHaveBeenCalledOnce();
    expect(getPopularLandingBrands).toHaveBeenCalledOnce();
    expect(getPopularLandingPets).toHaveBeenCalledOnce();
    expect(getRecentLandingPets).toHaveBeenCalledOnce();
    expect(getLandingPetBySlug).toHaveBeenCalledWith('persian-cat');
    expect(getLandingProductBySlug).toHaveBeenCalledWith('product-0de16436');
    expect(getPublicLandingProductBySlug).toHaveBeenCalledWith('product-0de16436');
  });

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

  it('normalizes a catalogue search query before requesting results', async () => {
    await getLandingSearchAction({ search: '  غذای گربه  ', unknown: 'removed' });

    expect(getLandingSearch).toHaveBeenCalledWith({ search: 'غذای گربه' });
  });

  it('expires only the landing pet-type cache before refreshing the client router', async () => {
    await retryAllLandingPetTypesAction();

    expect(invalidateAllLandingPetTypes).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('validates and expires one product detail before refreshing it', async () => {
    await retryLandingProductDetailAction('product-0de16436');

    expect(invalidateLandingProductDetail).toHaveBeenCalledWith('product-0de16436');
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('validates and expires one pet detail before refreshing it', async () => {
    await retryLandingPetDetailAction('persian-cat');

    expect(invalidateLandingPetDetail).toHaveBeenCalledWith('persian-cat');
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
