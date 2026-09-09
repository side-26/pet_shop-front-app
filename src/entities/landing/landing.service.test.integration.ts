import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import type { LandingProductDTO } from './landing.dto';
import {
  getAllLandingPetTypes,
  getDiscountedLandingProducts,
  getFeaturedLandingPetTypes,
  getLandingPetBySlug,
  getLandingProductBySlug,
  getPopularLandingProducts,
} from './landing.service';

const mocks = vi.hoisted(() => ({
  cacheLife: vi.fn(),
  detail: vi.fn((id: string) => `landing:detail:${id}`),
  list: 'landing:list',
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
  summary: 'غذای کامل',
  price: 200_000,
  discountPercentage: 20,
  discountPrice: 40_000,
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
    await getPopularLandingProducts();

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
      ]),
    );
    expect(mocks.registerList).toHaveBeenCalledTimes(4);
  });

  it('exposes the API-calculated discount amount for product sections', async () => {
    const result = await getDiscountedLandingProducts({ limit: 1 });

    expect(result).toEqual({ isSuccess: true, message: null, data: [landingProduct] });
    if (!result.isSuccess) throw new Error('Expected the mocked landing request to succeed.');
    expect(result.data[0]?.discountPrice).toBe(40_000);
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
