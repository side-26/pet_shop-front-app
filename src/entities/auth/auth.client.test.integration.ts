import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  loginUserAction,
  redirectToLoginAction,
  registerUserAction,
  sendOtpAction,
  verifyResetPasswordOtpAction,
} from './auth.actions';
import {
  submitLoginUser,
  submitRegisterUser,
  submitSendOtp,
  submitVerifyResetPasswordOtp,
} from './auth.client';

vi.mock('./auth.actions', () => ({
  loginUserAction: vi.fn(),
  registerUserAction: vi.fn(),
  redirectToLoginAction: vi.fn(),
  sendOtpAction: vi.fn(),
  verifyResetPasswordOtpAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const registerUserActionMock = vi.mocked(registerUserAction);
const loginUserActionMock = vi.mocked(loginUserAction);
const redirectToLoginActionMock = vi.mocked(redirectToLoginAction);
const sendOtpActionMock = vi.mocked(sendOtpAction);
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

  it('shows the server message for three seconds, then requests the server redirect', async () => {
    registerUserActionMock.mockResolvedValue({
      isSuccess: true,
      message: 'ثبت‌نام انجام شد.',
      data: null,
    });
    redirectToLoginActionMock.mockResolvedValue(undefined as never);
    const setError = vi.fn();

    const registration = submitRegisterUser(
      { phoneNumber: '09123456789', password: '12345678' },
      setError,
    );
    await vi.advanceTimersByTimeAsync(3_000);
    await registration;

    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'ثبت‌نام انجام شد.',
      timeout: 3_000,
    });
    expect(redirectToLoginActionMock).toHaveBeenCalledOnce();
  });

  it('passes backend errors to the global error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'ثبت‌نام ناموفق بود.',
      data: { messages: {}, details: {} },
    };
    registerUserActionMock.mockResolvedValue(error);
    const setError = vi.fn();

    await submitRegisterUser({ phoneNumber: '09123456789', password: '12345678' }, setError);

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
      data: {},
    });
    const setError = vi.fn();

    await submitLoginUser(
      { phoneNumber: '09123456789', password: '123456', rememberMe: false },
      setError,
    );

    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'ورود موفق بود.',
    });
    expect(globalErrorHandlerMock).not.toHaveBeenCalled();
  });

  it('passes login errors unchanged to the global error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'شماره موبایل یا کلمه عبور اشتباه است.',
      data: { messages: {}, details: {} },
    };
    loginUserActionMock.mockResolvedValue(error);
    const setError = vi.fn();

    await submitLoginUser(
      { phoneNumber: '09123456789', password: '123456', rememberMe: false },
      setError,
    );

    expect(globalErrorHandlerMock).toHaveBeenCalledWith(error, { showErrorFields: setError });
    expect(toastAddMock).not.toHaveBeenCalled();
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
