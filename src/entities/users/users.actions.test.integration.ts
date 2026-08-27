import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import { getAllPaginatedUsersAction } from './users.actions';
import { getAllPaginatedUsers } from './users.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./users.service', () => ({ getAllPaginatedUsers: vi.fn() }));

const getSessionMock = vi.mocked(getSession);
const getAllPaginatedUsersMock = vi.mocked(getAllPaginatedUsers);

const successResponse = {
  isSuccess: true as const,
  message: null,
  data: {
    result: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
    },
  },
};

function session(role: AuthSessionModel['role']): AuthSessionModel {
  return {
    accessExp: 1,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    role,
    sessionExp: 2,
    userId: 'user-1',
  };
}

describe('users actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'validates the query and calls the users service for the %s role',
    async (role) => {
      getSessionMock.mockResolvedValue(session(role));
      getAllPaginatedUsersMock.mockResolvedValue(successResponse);

      await expect(
        getAllPaginatedUsersAction({ page: 2, limit: 50, isEnable: false, unknown: 'removed' }),
      ).resolves.toBe(successResponse);

      expect(getAllPaginatedUsersMock).toHaveBeenCalledWith({
        page: 2,
        limit: 50,
        isEnable: false,
      });
    },
  );

  it('applies query defaults before calling the service', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
    getAllPaginatedUsersMock.mockResolvedValue(successResponse);

    await expect(getAllPaginatedUsersAction()).resolves.toBe(successResponse);
    expect(getAllPaginatedUsersMock).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      isEnable: true,
    });
  });

  it('normalizes URL search-parameter strings before calling the service', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
    getAllPaginatedUsersMock.mockResolvedValue(successResponse);

    await getAllPaginatedUsersAction({ page: '3', limit: '50', isEnable: 'false', sort: 'dsc' });

    expect(getAllPaginatedUsersMock).toHaveBeenCalledWith({
      page: 3,
      limit: 50,
      isEnable: false,
      sort: 'dsc',
    });
  });

  it('returns validation errors without calling the service', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));

    const result = await getAllPaginatedUsersAction({ page: 0, limit: 0 });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.data.messages).toEqual([
        { value: 'page', label: 'page must be greater than or equal to 1' },
        { value: 'limit', label: 'limit must be greater than or equal to 1' },
      ]);
    }
    expect(getAllPaginatedUsersMock).not.toHaveBeenCalled();
  });

  it('rejects an unauthenticated action call before validation or service access', async () => {
    getSessionMock.mockResolvedValue(null);

    await expect(getAllPaginatedUsersAction({ page: 0 })).resolves.toMatchObject({
      isSuccess: false,
      message: 'برای مشاهده کاربران وارد حساب مدیریتی شوید.',
    });
    expect(getAllPaginatedUsersMock).not.toHaveBeenCalled();
  });

  it('rejects a customer action call before service access', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));

    await expect(getAllPaginatedUsersAction()).resolves.toMatchObject({
      isSuccess: false,
      message: 'شما اجازه مشاهده کاربران را ندارید.',
    });
    expect(getAllPaginatedUsersMock).not.toHaveBeenCalled();
  });
});
