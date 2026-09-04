import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';
import {
  createUser,
  changeCurrentUserPassword,
  deleteUserById,
  disableUserById,
  enableUserById,
  getCurrentUser,
  getAllPaginatedUsers,
  userGetDetailById,
  updateCurrentUserProfile,
} from './users.service';

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
vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: {
    cacheLife: ReturnType<typeof vi.fn>;
    registerDetail: ReturnType<typeof vi.fn>;
    registerList: ReturnType<typeof vi.fn>;
    invalidateList: ReturnType<typeof vi.fn>;
    invalidateDetail: ReturnType<typeof vi.fn>;
  }) {
    this.cacheLife = cacheLifeMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
    this.invalidateList = invalidateListMock;
    this.invalidateDetail = invalidateDetailMock;
  }),
}));

const customFetcherMock = vi.mocked(customFetcher);
const getSessionMock = vi.mocked(getSession);

describe('getCurrentUser service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets the authenticated user through the current-user endpoint without caching', async () => {
    const response = { isSuccess: true as const, message: null, data: { userId: 'user-42' } };
    getSessionMock.mockResolvedValue({ userId: 'user-42' } as never);
    customFetcherMock.mockResolvedValue(response);

    await expect(getCurrentUser()).resolves.toBe(response);

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/current',
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 360 });
    expect(registerDetailMock).toHaveBeenCalledWith('user-42');
  });
});

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

    const query = { page: 1, limit: 20 };
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/paginate',
      method: 'GET',
      query,
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    expect(registerListMock).toHaveBeenCalledWith('limit=20&page=1');
  });

  it('omits a null enabled-status filter before requesting the API', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });

    await getAllPaginatedUsers({ page: 1, limit: 20, isEnable: null });

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/paginate',
      method: 'GET',
      query: { page: 1, limit: 20 },
      auth: true,
      cache: 'no-store',
    });
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

describe('current-user mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends editable profile fields as authenticated multipart data and invalidates the current-user cache', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: 'updated',
      data: { userId: 'user-1' },
    });

    await updateCurrentUserProfile('user-1', {
      firstName: 'Ali',
      lastName: 'Rezaei',
      avatar: null,
    });

    const request = customFetcherMock.mock.calls[0]?.[0];
    expect(request).toMatchObject({
      url: '/users/edit-info',
      method: 'PUT',
      auth: true,
      cache: 'no-store',
    });
    const body = request?.body as FormData;
    expect(body.get('firstName')).toBe('Ali');
    expect(body.get('lastName')).toBe('Rezaei');
    expect(body.has('avatar')).toBe(false);
    expect(invalidateDetailMock).toHaveBeenCalledWith('user-1');
  });

  it('does not invalidate the current-user cache when editing personal information fails', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });

    await updateCurrentUserProfile('user-1', {
      firstName: 'Ali',
      lastName: 'Rezaei',
      avatar: null,
    });

    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });

  it('sends the authenticated user id with the documented password-change body', async () => {
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: 'updated', data: undefined });

    await changeCurrentUserPassword('user-1', {
      oldPassword: 'password123',
      password: 'new-password',
      repeatPassword: 'new-password',
    });

    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/change-password',
      method: 'PUT',
      body: {
        userId: 'user-1',
        oldPassword: 'password123',
        password: 'new-password',
        repeatPassword: 'new-password',
      },
      auth: true,
      cache: 'no-store',
    });
  });
});

describe('deleteUserById service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes through an authenticated request and invalidates detail and list caches on success', async () => {
    const response = { isSuccess: true as const, message: 'deleted', data: undefined };
    customFetcherMock.mockResolvedValue(response);

    await expect(deleteUserById('507f1f77bcf86cd799439011')).resolves.toBe(response);
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/507f1f77bcf86cd799439011',
      method: 'DELETE',
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateDetailMock).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(invalidateListMock).toHaveBeenCalledOnce();
  });

  it('returns the message error without invalidating caches when deletion fails', async () => {
    const response = {
      isSuccess: false as const,
      message: 'user was not found',
      data: { messages: {}, details: {} },
    };
    customFetcherMock.mockResolvedValue(response);

    await expect(deleteUserById('507f1f77bcf86cd799439011')).resolves.toBe(response);
    expect(invalidateDetailMock).not.toHaveBeenCalled();
    expect(invalidateListMock).not.toHaveBeenCalled();
  });
});

describe.each([
  ['enable', enableUserById],
  ['disable', disableUserById],
] as const)('%s user service', (status, updateUserStatus) => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('puts to the status endpoint and invalidates affected user caches on success', async () => {
    const id = '507f1f77bcf86cd799439011';
    customFetcherMock.mockResolvedValue({ isSuccess: true, message: 'updated', data: undefined });

    await expect(updateUserStatus(id)).resolves.toMatchObject({ isSuccess: true });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: `/users/${status}/${id}`,
      method: 'PUT',
      body: undefined,
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
    expect(invalidateListMock).toHaveBeenCalledOnce();
  });

  it('does not invalidate caches when the status request fails', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });

    await updateUserStatus('507f1f77bcf86cd799439011');
    expect(invalidateDetailMock).not.toHaveBeenCalled();
    expect(invalidateListMock).not.toHaveBeenCalled();
  });
});
