// @vitest-environment node

import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';

const { createSessionCookieMock, decryptSessionMock, refreshAccessTokenMock } = vi.hoisted(() => ({
  createSessionCookieMock: vi.fn(),
  decryptSessionMock: vi.fn(),
  refreshAccessTokenMock: vi.fn(),
}));

vi.mock('@/entities/auth/auth.service', () => ({
  refreshAccessToken: refreshAccessTokenMock,
}));

vi.mock('@/utils/session', () => ({
  createSessionCookie: createSessionCookieMock,
  decryptSession: decryptSessionMock,
  getSessionCookieName: () => 'petshop-session',
}));

import { authMiddleware } from './auth.middleware';

const session: AuthSessionModel = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  accessExp: Date.UTC(2026, 7, 26, 12, 0, 0),
  sessionExp: Date.UTC(2026, 8, 2, 12, 0, 0),
  userId: 'user-1',
  role: USER_ROLES.CUSTOMER,
};

function request(pathname: string, withSession = false) {
  return new NextRequest(`https://petshop.test${pathname}`, {
    headers: withSession ? { cookie: 'petshop-session=encrypted-session' } : undefined,
  });
}

const next = vi.fn(async () => NextResponse.next());

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 7, 26, 11, 0, 0));
  });

  it.each(['/cart', '/checkout', '/admin', '/admin/users'])(
    'redirects unauthenticated access to protected route %s',
    async (pathname) => {
      const response = await authMiddleware(request(pathname), next);
      const location = new URL(response.headers.get('location')!);

      expect(location.pathname).toBe('/login');
      expect(location.searchParams.get('callbackUrl')).toBe(pathname);
      expect(next).not.toHaveBeenCalled();
    },
  );

  it.each(['/login', '/register', '/reset-password'])(
    'redirects an authenticated user away from auth route %s',
    async (pathname) => {
      decryptSessionMock.mockResolvedValue(session);

      const response = await authMiddleware(request(pathname, true), next);

      expect(new URL(response.headers.get('location')!).pathname).toBe('/');
      expect(next).not.toHaveBeenCalled();
    },
  );

  it('refreshes an expired access token before continuing a protected request', async () => {
    decryptSessionMock.mockResolvedValue({ ...session, accessExp: Date.now() - 1 });
    refreshAccessTokenMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { accessToken: 'new-access-token' },
    });
    createSessionCookieMock.mockResolvedValue({
      name: 'petshop-session',
      value: 'new-encrypted-session',
      options: {
        httpOnly: true,
        secure: true,
        maxAge: 604800,
        sameSite: 'strict',
        path: '/',
      },
    });

    const response = await authMiddleware(request('/checkout', true), next);

    expect(refreshAccessTokenMock).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
    expect(createSessionCookieMock).toHaveBeenCalledWith({
      ...session,
      accessToken: 'new-access-token',
      accessExp: Date.UTC(2026, 7, 26, 18, 0, 0),
    });
    expect(response.cookies.get('petshop-session')?.value).toBe('new-encrypted-session');
    expect(next).toHaveBeenCalledOnce();
  });

  it('clears an expired session and redirects to login', async () => {
    decryptSessionMock.mockResolvedValue({ ...session, sessionExp: Date.now() - 1 });

    const response = await authMiddleware(request('/cart', true), next);

    expect(new URL(response.headers.get('location')!).pathname).toBe('/login');
    expect(response.cookies.get('petshop-session')?.value).toBe('');
    expect(refreshAccessTokenMock).not.toHaveBeenCalled();
  });
});
