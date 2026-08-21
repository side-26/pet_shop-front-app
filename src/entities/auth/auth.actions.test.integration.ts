import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PATHS } from '@/configs/route.path';
import { saveSessionToCookie } from '@/utils/session';

import {
  loginUserAction,
  redirectToLoginAction,
  registerUserAction,
  sendOtpAction,
} from './auth.actions';
import { loginUser, registerUser, sendOtp } from './auth.service';
import { redirect } from 'next/navigation';

vi.mock('./auth.service', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  sendOtp: vi.fn(),
}));
vi.mock('@/utils/session', () => ({ saveSessionToCookie: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

const registerUserMock = vi.mocked(registerUser);
const loginUserMock = vi.mocked(loginUser);
const sendOtpMock = vi.mocked(sendOtp);
const saveSessionToCookieMock = vi.mocked(saveSessionToCookie);
const redirectMock = vi.mocked(redirect);

const loginSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  sessionExp: 1787561783000,
  userId: 'user-1',
  role: 'customer',
  accessExp: 1786982183000,
};

describe('auth actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates input before registering the user', async () => {
    registerUserMock.mockResolvedValue({ isSuccess: true, message: 'Done', data: null });
    const input = { phoneNumber: '09123456789', password: '12345678' };

    await expect(registerUserAction(input)).resolves.toEqual({
      isSuccess: true,
      message: 'Done',
      data: null,
    });
    expect(registerUserMock).toHaveBeenCalledWith(input);
  });

  it('returns normalized field errors without calling the service', async () => {
    const result = await registerUserAction({ phoneNumber: '123', password: 'short' });

    expect(result.isSuccess).toBe(false);
    if (!result.isSuccess) {
      expect(result.data.messages).toEqual([
        {
          value: 'phoneNumber',
          label: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
        },
        { value: 'password', label: 'کلمه عبور باید حداقل ۸ نویسه باشد.' },
      ]);
    }
    expect(registerUserMock).not.toHaveBeenCalled();
  });

  it('saves a successful login session and returns only the external message', async () => {
    loginUserMock.mockResolvedValue({
      isSuccess: true,
      message: 'ورود موفق بود.',
      data: loginSession,
    });

    await expect(
      loginUserAction({
        phoneNumber: '09123456789',
        password: '123456',
        rememberMe: false,
      }),
    ).resolves.toEqual({
      isSuccess: true,
      message: 'ورود موفق بود.',
      data: {},
    });
    expect(loginUserMock).toHaveBeenCalledWith({
      phoneNumber: '09123456789',
      password: '123456',
    });
    expect(saveSessionToCookieMock).toHaveBeenCalledWith(loginSession);
  });

  it('returns login errors unchanged without saving a session', async () => {
    const error = {
      isSuccess: false as const,
      message: 'شماره موبایل یا کلمه عبور اشتباه است.',
      data: { messages: {}, details: {} },
    };
    loginUserMock.mockResolvedValue(error);

    await expect(
      loginUserAction({
        phoneNumber: '09123456789',
        password: '123456',
        rememberMe: false,
      }),
    ).resolves.toBe(error);
    expect(saveSessionToCookieMock).not.toHaveBeenCalled();
  });

  it('validates login input before calling the service', async () => {
    const result = await loginUserAction({
      phoneNumber: '123',
      password: 'short',
      rememberMe: false,
    });

    expect(result.isSuccess).toBe(false);
    expect(loginUserMock).not.toHaveBeenCalled();
    expect(saveSessionToCookieMock).not.toHaveBeenCalled();
  });

  it('validates the phone number before sending an OTP', async () => {
    sendOtpMock.mockResolvedValue({
      isSuccess: true,
      message: 'کد تأیید با موفقیت ارسال شد',
      data: { remainingSeconds: 120 },
    });
    const input = { phoneNumber: '09123456789' };

    await expect(sendOtpAction(input)).resolves.toEqual({
      isSuccess: true,
      message: 'کد تأیید با موفقیت ارسال شد',
      data: { remainingSeconds: 120 },
    });
    expect(sendOtpMock).toHaveBeenCalledWith(input);
  });

  it('does not send an OTP when the phone number is invalid', async () => {
    const result = await sendOtpAction({ phoneNumber: '123' });

    expect(result.isSuccess).toBe(false);
    expect(sendOtpMock).not.toHaveBeenCalled();
  });

  it('redirects to the canonical login path', async () => {
    redirectMock.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(redirectToLoginAction()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirectMock).toHaveBeenCalledWith(PATHS.AUTH.LOGIN);
  });
});
