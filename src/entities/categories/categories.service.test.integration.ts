import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createCategory,
  deleteCategory,
  disableCategory,
  enableCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from './categories.service';

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
    this.cacheLife = cacheLifeMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);
const id = '507f1f77bcf86cd799439012';
const petType = '507f1f77bcf86cd799439011';
const mainImage = new File(['image'], 'category.webp', { type: 'image/webp' });
const category = {
  id,
  title: 'غذای خشک',
  petType,
  mainImage: 'https://cdn.example.com/categories/main/category.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
  slug: 'غذای-خشک',
  isEnable: true,
  createdAt: '2026-08-31T00:00:00.000Z',
  updatedAt: '2026-08-31T00:00:00.000Z',
};

describe('category service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('gets an authenticated filtered list through a deterministic private cache', async () => {
    const response = { isSuccess: true as const, message: null, data: [category] };
    customFetcherMock.mockResolvedValue(response);

    await expect(getAllCategories({ petType, includeDisabled: true })).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/categories',
      method: 'GET',
      query: { includeDisabled: true, petType },
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith(`includeDisabled=true&petType=${petType}`);
  });

  it('applies backend list defaults before requesting categories', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });

    await getAllCategories();
    expect(customFetcherMock).toHaveBeenCalledWith(
      expect.objectContaining({ query: { includeDisabled: false } }),
    );
    expect(registerListMock).toHaveBeenCalledWith('includeDisabled=false');
  });

  it('gets an authenticated category detail through the private detail cache', async () => {
    const response = { isSuccess: true as const, message: null, data: category };
    customFetcherMock.mockResolvedValue(response);

    await expect(getCategoryById(id)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/categories/${id}`,
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(registerDetailMock).toHaveBeenCalledWith(id);
  });

  it('creates the exact category body and invalidates only the list', async () => {
    const input = { title: 'غذای خشک', petType, mainImage, isEnable: true };
    const response = { isSuccess: true as const, message: 'created', data: category };
    customFetcherMock.mockResolvedValue(response);

    await expect(createCategory(input)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/categories',
        method: 'POST',
        auth: true,
        cache: 'no-store',
      }),
    );
    const body = customFetcherMock.mock.calls[0]?.[0].body as FormData;
    expect(Object.fromEntries(body.entries())).toEqual({
      title: 'غذای خشک',
      petType,
      mainImage,
      isEnable: 'true',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });

  it('updates the exact category body and invalidates list and detail', async () => {
    const input = { title: 'غذای ویژه', petType, mainImage, isEnable: false };
    const response = { isSuccess: true as const, message: 'updated', data: category };
    customFetcherMock.mockResolvedValue(response);

    await expect(updateCategory(id, input)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/categories/${id}`,
        method: 'PUT',
        auth: true,
        cache: 'no-store',
      }),
    );
    const body = customFetcherMock.mock.calls[0]?.[0].body as FormData;
    expect(Object.fromEntries(body.entries())).toEqual({
      title: 'غذای ویژه',
      petType,
      mainImage,
      isEnable: 'false',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });

  it.each([
    ['enable', enableCategory],
    ['disable', disableCategory],
  ] as const)('uses the backend PUT /categories/%s/:id status endpoint', async (status, action) => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: 'updated', data: category });

    await action(id);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/categories/${status}/${id}`,
      method: 'PUT',
      body: undefined,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });

  it('deletes a category and invalidates its list and detail caches', async () => {
    const response = { isSuccess: true as const, message: 'deleted', data: { id } };
    customFetcherMock.mockResolvedValue(response);

    await expect(deleteCategory(id)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/categories/${id}`,
      method: 'DELETE',
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });

  it('does not invalidate any cache after a failed mutation', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });

    await createCategory({ title: 'غذای خشک', petType, mainImage, isEnable: true });
    await updateCategory(id, { title: 'غذای خشک', petType, mainImage, isEnable: true });
    await disableCategory(id);
    await deleteCategory(id);

    expect(invalidateListMock).not.toHaveBeenCalled();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });
});
