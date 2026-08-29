import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import { createUserAction, disableUserByIdAction, enableUserByIdAction } from './users.actions';
import { submitCreateUser, submitUserEnabledUpdate } from './users.client';

vi.mock('./users.actions', () => ({
  createUserAction: vi.fn(),
  disableUserByIdAction: vi.fn(),
  enableUserByIdAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const createUserActionMock = vi.mocked(createUserAction);
const disableUserByIdActionMock = vi.mocked(disableUserByIdAction);
const enableUserByIdActionMock = vi.mocked(enableUserByIdAction);
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
