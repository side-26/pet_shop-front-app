import { beforeEach, describe, expect, it, vi } from 'vitest';
import { customFetcher } from '@/lib/api/customFetcher';
import {
  createProduct,
  deleteProduct,
  disableProduct,
  getCustomerProduct,
  getCustomerProducts,
  getManagementProduct,
  getManagementProducts,
  getProductMainInfo,
  getProductPropertyDefinitions,
  getProductWeights,
  replaceProductPropertyDefinitions,
  replaceProductWeights,
  updateProductUserRate,
  updateProductBaseInfo,
  updateProductImages,
} from './products.service';
const mocks = vi.hoisted(() => ({
  cacheLife: vi.fn(),
  invalidateDetail: vi.fn(),
  invalidateList: vi.fn(),
  registerDetail: vi.fn(),
  registerList: vi.fn(),
}));
const { invalidateLandingCatalogMock } = vi.hoisted(() => ({
  invalidateLandingCatalogMock: vi.fn(),
}));
vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function Mock(this: Record<string, unknown>) {
    Object.assign(this, mocks, {
      detail: (id: string) => `products:detail:${id}`,
      list: 'products:list',
    });
  }),
}));
vi.mock('@/entities/landing/landing.service', () => ({
  invalidateLandingCatalog: invalidateLandingCatalogMock,
}));
const fetcher = vi.mocked(customFetcher);
const id = '507f1f77bcf86cd799439010';
const category = '507f1f77bcf86cd799439011';
const brand = '507f1f77bcf86cd799439012';
const description = { type: 'doc' as const, content: [] };
const image = new File(['x'], 'product.webp', { type: 'image/webp' });
const success = { isSuccess: true as const, message: 'ok', data: {} as never };
describe('product service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetcher.mockResolvedValue(success);
  });
  it('uses distinct public cached and authenticated private read contracts', async () => {
    await getCustomerProducts({ category });
    await getCustomerProduct(id);
    await getManagementProducts({
      title: 'غذای ویژه',
      category,
      quantity: 12,
      price: 275000,
      isEnable: false,
    });
    await getManagementProduct(id);
    await getProductMainInfo(id);
    await getProductWeights(id);
    await getProductPropertyDefinitions(id);
    expect(fetcher.mock.calls.map(([o]) => o)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: '/products', auth: false }),
        expect.objectContaining({
          url: `/products/customer/${id}`,
          auth: false,
        }),
        expect.objectContaining({
          url: '/products/paginate',
          auth: true,
          cache: 'no-store',
          query: {
            title: 'غذای ویژه',
            category,
            quantity: 12,
            price: 275000,
            isEnable: false,
            includeDisabled: false,
            page: 1,
            limit: 10,
            sort: 'createdAt',
          },
        }),
        expect.objectContaining({ url: `/products/manage/${id}`, auth: true, cache: 'no-store' }),
        expect.objectContaining({
          url: `/products/${id}/main-info`,
          auth: true,
          cache: 'no-store',
        }),
        expect.objectContaining({
          url: `/products/weights/${id}`,
          auth: false,
        }),
        expect.objectContaining({
          url: `/products/property-definitions/${id}`,
          auth: false,
        }),
      ]),
    );
    expect(mocks.registerList).toHaveBeenCalled();
  });
  it('serializes multipart images and invalidates only successful mutations', async () => {
    const input = {
      title: 'غذا',
      description,
      category,
      brand,
      images: { images: [image], mainImageIndex: 0 },
    };
    await createProduct(input);
    await updateProductBaseInfo(id, { title: 'جدید', brand });
    await updateProductImages(id, { images: input.images });
    await replaceProductWeights({
      id,
      weights: [{ metric: 'KG', quantity: 2, value: 1, price: 20, discountPercentage: 10 }],
    });
    const body = fetcher.mock.calls[0]?.[0].body as FormData;
    expect(body.get('description')).toBe(JSON.stringify(description));
    expect(body.get('mainImage')).toBe(image);
    expect(body.get('brand')).toBe(brand);
    expect(fetcher.mock.calls[1]?.[0]).toMatchObject({
      url: `/products/${id}/main-info`,
      method: 'PUT',
      body: { title: 'جدید', brand },
    });
    expect(mocks.invalidateList).toHaveBeenCalled();
    expect(mocks.invalidateDetail).toHaveBeenCalledWith(id);
    expect(fetcher.mock.calls[3]?.[0]).toMatchObject({
      url: '/products/range',
      method: 'PUT',
      body: {
        id,
        weights: [{ metric: 'KG', quantity: 2, value: 1, price: 20, discountPercentage: 10 }],
      },
    });
    expect(invalidateLandingCatalogMock).toHaveBeenCalledTimes(4);
  });
  it('does not invalidate failed status or delete mutations', async () => {
    fetcher.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });
    await disableProduct(id);
    await deleteProduct(id);
    expect(fetcher.mock.calls.map(([o]) => o.url)).toEqual([
      `/products/${id}/disable`,
      `/products/${id}`,
    ]);
    expect(mocks.invalidateList).not.toHaveBeenCalled();
    expect(invalidateLandingCatalogMock).not.toHaveBeenCalled();
  });
  it('replaces management property definitions through their dedicated endpoint', async () => {
    await replaceProductPropertyDefinitions({
      id,
      propertyDefinitions: [
        { key: 'flavor', label: 'طعم', valueType: 'enum', required: false, options: ['مرغ'] },
      ],
    });

    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/products/property-definitions',
        method: 'PUT',
        auth: true,
        cache: 'no-store',
      }),
    );
    expect(mocks.invalidateDetail).toHaveBeenCalledWith(id);
  });
  it('updates the authenticated customer rating and invalidates affected product reads after success', async () => {
    await updateProductUserRate({ id, userRate: 4.3 });
    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/products/${id}/user-rate`,
        method: 'PATCH',
        body: { userRate: 4.3 },
        auth: true,
        cache: 'no-store',
      }),
    );
    expect(mocks.invalidateDetail).toHaveBeenCalledWith(id);
    expect(mocks.invalidateList).toHaveBeenCalled();
  });
  it('does not invalidate product reads when a rating update fails', async () => {
    fetcher.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });

    await updateProductUserRate({ id, userRate: 4.3 });

    expect(mocks.invalidateDetail).not.toHaveBeenCalled();
    expect(mocks.invalidateList).not.toHaveBeenCalled();
    expect(invalidateLandingCatalogMock).not.toHaveBeenCalled();
  });
});
