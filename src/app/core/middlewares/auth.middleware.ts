import { NextResponse, type NextRequest } from 'next/server';

import type { AuthSessionModel } from '@/_types';
import { routePaths } from '@/configs/route.path';
import { refreshAccessToken } from '@/entities/auth/auth.service';
import { createSessionCookie, decryptSession, getSessionCookieName } from '@/utils/session';

import type { MiddlewareHandler } from './composer.middleware';

const ACCESS_TOKEN_TTL_MS = 7 * 60 * 60 * 1_000;

const authRoutes = [routePaths.login, routePaths.register, routePaths.resetPassword] as const;
const protectedRoutes = [
  routePaths.cart,
  routePaths.checkout,
  routePaths.profile,
  routePaths.admin,
] as const;

function isRouteWithin(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function createLoginRedirect(request: NextRequest, clearSession = false): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = routePaths.login;
  loginUrl.search = '';
  loginUrl.searchParams.set('callbackUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`);

  const response = NextResponse.redirect(loginUrl);
  if (clearSession) response.cookies.delete(getSessionCookieName());

  return response;
}

function createAuthenticatedRedirect(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(routePaths.home, request.url));
}

async function handleInvalidSession(
  request: NextRequest,
  next: Parameters<MiddlewareHandler>[1],
  isProtectedRoute: boolean,
) {
  if (isProtectedRoute) return createLoginRedirect(request, true);

  const sessionCookieName = getSessionCookieName();
  request.cookies.delete(sessionCookieName);
  const response = await next();
  response.cookies.delete(sessionCookieName);

  return response;
}

export const authMiddleware: MiddlewareHandler = async (request, next) => {
  const pathname = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathname as (typeof authRoutes)[number]);
  const isProtectedRoute = protectedRoutes.some((route) => isRouteWithin(pathname, route));
  const encodedSession = request.cookies.get(getSessionCookieName())?.value;

  if (!encodedSession) {
    return isProtectedRoute ? createLoginRedirect(request) : next();
  }

  let session: AuthSessionModel;

  try {
    session = await decryptSession<AuthSessionModel>(encodedSession);
  } catch {
    return handleInvalidSession(request, next, isProtectedRoute);
  }

  const now = Date.now();

  if (session.sessionExp <= now) {
    return handleInvalidSession(request, next, isProtectedRoute);
  }

  if (session.accessExp <= now) {
    let result: Awaited<ReturnType<typeof refreshAccessToken>>;

    try {
      result = await refreshAccessToken({ refreshToken: session.refreshToken });
    } catch {
      return handleInvalidSession(request, next, isProtectedRoute);
    }

    if (!result.isSuccess) return handleInvalidSession(request, next, isProtectedRoute);

    const updatedSession: AuthSessionModel = {
      ...session,
      accessToken: result.data.accessToken,
      accessExp: now + ACCESS_TOKEN_TTL_MS,
    };
    let sessionCookie: Awaited<ReturnType<typeof createSessionCookie>>;

    try {
      sessionCookie = await createSessionCookie(updatedSession);
    } catch {
      return handleInvalidSession(request, next, isProtectedRoute);
    }

    request.cookies.set(sessionCookie.name, sessionCookie.value);
    const response = isAuthRoute ? createAuthenticatedRedirect(request) : await next();
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);

    return response;
  }

  return isAuthRoute ? createAuthenticatedRedirect(request) : next();
};
