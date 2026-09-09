import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createBrand,
  deleteBrand,
  disableBrand,
  getAllBrands,
  getBrandById,
  getEnabledBrands,
} from './brands.service';

const {
  cacheLifeMock,
  invalidateDetailMock,
  invalidateListMock,
  registerDetailMock,
  registerListMock,
} = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  invalidateDetailMock: vi.fn(),
  invalidateListMock: vi.fn(),
  registerDetailMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.list = 'brands:list';
    this.cacheLife = cacheLifeMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);
const id = '507f1f77bcf86cd799439012';
const logo = new File(['logo'], 'brand.webp', { type: 'image/webp' });
const brand = {
  id,
  title: 'Royal Canin',
  title_fa: 'رویال کنین',
  slug: 'royal-canin',
  isEnable: true,
  description: '',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};

describe('brand service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses a private authenticated cache for management list and detail reads', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [brand] });
    await getAllBrands({ includeDisabled: true });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/brands',
      method: 'GET',
      query: { includeDisabled: true },
      auth: true,
      cache: 'no-store',
    });
    expect(registerListMock).toHaveBeenCalledWith('includeDisabled=true');

    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: brand });
    await getBrandById(id);
    expect(customFetcherMock).toHaveBeenLastCalledWith({
      url: `/brands/${id}`,
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(registerDetailMock).toHaveBeenCalledWith(id);
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
  });

  it('uses a private authenticated cache for the enabled endpoint', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [brand] });
    await getEnabledBrands();
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/brands/enabled',
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(registerListMock).toHaveBeenCalledWith('enabled');
  });

  it('sends multipart create data and invalidates the list only after success', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: 'created', data: brand });
    await createBrand({
      title: brand.title,
      title_fa: brand.title_fa,
      description: { type: 'doc' },
      isEnable: true,
      logo,
    });
    const body = customFetcherMock.mock.calls[0]?.[0].body as FormData;
    expect(Object.fromEntries(body.entries())).toEqual({
      title: brand.title,
      title_fa: brand.title_fa,
      description: '{"type":"doc"}',
      isEnable: 'true',
      logo,
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });

  it('invalidates list and detail only for successful status and deletion mutations', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: 'ok', data: brand });
    await disableBrand(id);
    await deleteBrand(id);
    expect(invalidateListMock).toHaveBeenCalledTimes(2);
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);

    vi.clearAllMocks();
    customFetcherMock.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });
    await disableBrand(id);
    expect(invalidateListMock).not.toHaveBeenCalled();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });
});
