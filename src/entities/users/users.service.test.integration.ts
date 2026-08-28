import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';
import { createUser, getAllPaginatedUsers, userGetDetailById } from './users.service';

const { cacheLifeMock, invalidateListMock, registerDetailMock, registerListMock } = vi.hoisted(
  () => ({
    cacheLifeMock: vi.fn(),
    invalidateListMock: vi.fn(),
    registerDetailMock: vi.fn(),
    registerListMock: vi.fn(),
  }),
);

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: {
    cacheLife: ReturnType<typeof vi.fn>;
    registerDetail: ReturnType<typeof vi.fn>;
    registerList: ReturnType<typeof vi.fn>;
    invalidateList: ReturnType<typeof vi.fn>;
  }) {
    this.cacheLife = cacheLifeMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
    this.invalidateList = invalidateListMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);

describe('userGetDetailById service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets a user detail through an authenticated six-minute private cache', async () => {
    const response = { isSuccess: true as const, message: null, data: { _id: 'user-42' } };
    customFetcherMock.mockResolvedValue(response);

    await expect(userGetDetailById('user-42')).resolves.toBe(response);

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/user-42',
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 360 });
    expect(registerDetailMock).toHaveBeenCalledWith('user-42');
  });
});

describe('getAllPaginatedUsers service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets paginated users through an authenticated private cache', async () => {
    const query = {
      fullName: 'Ali',
      role: 'admin' as const,
      phoneNumber: '09123456789',
      nationalCode: '0012345678',
      page: 2,
      limit: 20,
      isEnable: true,
      sort: 'asc' as const,
    };
    const response = { isSuccess: true as const, message: null, data: { items: [] } };
    customFetcherMock.mockResolvedValue(response);

    await expect(getAllPaginatedUsers(query)).resolves.toEqual(response);

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/paginate',
      method: 'GET',
      query,
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith(
      'fullName=Ali&isEnable=true&limit=20&nationalCode=0012345678&page=2&phoneNumber=09123456789&role=admin&sort=asc',
    );
  });

  it('applies endpoint defaults before the authenticated request', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });

    await getAllPaginatedUsers();

    const query = { page: 1, limit: 20, isEnable: true };
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/paginate',
      method: 'GET',
      query,
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith('isEnable=true&limit=20&page=1');
  });
});

describe('createUser service', () => {
  const input = {
    phoneNumber: '09123456789',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'customer' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts the exact authenticated request body and invalidates the users list on success', async () => {
    const response = { isSuccess: true as const, message: 'created', data: { _id: 'user-1' } };
    customFetcherMock.mockResolvedValue(response);

    await expect(createUser(input)).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users',
      method: 'POST',
      body: input,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
  });

  it('does not invalidate the users list when creation fails', async () => {
    const response = {
      isSuccess: false as const,
      message: 'failed',
      data: { messages: {}, details: {} },
    };
    customFetcherMock.mockResolvedValue(response);

    await expect(createUser(input)).resolves.toBe(response);
    expect(invalidateListMock).not.toHaveBeenCalled();
  });
});
