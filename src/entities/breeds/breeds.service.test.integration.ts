import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { getBreeds, getBreedsPage, updateBreed } from './breeds.service';

const { cacheLifeMock, invalidateDetailMock, invalidateListMock, registerListMock } = vi.hoisted(
  () => ({
    cacheLifeMock: vi.fn(),
    invalidateDetailMock: vi.fn(),
    invalidateListMock: vi.fn(),
    registerListMock: vi.fn(),
  }),
);

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.registerList = registerListMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);

describe('breed API service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('uses the authenticated private-cache-compatible paginated GET contract', async () => {
    const response = {
      isSuccess: true as const,
      message: null,
      data: {
        result: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        },
      },
    };
    customFetcherMock.mockResolvedValue(response);

    await expect(
      getBreedsPage({
        title: 'گلدن',
        petType: '507f1f77bcf86cd799439011',
        country: 'اسکاتلند',
        size: 0,
        activityLevel: 4,
        search: 'رتریور',
      }),
    ).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/breeds/paginate',
      method: 'GET',
      query: {
        title: 'گلدن',
        petType: '507f1f77bcf86cd799439011',
        country: 'اسکاتلند',
        size: 0,
        activityLevel: 4,
        search: 'رتریور',
        includeDisabled: true,
        page: 1,
        limit: 10,
        sort: 'title',
      },
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledOnce();
  });

  it('uses the backend list endpoint with an optional pet-type query filter', async () => {
    const response = { isSuccess: true as const, message: null, data: [] };
    customFetcherMock.mockResolvedValue(response);

    await expect(getBreeds({ petType: '507f1f77bcf86cd799439011' })).resolves.toBe(response);

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/breeds',
      method: 'GET',
      query: {
        petType: '507f1f77bcf86cd799439011',
        includeDisabled: true,
        page: 1,
        limit: 10,
        sort: 'title',
      },
      auth: true,
      cache: 'no-store',
    });
    expect(registerListMock).toHaveBeenCalledOnce();
  });

  it('omits an unchanged image and invalidates detail/list only after update success', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: {} });
    const id = '507f1f77bcf86cd799439012';

    await expect(
      updateBreed(id, {
        title: 'گلدن رتریور',
        petType: '507f1f77bcf86cd799439011',
        country: 'اسکاتلند',
        ageAverage: '۱۰ تا ۱۲ سال',
        size: 4,
        activityLevel: 4,
        enable: true,
      }),
    ).resolves.toMatchObject({ isSuccess: true, message: 'تغییرات نژاد با موفقیت ذخیره شد.' });

    const options = customFetcherMock.mock.calls[0][0];
    expect(options).toMatchObject({
      url: `/breeds/${id}`,
      method: 'PUT',
      auth: true,
      cache: 'no-store',
    });
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).has('mainImage')).toBe(false);
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
    expect(invalidateListMock).toHaveBeenCalledOnce();
  });
});
