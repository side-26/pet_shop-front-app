import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { routePaths } from '@/configs/route.path';
import { USER_ROLES } from '@/configs/user-role';
import { globalErrorHandler } from '@/utils/helpers';

import { authMessages } from './auth.messages';
import {
  loginUserAction,
  logoutUserAction,
  redirectToLoginAfterLogoutAction,
  redirectToLoginAction,
  registerUserAction,
  resetPasswordAction,
  sendOtpAction,
  verifyResetPasswordOtpAction,
} from './auth.actions';
import {
  logoutUser,
  submitLoginUser,
  submitRegisterUser,
  submitResetPassword,
  submitSendOtp,
  submitVerifyResetPasswordOtp,
  syncUserIdentity,
} from './auth.client';
import { useAuthStore } from './auth.store';

vi.mock('./auth.actions', () => ({
  loginUserAction: vi.fn(),
  logoutUserAction: vi.fn(),
  redirectToLoginAfterLogoutAction: vi.fn(),
  registerUserAction: vi.fn(),
  resetPasswordAction: vi.fn(),
  redirectToLoginAction: vi.fn(),
  sendOtpAction: vi.fn(),
  verifyResetPasswordOtpAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const registerUserActionMock = vi.mocked(registerUserAction);
const loginUserActionMock = vi.mocked(loginUserAction);
const logoutUserActionMock = vi.mocked(logoutUserAction);
const redirectToLoginAfterLogoutActionMock = vi.mocked(redirectToLoginAfterLogoutAction);
const redirectToLoginActionMock = vi.mocked(redirectToLoginAction);
const sendOtpActionMock = vi.mocked(sendOtpAction);
const resetPasswordActionMock = vi.mocked(resetPasswordAction);
const verifyResetPasswordOtpActionMock = vi.mocked(verifyResetPasswordOtpAction);
const globalErrorHandlerMock = vi.mocked(globalErrorHandler);
const toastAddMock = vi.mocked(toast.add);

describe('registerUser client orchestration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the server message for three seconds, then navigates to login', async () => {
    registerUserActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'ثبت‌نام انجام شد.',
      data: null,
    });
    const setError = vi.fn();
    const navigate = vi.fn();

    const registration = submitRegisterUser(
      { phoneNumber: '09123456789', password: '12345678' },
      setError,
      navigate,
    );
    await vi.advanceTimersByTimeAsync(3_000);
    await registration;

    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'ثبت‌نام انجام شد.',
      timeout: 3_000,
    });
    expect(navigate).toHaveBeenCalledWith(routePaths.login);
  });

  it('passes backend errors to the global error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'ثبت‌نام ناموفق بود.',
      data: { messages: {}, details: {} },
    };
    registerUserActionMock.mockResolvedValue(error);
    const setError = vi.fn();

    await submitRegisterUser(
      { phoneNumber: '09123456789', password: '12345678' },
      setError,
      vi.fn(),
    );

    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toastAddMock).not.toHaveBeenCalled();
    expect(redirectToLoginActionMock).not.toHaveBeenCalled();
  });
});

describe('loginUser client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the external success message returned by the action', async () => {
    loginUserActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'ورود موفق بود.',
      data: { role: USER_ROLES.CUSTOMER },
    });
    const setError = vi.fn();
    const navigate = vi.fn();

    await submitLoginUser(
      { phoneNumber: '09123456789', password: '123456', rememberMe: false },
      setError,
      undefined,
      navigate,
    );

    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'ورود موفق بود.',
    });
    expect(navigate).toHaveBeenCalledWith(routePaths.home);
    expect(globalErrorHandlerMock).not.toHaveBeenCalled();
  });

  it('prioritizes a safe callback URL over the role-based destination', async () => {
    loginUserActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'ورود موفق بود.',
      data: { role: USER_ROLES.ADMIN },
    });
    const navigate = vi.fn();

    await submitLoginUser(
      { phoneNumber: '09123456789', password: '123456', rememberMe: false },
      vi.fn(),
      '/checkout?step=payment',
      navigate,
    );

    expect(navigate).toHaveBeenCalledWith('/checkout?step=payment');
  });

  it('passes login errors unchanged to the global error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'شماره موبایل یا کلمه عبور اشتباه است.',
      data: { messages: {}, details: {} },
    };
    loginUserActionMock.mockResolvedValue(error);
    const setError = vi.fn();
    const navigate = vi.fn();

    await submitLoginUser(
      { phoneNumber: '09123456789', password: '123456', rememberMe: false },
      setError,
      '/checkout',
      navigate,
    );

    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toastAddMock).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});

describe('logout client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes a logout failure to the global error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'خروج ناموفق بود.',
      data: { messages: {}, details: {} },
    };
    logoutUserActionMock.mockResolvedValue(error);

    await logoutUser();

    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error);
  });

  it('does not show a local toast before the successful server redirect', async () => {
    logoutUserActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'خارج شدید.',
      data: undefined,
    });

    await logoutUser();

    expect(globalErrorHandlerMock).not.toHaveBeenCalled();
    expect(toastAddMock).not.toHaveBeenCalled();
    expect(redirectToLoginAfterLogoutActionMock).toHaveBeenCalledOnce();
  });
});

