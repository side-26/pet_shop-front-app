// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';

const { cookieDeleteMock, cookieGetMock, cookieSetMock, cookiesMock } = vi.hoisted(() => ({
  cookieDeleteMock: vi.fn(),
  cookieGetMock: vi.fn(),
  cookieSetMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

import {
  decryptSession,
  decryptTemporaryToken,
  deleteTemporaryTokenCookie,
  encryptTemporaryToken,
  getTemporaryToken,
  saveSessionToCookie,
  saveTemporaryTokenToCookie,
} from './session';

const session: AuthSessionModel = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  accessExp: Date.UTC(2026, 7, 17, 12, 0, 10),
  sessionExp: Date.UTC(2026, 7, 24, 12, 0, 0),
  userId: 'user-1',
  role: 'customer',
};

describe('session helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SESSION_COOKIE_NAME', 'petshop-session');
    vi.stubEnv('NEXT_PUBLIC_SESSION_SECRET_KEY', 'test-session-secret');
    vi.stubEnv('NEXT_PUBLIC_TEMPORARY_SESSION_SECRET_KEY', 'test-temporary-session-secret');
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 7, 17, 12, 0, 0));
    cookiesMock.mockResolvedValue({
      delete: cookieDeleteMock,
      get: cookieGetMock,
      set: cookieSetMock,
    });
  });

  it('encrypts the session and saves it until the refresh session expires', async () => {
    await saveSessionToCookie(session);

    expect(cookieSetMock).toHaveBeenCalledOnce();
    const [name, value, options] = cookieSetMock.mock.calls[0];

    expect(name).toBe('petshop-session');
    expect(value).not.toContain(session.accessToken);
    await expect(decryptSession<AuthSessionModel>(value)).resolves.toMatchObject(session);
    expect(options).toEqual({
      httpOnly: true,
      secure: true,
      maxAge: 604800,
      sameSite: 'strict',
      path: '/',
    });
  });

  it('expires the cookie immediately when sessionExp is in the past', async () => {
    await saveSessionToCookie({ ...session, sessionExp: Date.now() - 1 });

    expect(cookieSetMock).toHaveBeenCalledWith(
      'petshop-session',
      expect.any(String),
      expect.objectContaining({ maxAge: 0 }),
    );
  });

  it('encrypts the temporary token in a secure five-minute cookie', async () => {
    await saveTemporaryTokenToCookie('temporary-reset-token');

    expect(cookieSetMock).toHaveBeenCalledOnce();
    const [name, value, options] = cookieSetMock.mock.calls[0];

    expect(name).toBe('temp_token');
    expect(value).not.toContain('temporary-reset-token');
    await expect(decryptTemporaryToken(value)).resolves.toBe('temporary-reset-token');
    expect(options).toEqual({
      httpOnly: true,
      secure: true,
      maxAge: 300,
      sameSite: 'strict',
      path: '/',
    });
  });

  it('reads and decrypts the temporary token without exposing its cookie value', async () => {
    const encryptedToken = await encryptTemporaryToken('temporary-reset-token');
    cookieGetMock.mockReturnValue({ value: encryptedToken });

    await expect(getTemporaryToken()).resolves.toBe('temporary-reset-token');
    expect(cookieGetMock).toHaveBeenCalledWith('temp_token');
  });

  it('returns null for missing or invalid temporary sessions', async () => {
    cookieGetMock.mockReturnValueOnce(undefined).mockReturnValueOnce({ value: 'invalid-token' });

    await expect(getTemporaryToken()).resolves.toBeNull();
    await expect(getTemporaryToken()).resolves.toBeNull();
  });

  it('deletes the temporary-token cookie', async () => {
    await deleteTemporaryTokenCookie();

    expect(cookieDeleteMock).toHaveBeenCalledWith('temp_token');
  });
});
