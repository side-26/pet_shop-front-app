import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  changeCurrentUserPasswordAction,
  createUserAction,
  disableUserByIdAction,
  enableUserByIdAction,
  updateCurrentUserProfileAction,
} from './users.actions';
import {
  submitCreateUser,
  submitCurrentUserPassword,
  submitCurrentUserProfile,
  submitUserEnabledUpdate,
} from './users.client';

vi.mock('./users.actions', () => ({
  changeCurrentUserPasswordAction: vi.fn(),
  createUserAction: vi.fn(),
  disableUserByIdAction: vi.fn(),
  enableUserByIdAction: vi.fn(),
  updateCurrentUserProfileAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const createUserActionMock = vi.mocked(createUserAction);
const disableUserByIdActionMock = vi.mocked(disableUserByIdAction);
const enableUserByIdActionMock = vi.mocked(enableUserByIdAction);
const updateCurrentUserProfileActionMock = vi.mocked(updateCurrentUserProfileAction);
const changeCurrentUserPasswordActionMock = vi.mocked(changeCurrentUserPasswordAction);
const globalErrorHandlerMock = vi.mocked(globalErrorHandler);
const toastAddMock = vi.mocked(toast.add);

const input = {
  phoneNumber: '09123456789',
  password: 'password123',
  confirmPassword: 'password123',
  role: 'customer' as const,
};

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
  });

  it('submits personal info and shows the backend success message', async () => {
    updateCurrentUserProfileActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'updated',
      data: {} as never,
    });

    await expect(
      submitCurrentUserProfile({ firstName: 'Ali', lastName: 'Rezaei', avatar: null }, vi.fn()),
    ).resolves.toBe(true);
    expect(toastAddMock).toHaveBeenCalledWith({ type: 'success', title: 'updated' });
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
