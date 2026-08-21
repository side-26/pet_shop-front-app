import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { loginUser, registerUser, sendOtp, verifyResetPasswordOtp } from './auth.service';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

const customFetcherMock = vi.mocked(customFetcher);

describe('registerUser service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts the registration payload without authentication or caching', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: 'ثبت‌نام انجام شد.',
      data: null,
    });
    const input = { phoneNumber: '09123456789', password: '12345678' };

    await expect(registerUser(input)).resolves.toEqual({
      isSuccess: true,
      message: 'ثبت‌نام انجام شد.',
      data: null,
    });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/register',
      method: 'POST',
      body: input,
      auth: false,
      cache: 'no-store',
    });
  });
});

describe('loginUser service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts credentials without authentication or caching', async () => {
    const session = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      sessionExp: 1787561783000,
      userId: 'user-1',
      role: 'customer',
      accessExp: 1786982183000,
    };
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: 'ورود موفق بود.',
      data: session,
    });
    const input = { phoneNumber: '09123456789', password: '123456' };

    await expect(loginUser(input)).resolves.toEqual({
      isSuccess: true,
      message: 'ورود موفق بود.',
      data: session,
    });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/login',
      method: 'POST',
      body: input,
      auth: false,
      cache: 'no-store',
    });
  });
});

describe('sendOtp service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts the phone number without authentication or caching', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: 'کد تأیید با موفقیت ارسال شد',
      data: { remainingSeconds: 120 },
    });
    const input = { phoneNumber: '09123456789' };

    await expect(sendOtp(input)).resolves.toEqual({
      isSuccess: true,
      message: 'کد تأیید با موفقیت ارسال شد',
      data: { remainingSeconds: 120 },
    });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/send-otp',
      method: 'POST',
      body: input,
      auth: false,
      cache: 'no-store',
    });
  });
});

describe('verifyResetPasswordOtp service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts the documented reset-password verification payload without authentication or caching', async () => {
    customFetcherMock.mockResolvedValue({
      isSuccess: true,
      message: 'کد تأیید شما معتبر است',
      data: { temporaryToken: 'temporary-token', expiry: 300 },
    });
    const input = {
      phoneNumber: '09123456789',
      'otp-code': '123456',
      'reset-password': true,
    } as const;

    await expect(verifyResetPasswordOtp(input)).resolves.toEqual({
      isSuccess: true,
      message: 'کد تأیید شما معتبر است',
      data: { temporaryToken: 'temporary-token', expiry: 300 },
    });
    expect(customFetcherMock).toHaveBeenCalledWith({
      url: '/users/verify',
      method: 'POST',
      body: input,
      auth: false,
      cache: 'no-store',
    });
  });
});
