// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';

const { cookieSetMock, cookiesMock } = vi.hoisted(() => ({
  cookieSetMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

import { decryptSession, saveSessionToCookie } from './session';

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
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 7, 17, 12, 0, 0));
    cookiesMock.mockResolvedValue({ set: cookieSetMock });
  });

  it('encrypts the session and saves it until the access token expires', async () => {
    await saveSessionToCookie(session);

    expect(cookieSetMock).toHaveBeenCalledOnce();
    const [name, value, options] = cookieSetMock.mock.calls[0];

    expect(name).toBe('petshop-session');
    expect(value).not.toContain(session.accessToken);
    await expect(decryptSession<AuthSessionModel>(value)).resolves.toMatchObject(session);
    expect(options).toEqual({
      httpOnly: true,
      secure: true,
      maxAge: 10,
      sameSite: 'strict',
      path: '/',
    });
  });

  it('expires the cookie immediately when accessExp is in the past', async () => {
    await saveSessionToCookie({ ...session, accessExp: Date.now() - 1 });

    expect(cookieSetMock).toHaveBeenCalledWith(
      'petshop-session',
      expect.any(String),
      expect.objectContaining({ maxAge: 0 }),
    );
  });
});
