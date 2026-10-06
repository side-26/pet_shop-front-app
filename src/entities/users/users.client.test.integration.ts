import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { useAuthStore } from '@/entities/auth/auth.store';
import { globalErrorHandler } from '@/utils/helpers';

import {
  addWishlistItemAction,
  changeCurrentUserPasswordAction,
  createUserAction,
  disableUserByIdAction,
  deleteWishlistItemAction,
  enableUserByIdAction,
  getWishlistAction,
  updateCurrentUserProfileAction,
} from './users.actions';
import {
  submitCreateUser,
  submitCurrentUserPassword,
  submitCurrentUserProfile,
  submitUserEnabledUpdate,
  useAddWishlistItem,
  useDeleteWishlistItem,
  useWishlist,
} from './users.client';

vi.mock('./users.actions', () => ({
  addWishlistItemAction: vi.fn(),
  changeCurrentUserPasswordAction: vi.fn(),
  createUserAction: vi.fn(),
  disableUserByIdAction: vi.fn(),
  deleteWishlistItemAction: vi.fn(),
  enableUserByIdAction: vi.fn(),
  getWishlistAction: vi.fn(),
  updateCurrentUserProfileAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const createUserActionMock = vi.mocked(createUserAction);
const disableUserByIdActionMock = vi.mocked(disableUserByIdAction);
const enableUserByIdActionMock = vi.mocked(enableUserByIdAction);
const updateCurrentUserProfileActionMock = vi.mocked(updateCurrentUserProfileAction);
const changeCurrentUserPasswordActionMock = vi.mocked(changeCurrentUserPasswordAction);
const getWishlistActionMock = vi.mocked(getWishlistAction);
const addWishlistItemActionMock = vi.mocked(addWishlistItemAction);
const deleteWishlistItemActionMock = vi.mocked(deleteWishlistItemAction);
const globalErrorHandlerMock = vi.mocked(globalErrorHandler);
const toastAddMock = vi.mocked(toast.add);

const input = {
  phoneNumber: '09123456789',
  password: 'password123',
  confirmPassword: 'password123',
  role: 'customer' as const,
};

function queryClientWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return createElement(QueryClientProvider, { client }, children);
}

describe('wishlist client queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets wishlist entries and delegates add/remove mutations to their Server Actions', async () => {
    getWishlistActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: [{ _id: 'wishlist-1', item: 'product-1', itemType: 'product' }],
    });
    addWishlistItemActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { _id: 'wishlist-2', item: 'pet-1', itemType: 'pet' },
    });
    deleteWishlistItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: [] });

    const { result } = renderHook(
      () => ({
        wishlist: useWishlist(),
        add: useAddWishlistItem(),
        remove: useDeleteWishlistItem(),
      }),
      { wrapper: queryClientWrapper },
    );

    await waitFor(() => expect(result.current.wishlist.data).toHaveLength(1));
    await act(() => result.current.add.mutateAsync({ itemId: 'pet-1', itemType: 'pet' }));
    await act(() => result.current.remove.mutateAsync('wishlist-1'));

    expect(addWishlistItemActionMock).toHaveBeenCalledWith({ itemId: 'pet-1', itemType: 'pet' });
    expect(deleteWishlistItemActionMock).toHaveBeenCalledWith({ id: 'wishlist-1' });
  });
});

describe('create user client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the backend success message and reports creation', async () => {
    createUserActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'کاربر ایجاد شد.',
      data: { _id: 'user-1' } as never,
    });

    await expect(submitCreateUser(input, vi.fn())).resolves.toBe(true);
    expect(toastAddMock).toHaveBeenCalledWith({ type: 'success', title: 'کاربر ایجاد شد.' });
    expect(globalErrorHandlerMock).not.toHaveBeenCalled();
  });

  it('passes the complete backend error to the shared field-error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'ایجاد کاربر ناموفق بود.',
      data: {
        messages: [{ value: 'phoneNumber', label: 'شماره موبایل تکراری است.' }],
        details: {},
      },
    };
    const setError = vi.fn();
    createUserActionMock.mockResolvedValue(error);

    await expect(submitCreateUser(input, setError)).resolves.toBe(false);
    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toastAddMock).not.toHaveBeenCalled();
  });
});

describe('current-user profile client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().deleteUserIdentity();
  });

  it('submits personal info and shows the backend success message', async () => {
    updateCurrentUserProfileActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'updated',
      data: {
        userId: 'user-1',
        firstName: 'Ali',
        lastName: 'Rezaei',
        phoneNumber: '09123456789',
        role: 'customer',
        avatar: '',
        email: 'ali@example.com',
        nationalCode: '0012345678',
        age: 30,
        birthDate: null,
      },
    });

    await expect(
      submitCurrentUserProfile(
        {
          firstName: 'Ali',
          lastName: 'Rezaei',
          email: 'ali@example.com',
          nationalCode: '0012345678',
          age: 30,
          birthDate: null,
          avatar: null,
        },
        vi.fn(),
      ),
    ).resolves.toBe(true);
    expect(toastAddMock).toHaveBeenCalledWith({ type: 'success', title: 'updated' });
    expect(useAuthStore.getState().userIdentity).toMatchObject({
      userId: 'user-1',
      firstName: 'Ali',
    });
  });

  it('forwards password-change validation failures to the shared field-error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'failed',
      data: { messages: {}, details: {} },
    };
    const setError = vi.fn();
    changeCurrentUserPasswordActionMock.mockResolvedValue(error);

    await expect(
      submitCurrentUserPassword(
        { oldPassword: 'password123', password: 'new-password', repeatPassword: 'new-password' },
        setError,
      ),
    ).resolves.toBe(false);
    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
  });
});

describe('user status client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    [true, enableUserByIdActionMock],
    [false, disableUserByIdActionMock],
  ] as const)(
    'calls the matching status action and shows its success message',
    async (isEnable, action) => {
      action.mockResolvedValue({
        isSuccess: true,
        message: 'وضعیت کاربر به‌روزرسانی شد.',
        data: undefined,
      });

      await expect(submitUserEnabledUpdate('user-1', isEnable)).resolves.toBe(true);
      expect(action).toHaveBeenCalledWith({ id: 'user-1' });
      expect(toastAddMock).toHaveBeenCalledWith({
        type: 'success',
        title: 'وضعیت کاربر به‌روزرسانی شد.',
      });
    },
  );

  it('sends complete status failures to the shared error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'به‌روزرسانی ناموفق بود.',
      data: { messages: {}, details: {} },
    };
    disableUserByIdActionMock.mockResolvedValue(error);

    await expect(submitUserEnabledUpdate('user-1', false)).resolves.toBe(false);
    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error);
    expect(toastAddMock).not.toHaveBeenCalled();
  });
});
