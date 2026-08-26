// @vitest-environment node

import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';

const { decryptSessionMock } = vi.hoisted(() => ({
  decryptSessionMock: vi.fn(),
}));

vi.mock('@/utils/session', () => ({
  decryptSession: decryptSessionMock,
  getSessionCookieName: () => 'petshop-session',
}));

import { roleMiddleware } from './role.middleware';

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

describe('roleMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not evaluate roles outside the admin routes', async () => {
    await roleMiddleware(request('/products'), next);

    expect(decryptSessionMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it('redirects an admin request without a session to home', async () => {
    const response = await roleMiddleware(request('/admin/users'), next);

    expect(new URL(response.headers.get('location')!).pathname).toBe('/');
    expect(next).not.toHaveBeenCalled();
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'allows the %s role to access admin routes',
    async (role) => {
      decryptSessionMock.mockResolvedValue({ ...session, role });

      await roleMiddleware(request('/admin/orders', true), next);

      expect(next).toHaveBeenCalledOnce();
    },
  );

  it('redirects a non-admin role to home', async () => {
    decryptSessionMock.mockResolvedValue(session);

    const response = await roleMiddleware(request('/admin', true), next);

    expect(new URL(response.headers.get('location')!).pathname).toBe('/');
    expect(next).not.toHaveBeenCalled();
  });

  it('redirects an invalid encrypted session to home', async () => {
    decryptSessionMock.mockRejectedValue(new Error('Invalid session'));

    const response = await roleMiddleware(request('/admin', true), next);

    expect(new URL(response.headers.get('location')!).pathname).toBe('/');
    expect(next).not.toHaveBeenCalled();
  });
});
