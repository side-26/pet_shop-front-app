import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
} from './sub-categories.service';

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
const category = '507f1f77bcf86cd799439011';
const subCategory = {
  id,
  title: 'غذای خشک',
  category,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};

describe('sub-category service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('gets an authenticated filtered list through a private cache', async () => {
    const response = { isSuccess: true as const, message: null, data: [subCategory] };
    customFetcherMock.mockResolvedValue(response);

    await expect(getAllSubCategories({ category })).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/sub-categories',
      method: 'GET',
      query: { category },
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith(`category=${category}`);
  });

  it('requests the unfiltered list with an empty query', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });

    await getAllSubCategories();
    expect(customFetcherMock).toHaveBeenCalledWith(expect.objectContaining({ query: {} }));
    expect(registerListMock).toHaveBeenCalledWith('');
  });

  it('gets authenticated detail through the private detail cache', async () => {
    const response = { isSuccess: true as const, message: null, data: subCategory };
    customFetcherMock.mockResolvedValue(response);

    await expect(getSubCategoryById(id)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/sub-categories/${id}`,
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerDetailMock).toHaveBeenCalledWith(id);
  });

  it('creates with the exact JSON body and invalidates only the list', async () => {
    const input = { title: 'غذای خشک', category };
    const response = { isSuccess: true as const, message: 'created', data: subCategory };
    customFetcherMock.mockResolvedValue(response);

    await expect(createSubCategory(input)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/sub-categories',
      method: 'POST',
      body: input,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });

  it('updates with the exact JSON body and invalidates list and detail', async () => {
    const input = { title: 'غذای ویژه', category };
    const response = { isSuccess: true as const, message: 'updated', data: subCategory };
    customFetcherMock.mockResolvedValue(response);

    await expect(updateSubCategory(id, input)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/sub-categories/${id}`,
      method: 'PUT',
      body: input,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });

  it('deletes and invalidates list and detail', async () => {
    const response = { isSuccess: true as const, message: 'deleted', data: { id } };
    customFetcherMock.mockResolvedValue(response);

    await expect(deleteSubCategory(id)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/sub-categories/${id}`,
      method: 'DELETE',
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });

  it('does not invalidate cache after failed mutations', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });

    await createSubCategory({ title: 'غذای خشک', category });
    await updateSubCategory(id, { title: 'غذای ویژه', category });
    await deleteSubCategory(id);

    expect(invalidateListMock).not.toHaveBeenCalled();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });
});
