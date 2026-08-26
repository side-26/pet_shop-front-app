import { NextResponse } from 'next/server';

import type { AuthSessionModel } from '@/_types';
import { routePaths } from '@/configs/route.path';
import { USER_ROLES, type UserRole } from '@/configs/user-role';
import { decryptSession, getSessionCookieName } from '@/utils/session';

import type { MiddlewareHandler } from './composer.middleware';

const adminRoles = new Set<UserRole>([USER_ROLES.ADMIN, USER_ROLES.SELLER]);

function redirectToHome(requestUrl: string): NextResponse {
  return NextResponse.redirect(new URL(routePaths.home, requestUrl));
}

function isAdminRoute(pathname: string): boolean {
  return pathname === routePaths.admin || pathname.startsWith(`${routePaths.admin}/`);
}

export const roleMiddleware: MiddlewareHandler = async (request, next) => {
  if (!isAdminRoute(request.nextUrl.pathname)) return next();

  const encodedSession = request.cookies.get(getSessionCookieName())?.value;
  if (!encodedSession) return redirectToHome(request.url);

  try {
    const session = await decryptSession<AuthSessionModel>(encodedSession);

    return adminRoles.has(session.role) ? next() : redirectToHome(request.url);
  } catch {
    return redirectToHome(request.url);
  }
};
