import { ValidationError } from 'yup';

import { routePaths } from '@/configs/route.path';
import { USER_ROLES, type UserRole } from '@/configs/user-role';
import type { FetcherError } from '@/lib/api/customFetcher';

export function validationErrorToFetcherError(error: ValidationError): FetcherError {
  const validationErrors = error.inner.length > 0 ? error.inner : [error];

  return {
    isSuccess: false,
    message: null,
    data: {
      messages: validationErrors
        .filter((item) => item.path)
        .map((item) => ({ value: item.path!, label: item.message })),
      details: {},
    },
  };
}

function getSafeInternalPath(callbackUrl?: string): string | null {
  if (!callbackUrl?.startsWith('/') || callbackUrl.startsWith('//')) return null;

  try {
    const baseUrl = new URL('https://pet-shop.local');
    const destination = new URL(callbackUrl, baseUrl);

    if (destination.origin !== baseUrl.origin) return null;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return null;
  }
}

export function resolveLoginRedirectPath(callbackUrl: string | undefined, role: UserRole): string {
  const safeCallbackPath = getSafeInternalPath(callbackUrl);
  if (safeCallbackPath) return safeCallbackPath;

  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER
    ? routePaths.admin
    : routePaths.home;
}