describe('auth session identity synchronization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().deleteUserIdentity();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stores only the identity returned by the internal endpoint', async () => {
    const identity = {
      userId: 'user-1',
      firstName: 'نیلوفر',
      lastName: 'احمدی',
      phoneNumber: '09121234567',
      role: USER_ROLES.CUSTOMER,
      avatar: '',
      email: 'niloofar@example.com',
      nationalCode: '0012345678',
      age: 31,
      birthDate: null,
    };
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({ userId: identity.userId }) })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ isSuccess: true, data: identity }),
        }),
    );

    await expect(syncUserIdentity()).resolves.toEqual(identity);
    expect(useAuthStore.getState().userIdentity).toEqual(identity);
  });

  it('clears identity when the internal endpoint reports no session', async () => {
    useAuthStore.getState().saveUserIdentity({
      userId: 'user-1',
      firstName: 'نیلوفر',
      lastName: 'احمدی',
      phoneNumber: '09121234567',
      role: USER_ROLES.CUSTOMER,
      avatar: '',
      email: 'niloofar@example.com',
      nationalCode: '0012345678',
      age: 31,
      birthDate: null,
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ userId: null }) }),
    );

    await expect(syncUserIdentity()).resolves.toBeNull();
    expect(useAuthStore.getState().userIdentity).toBeNull();
  });

  it('does not fetch or change identity when the synchronization signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(syncUserIdentity(controller.signal)).resolves.toBeNull();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(useAuthStore.getState().userIdentity).toBeNull();
  });

  it('stores a successful identity response even if effect cleanup aborts after the fetch resolves', async () => {
    const identity = {
      userId: 'user-1',
      firstName: 'نیلوفر',
      lastName: 'احمدی',
      phoneNumber: '09121234567',
      role: USER_ROLES.CUSTOMER,
      avatar: '',
      email: 'niloofar@example.com',
      nationalCode: '0012345678',
      age: 31,
      birthDate: null,
    };
    const controller = new AbortController();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            controller.abort();
            return { userId: identity.userId };
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ isSuccess: true, data: identity }),
        }),
    );

    await expect(syncUserIdentity(controller.signal)).resolves.toEqual(identity);
    expect(useAuthStore.getState().userIdentity).toEqual(identity);
  });
});

describe('sendOtp client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the backend message and returns the countdown duration', async () => {
    sendOtpActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'کد تأیید با موفقیت ارسال شد',
      data: { remainingSeconds: 120 },
    });
    const setError = vi.fn();

    await expect(submitSendOtp({ phoneNumber: '09123456789' }, setError)).resolves.toEqual({
      remainingSeconds: 120,
    });
    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'کد تأیید با موفقیت ارسال شد',
    });
    expect(globalErrorHandlerMock).not.toHaveBeenCalled();
  });

  it('passes backend errors unchanged and keeps the caller on its current step', async () => {
    const error = {
      isSuccess: false as const,
      message: 'کاربری با این شماره تلفن یافت نشد',
      data: { messages: {}, details: {} },
    };
    sendOtpActionMock.mockResolvedValue(error);
    const setError = vi.fn();

    await expect(submitSendOtp({ phoneNumber: '09999999999' }, setError)).resolves.toBeNull();
    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toastAddMock).not.toHaveBeenCalled();
  });
});

describe('verifyResetPasswordOtp client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the backend message and returns only the verification flag', async () => {
    verifyResetPasswordOtpActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'کد تأیید شما معتبر است',
      data: true,
    });
    const input = {
      phoneNumber: '09123456789',
      'otp-code': '123456',
      'reset-password': true,
    } as const;
    const setError = vi.fn();

    await expect(submitVerifyResetPasswordOtp(input, setError)).resolves.toBe(true);
    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'کد تأیید شما معتبر است',
    });
    expect(globalErrorHandlerMock).not.toHaveBeenCalled();
  });

  it('passes verification failures unchanged and returns no success flag', async () => {
    const error = {
      isSuccess: false as const,
      message: 'کد تأیید وارد شده معتبر نیست',
      data: { messages: {}, details: {} },
    };
    verifyResetPasswordOtpActionMock.mockResolvedValue(error);
    const setError = vi.fn();

    await expect(
      submitVerifyResetPasswordOtp(
        {
          phoneNumber: '09123456789',
          'otp-code': '123456',
          'reset-password': true,
        },
        setError,
      ),
    ).resolves.toBeNull();
    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toastAddMock).not.toHaveBeenCalled();
  });
});

describe('resetPassword client orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectToLoginActionMock.mockResolvedValue(undefined as never);
  });

  it('shows the backend success message and redirects to login', async () => {
    resetPasswordActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'کلمه عبور شما با موفقیت بازنشانی شد',
      data: true,
    });
    const input = { newPassword: 'new-password', confirmPassword: 'new-password' };
    const setError = vi.fn();

    await submitResetPassword(input, setError);

    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'کلمه عبور شما با موفقیت بازنشانی شد',
    });
    expect(redirectToLoginActionMock).toHaveBeenCalledOnce();
  });

  it('shows the Persian session-expired error and redirects to login', async () => {
    const error = {
      isSuccess: false as const,
      message: authMessages.temporarySessionExpired,
      data: { messages: {}, details: {} },
      shouldRedirectToLogin: true as const,
    };
    resetPasswordActionMock.mockResolvedValue(error);
    const setError = vi.fn();

    await submitResetPassword(
      { newPassword: 'new-password', confirmPassword: 'new-password' },
      setError,
    );

    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(redirectToLoginActionMock).toHaveBeenCalledOnce();
    expect(toastAddMock).not.toHaveBeenCalled();
  });

  it('keeps the form visible for ordinary backend errors', async () => {
    const error = {
      isSuccess: false as const,
      message: 'کلمه عبور معتبر نیست',
      data: { messages: {}, details: {} },
    };
    resetPasswordActionMock.mockResolvedValue(error);
    const setError = vi.fn();

    await submitResetPassword(
      { newPassword: 'new-password', confirmPassword: 'new-password' },
      setError,
    );

    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(redirectToLoginActionMock).not.toHaveBeenCalled();
  });
});
