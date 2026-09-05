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
  updateProductBaseInfo,
  updateProductImages,
  updateProductPrice,
} from './products.service';
const mocks = vi.hoisted(() => ({
  cacheLife: vi.fn(),
  invalidateDetail: vi.fn(),
  invalidateList: vi.fn(),
  registerDetail: vi.fn(),
  registerList: vi.fn(),
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
const fetcher = vi.mocked(customFetcher);
const id = '507f1f77bcf86cd799439010';
const category = '507f1f77bcf86cd799439011';
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
    expect(fetcher.mock.calls.map(([o]) => o)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: '/products', auth: false, cache: 'force-cache' }),
        expect.objectContaining({
          url: `/products/customer/${id}`,
          auth: false,
          cache: 'force-cache',
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
      ]),
    );
    expect(mocks.registerList).toHaveBeenCalled();
  });
  it('serializes multipart images and invalidates only successful mutations', async () => {
    const input = {
      title: 'غذا',
      description,
      category,
      quantity: 2,
      images: { images: [image], mainImageIndex: 0 },
    };
    await createProduct(input);
    await updateProductBaseInfo(id, { title: 'جدید' });
    await updateProductImages(id, { images: input.images });
    await updateProductPrice(id, { price: 20 });
    const body = fetcher.mock.calls[0]?.[0].body as FormData;
    expect(body.get('description')).toBe(JSON.stringify(description));
    expect(body.get('mainImage')).toBe(image);
    expect(body.get('quantity')).toBe('2');
    expect(fetcher.mock.calls[1]?.[0]).toMatchObject({
      url: `/products/${id}/main-info`,
      method: 'PUT',
      body: { title: 'جدید' },
    });
    expect(mocks.invalidateList).toHaveBeenCalled();
    expect(mocks.invalidateDetail).toHaveBeenCalledWith(id);
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
  });
});
