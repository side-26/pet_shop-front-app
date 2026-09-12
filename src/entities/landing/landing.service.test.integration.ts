import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import type {
  LandingFeaturedProductDTO,
  LandingPopularBrandDTO,
  LandingPopularProductDTO,
  LandingProductDTO,
} from './landing.dto';
import {
  getAllLandingPetTypes,
  getDiscountedLandingProducts,
  getFeaturedLandingProducts,
  getFeaturedLandingPetTypes,
  invalidateAllLandingPetTypes,
  invalidateLandingFeaturedProducts,
  getLandingPetBySlug,
  getLandingProductBySlug,
  getPopularLandingPets,
  getPopularLandingBrands,
  getPopularLandingProducts,
  getRecentLandingPets,
  invalidateLandingRecentPets,
  invalidateLandingPopularBrands,
} from './landing.service';

const mocks = vi.hoisted(() => ({
  cacheLife: vi.fn(),
  detail: vi.fn((id: string) => `landing:detail:${id}`),
  invalidateQuery: vi.fn(),
  list: 'landing:list',
  query: vi.fn((key: string) => `landing:query:${key}`),
  registerDetail: vi.fn(),
  registerList: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function Mock(this: Record<string, unknown>) {
    Object.assign(this, mocks);
  }),
}));

const fetcher = vi.mocked(customFetcher);

const landingProduct: LandingProductDTO = {
  id: 'product-1',
  title: 'غذای گربه',
  mainImage: 'https://cdn.example.com/cat-food.webp',
  mainImageThumbnail: 'data:image/webp;base64,AAAA',
  summary: 'غذای کامل',
  price: 200_000,
  discountPercentage: 20,
  discountPrice: 40_000,
};

const featuredProduct: LandingFeaturedProductDTO = {
  tag: 'mostPurchased',
  product: landingProduct,
};

const popularProduct: LandingPopularProductDTO = {
  ...landingProduct,
  slug: 'cat-food',
  discountPrice: 160_000,
};

const popularBrand: LandingPopularBrandDTO = {
  id: 'brand-1',
  title: 'Royal Canin',
  title_fa: 'رویال کنین',
  logo: 'https://cdn.example.com/royal-canin.webp',
  thumbnailLogo: 'data:image/webp;base64,AAAA',
  slug: 'royal-canin',
  productCount: 12,
};

describe('landing service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: [landingProduct] as never });
  });

  it('requests every public landing collection with shared caching', async () => {
    await getFeaturedLandingPetTypes();
    await getAllLandingPetTypes();
    await getDiscountedLandingProducts({ limit: 2 });
    await getFeaturedLandingProducts();
    await getPopularLandingProducts();
    await getPopularLandingBrands();
    await getPopularLandingPets();
    await getRecentLandingPets();

    expect(fetcher.mock.calls.map(([options]) => options)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: '/landing/pet-types', auth: false, cache: 'force-cache' }),
        expect.objectContaining({
          url: '/landing/pet-types/all',
          auth: false,
          cache: 'force-cache',
        }),
        expect.objectContaining({
          url: '/landing/products/discounted',
          query: { limit: 2 },
          auth: false,
          cache: 'force-cache',
        }),
        expect.objectContaining({
          url: '/landing/products/popular',
          auth: false,
          cache: 'force-cache',
        }),
        expect.objectContaining({
          url: '/landing/products/featured',
          auth: false,
          cache: 'force-cache',
        }),
        expect.objectContaining({
          url: '/landing/brands/popular',
          auth: false,
          cache: 'force-cache',
        }),
        expect.objectContaining({
          url: '/landing/pets/popular',
          auth: false,
          cache: 'force-cache',
        }),
        expect.objectContaining({
          url: '/landing/pets/recent',
          auth: false,
          cache: 'force-cache',
        }),
      ]),
    );
    expect(mocks.registerList).toHaveBeenCalledTimes(8);
    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/landing/pet-types/all',
        next: { tags: ['landing:list', 'landing:query:pet-types:all'] },
      }),
    );
  });

  it('invalidates only the all-pet-types query cache for a targeted retry', () => {
    invalidateAllLandingPetTypes();
    invalidateLandingFeaturedProducts();
    invalidateLandingPopularBrands();
    invalidateLandingRecentPets();

    expect(mocks.invalidateQuery).toHaveBeenCalledWith('pet-types:all');
    expect(mocks.invalidateQuery).toHaveBeenCalledWith('products:featured');
    expect(mocks.invalidateQuery).toHaveBeenCalledWith('brands:popular');
    expect(mocks.invalidateQuery).toHaveBeenCalledWith('pets:recent');
  });

  it('exposes the backend selection tag with every featured product', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: [featuredProduct] });

    await expect(getFeaturedLandingProducts()).resolves.toEqual({
      isSuccess: true,
      message: null,
      data: [featuredProduct],
    });
  });

  it('exposes the API-calculated discount amount for product sections', async () => {
    const result = await getDiscountedLandingProducts({ limit: 1 });

    expect(result).toEqual({ isSuccess: true, message: null, data: [landingProduct] });
    if (!result.isSuccess) throw new Error('Expected the mocked landing request to succeed.');
    expect(result.data[0]?.discountPrice).toBe(40_000);
    expect(result.data[0]?.mainImageThumbnail).toBe('data:image/webp;base64,AAAA');
  });

  it('exposes the final payable price and public slug returned for popular product cards', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: [popularProduct] });

    await expect(getPopularLandingProducts()).resolves.toEqual({
      isSuccess: true,
      message: null,
      data: [popularProduct],
    });
  });

  it('exposes enabled brands with their enabled-product counts', async () => {
    fetcher.mockResolvedValue({ isSuccess: true, message: null, data: [popularBrand] });

    await expect(getPopularLandingBrands()).resolves.toEqual({
      isSuccess: true,
      message: null,
      data: [popularBrand],
    });
  });

  it('validates and requests customer-safe details by slug', async () => {
    await getLandingPetBySlug('persian-cat');
    await getLandingProductBySlug('cat-food');

    expect(fetcher.mock.calls.map(([options]) => options.url)).toEqual([
      '/landing/pets/persian-cat',
      '/landing/products/cat-food',
    ]);
    expect(mocks.registerDetail).toHaveBeenNthCalledWith(1, 'persian-cat');
    expect(mocks.registerDetail).toHaveBeenNthCalledWith(2, 'cat-food');
    await expect(getLandingPetBySlug('invalid_slug')).rejects.toBeDefined();
  });
});
