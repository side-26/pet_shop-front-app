import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import {
  createUserAction,
  getAllPaginatedUsersAction,
  userGetDetailByIdAction,
} from './users.actions';
import type { UserDetailDTO, UserDTO } from './users.dto';
import { createUser, getAllPaginatedUsers, userGetDetailById } from './users.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./users.service', () => ({
  createUser: vi.fn(),
  getAllPaginatedUsers: vi.fn(),
  userGetDetailById: vi.fn(),
}));

const getSessionMock = vi.mocked(getSession);
const getAllPaginatedUsersMock = vi.mocked(getAllPaginatedUsers);
const createUserMock = vi.mocked(createUser);
const userGetDetailByIdMock = vi.mocked(userGetDetailById);

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

const userDetail: UserDetailDTO = {
  _id: '507f1f77bcf86cd799439011',
  firstName: 'Ali',
  lastName: 'Rezaei',
  phoneNumber: '09123456789',
  email: 'ali@example.com',
  isEnable: true,
  avatar: '',
  nationalCode: '0012345678',
  addresses: [],
  age: null,
  role: USER_ROLES.CUSTOMER,
  orders: [],
  cart: {
    totalPrice: 0,
    items: [],
    discountPrice: 0,
    userAddress: null,
    deliveringDateToShipping: null,
    shippingPrice: 0,
    shippingInfo: { name: '', trackingCode: '', estimateDeliveryDate: null },
    paymentType: 0,
    instalmentCompany: null,
  },
  wishlist: [],
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
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
    'validates a user id and gets its detail for the %s role',
    async (role) => {
      const response = { isSuccess: true as const, message: null, data: userDetail };
      getSessionMock.mockResolvedValue(session(role));
      userGetDetailByIdMock.mockResolvedValue(response);

      await expect(
        userGetDetailByIdAction({ id: '  507f1f77bcf86cd799439011  ', unknown: 'removed' }),
      ).resolves.toBe(response);
      expect(userGetDetailByIdMock).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    },
  );

  it('rejects an invalid user id without calling the detail service', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));

    const result = await userGetDetailByIdAction({ id: 'user-1' });

    expect(result).toMatchObject({ isSuccess: false });
    expect(userGetDetailByIdMock).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated and customer user-detail calls', async () => {
    getSessionMock.mockResolvedValue(null);
    await expect(
      userGetDetailByIdAction({ id: '507f1f77bcf86cd799439011' }),
    ).resolves.toMatchObject({
      isSuccess: false,
      message: 'برای مشاهده کاربر وارد حساب مدیریتی شوید.',
    });

    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(
      userGetDetailByIdAction({ id: '507f1f77bcf86cd799439011' }),
    ).resolves.toMatchObject({
      isSuccess: false,
      message: 'شما اجازه مشاهده این کاربر را ندارید.',
    });
    expect(userGetDetailByIdMock).not.toHaveBeenCalled();
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'validates and creates a user for the %s role',
    async (role) => {
      const input = {
        phoneNumber: '09123456789',
        password: 'password123',
        confirmPassword: 'password123',
        role: USER_ROLES.CUSTOMER,
      };
      const createdUser: UserDTO = {
        _id: 'user-1',
        firstName: '',
        lastName: '',
        nationalCode: '',
        cart: [],
        isEnable: true,
        phoneNumber: input.phoneNumber,
        email: '',
        role: input.role,
        orders: [],
        wishlist: [],
        age: 0,
        addresses: [],
      };
      const response = { isSuccess: true as const, message: 'created', data: createdUser };
      getSessionMock.mockResolvedValue(session(role));
      createUserMock.mockResolvedValue(response);

      await expect(createUserAction({ ...input, unknown: 'removed' })).resolves.toBe(response);
      expect(createUserMock).toHaveBeenCalledWith(input);
    },
  );

  it('returns all create-user validation errors without calling the service', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));

    const result = await createUserAction({
      phoneNumber: 'invalid',
      password: 'short',
      confirmPassword: 'different',
      role: 'owner',
    });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.data.messages).toHaveLength(4);
    }
    expect(createUserMock).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated and customer create-user calls', async () => {
    getSessionMock.mockResolvedValue(null);
    await expect(createUserAction({})).resolves.toMatchObject({
      isSuccess: false,
      message: 'برای ایجاد کاربر وارد حساب مدیریتی شوید.',
    });

    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(createUserAction({})).resolves.toMatchObject({
      isSuccess: false,
      message: 'شما اجازه ایجاد کاربر را ندارید.',
    });
    expect(createUserMock).not.toHaveBeenCalled();
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
