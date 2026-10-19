// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getAllLandingPetTypesAction,
  getHomeLandingPetTypesAction,
  getProductLandingPetTypesAction,
  getDiscountedLandingProductsAction,
  getLandingPetBySlugAction,
  getPublicLandingPetBySlugAction,
  getLandingProductBySlugAction,
  getLandingProductListAction,
  getLandingPetListAction,
  getPopularLandingBrandsAction,
  getPopularLandingPetsAction,
  getPopularLandingProductsAction,
  getPublicLandingProductBySlugAction,
  getRecentLandingPetsAction,
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

const { connectionMock, refreshMock } = vi.hoisted(() => ({
  connectionMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ refresh: refreshMock }));
vi.mock('next/server', () => ({ connection: connectionMock }));
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
  connectionMock.mockResolvedValue(undefined);
  vi.mocked(getAllLandingPetTypes).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: [],
  });
  vi.mocked(getPopularLandingProducts).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: [],
  });
  vi.mocked(getPopularLandingBrands).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: [],
  });
  vi.mocked(getLandingProductList).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: {} as never,
  });
  vi.mocked(getLandingPetList).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: {} as never,
  });
  vi.mocked(getLandingProductBySlug).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: {} as never,
  });
  vi.mocked(getLandingPetBySlug).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: {} as never,
  });
  vi.mocked(getPublicLandingProductBySlug).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: {} as never,
  });
});

describe('retryAllLandingPetTypesAction', () => {
  it('validates read-action input and delegates uncached orchestration to the service cache layer', async () => {
    await getAllLandingPetTypesAction();
    await getProductLandingPetTypesAction();
    await getDiscountedLandingProductsAction({ limit: '5', ignored: true });
    await getPopularLandingProductsAction();
    await getPopularLandingBrandsAction();
    await getPopularLandingPetsAction();
    await getRecentLandingPetsAction();
    await getLandingPetBySlugAction('persian-cat');
    await getPublicLandingPetBySlugAction('persian-cat');
    await getLandingProductBySlugAction(
      'تشویقی-آموزشی-سگ-با-طعم-گوشت-سگ-تشویقی-و-اسنک-تشویقی-آموزشی',
    );
    await getPublicLandingProductBySlugAction(
      'تشویقی-آموزشی-سگ-با-طعم-گوشت-سگ-تشویقی-و-اسنک-تشویقی-آموزشی',
    );

    expect(getAllLandingPetTypes).toHaveBeenCalledTimes(2);
    expect(connectionMock).toHaveBeenCalledTimes(3);
    expect(getDiscountedLandingProducts).toHaveBeenCalledWith({ limit: 5 });
    expect(getPopularLandingProducts).toHaveBeenCalledOnce();
    expect(getPopularLandingBrands).toHaveBeenCalledOnce();
    expect(getPopularLandingPets).toHaveBeenCalledOnce();
    expect(getRecentLandingPets).toHaveBeenCalledOnce();
    expect(getLandingPetBySlug).toHaveBeenCalledWith('persian-cat');
    expect(getLandingProductBySlug).toHaveBeenCalledWith(
      'تشویقی-آموزشی-سگ-با-طعم-گوشت-سگ-تشویقی-و-اسنک-تشویقی-آموزشی',
    );
    expect(getPublicLandingProductBySlug).toHaveBeenCalledWith(
      'تشویقی-آموزشی-سگ-با-طعم-گوشت-سگ-تشویقی-و-اسنک-تشویقی-آموزشی',
    );
  });

  it('unwraps product-detail failures for Server Component error boundaries', async () => {
    vi.mocked(getLandingProductBySlug).mockResolvedValue({
      isSuccess: false,
      message: 'نمایش محصول انجام نشد.',
      data: { messages: {}, details: {} },
    });

    await expect(getLandingProductBySlugAction('product-slug')).rejects.toThrow(
      'نمایش محصول انجام نشد.',
    );
  });

  it('unwraps home pet-type failures for its Server Component error boundary', async () => {
    vi.mocked(getAllLandingPetTypes).mockResolvedValue({
      isSuccess: false,
      message: 'دسته‌بندی‌ها در دسترس نیستند.',
      data: { messages: {}, details: {} },
    });

    await expect(getHomeLandingPetTypesAction()).rejects.toThrow('دسته‌بندی‌ها در دسترس نیستند.');
  });

  it('unwraps product-category failures for its Server Component error boundary', async () => {
    vi.mocked(getAllLandingPetTypes).mockResolvedValue({
      isSuccess: false,
      message: 'دسته‌بندی محصولات در دسترس نیستند.',
      data: { messages: {}, details: {} },
    });

    await expect(getProductLandingPetTypesAction()).rejects.toThrow(
      'دسته‌بندی محصولات در دسترس نیستند.',
    );
  });

  it('unwraps popular-product failures for its Server Component error boundary', async () => {
    vi.mocked(getPopularLandingProducts).mockResolvedValue({
      isSuccess: false,
      message: 'محصولات محبوب در دسترس نیستند.',
      data: { messages: {}, details: {} },
    });

    await expect(getPopularLandingProductsAction()).rejects.toThrow(
      'محصولات محبوب در دسترس نیستند.',
    );
  });

  it('unwraps popular-brand failures for its Server Component error boundary', async () => {
    vi.mocked(getPopularLandingBrands).mockResolvedValue({
      isSuccess: false,
      message: 'برندهای محبوب در دسترس نیستند.',
      data: { messages: {}, details: {} },
    });

    await expect(getPopularLandingBrandsAction()).rejects.toThrow('برندهای محبوب در دسترس نیستند.');
  });

  it('unwraps pet-detail failures for Server Component error boundaries', async () => {
    vi.mocked(getLandingPetBySlug).mockResolvedValue({
      isSuccess: false,
      message: 'نمایش حیوان انجام نشد.',
      data: { messages: {}, details: {} },
    });

    await expect(getLandingPetBySlugAction('pet-slug')).rejects.toThrow('نمایش حیوان انجام نشد.');
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

  it('expires only the landing pet-type cache before refreshing the client router', async () => {
    await retryAllLandingPetTypesAction();

    expect(invalidateAllLandingPetTypes).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('validates and expires one product detail before refreshing it', async () => {
    await retryLandingProductDetailAction(
      'تشویقی-آموزشی-سگ-با-طعم-گوشت-سگ-تشویقی-و-اسنک-تشویقی-آموزشی',
    );

    expect(invalidateLandingProductDetail).toHaveBeenCalledWith(
      'تشویقی-آموزشی-سگ-با-طعم-گوشت-سگ-تشویقی-و-اسنک-تشویقی-آموزشی',
    );
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
