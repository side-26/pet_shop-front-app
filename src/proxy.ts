import { NextRequest } from 'next/server';

import { authMiddleware } from '@/app/core/middlewares/auth.middleware';
import { composeMiddlewares } from '@/app/core/middlewares/composer.middleware';
import { roleMiddleware } from '@/app/core/middlewares/role.middleware';
import { resolveRequestId } from '@/lib/logging/request-id';

const applyApplicationMiddlewares = composeMiddlewares([authMiddleware, roleMiddleware]);

export async function proxy(request: NextRequest) {
  const requestId = resolveRequestId(request.headers.get('x-request-id'));
  const headers = new Headers(request.headers);
  headers.set('X-Request-ID', requestId);
  const response = await applyApplicationMiddlewares(new NextRequest(request, { headers }));
  response.headers.set('X-Request-ID', requestId);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|signout|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.(?:png|jpe?g|svg|webp|gif|woff2?|ttf|eot|json|webmanifest)$).*)',
  ],
};
