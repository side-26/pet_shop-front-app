import 'server-only';

import { NextResponse } from 'next/server';

import { InternalApiError } from './InternalFetchError';
import type { FetcherError } from './fetcher.shared';
import { HTTP_STATUS } from './http-status';
import { runWithRequestContext } from '@/lib/logging/request-context';
import { resolveRequestId } from '@/lib/logging/request-id';
import { getPathGroup, sanitizeErrorType } from '@/lib/logging/sanitize';
import { observeInternalApiFailure } from '@/lib/logging/server-http-observer';

type ApiHandler<TContext = unknown> = (request: Request, context: TContext) => Promise<Response>;

export function withApiHandler<TContext = unknown>(
  handler: ApiHandler<TContext>,
): ApiHandler<TContext> {
  return async (request, context) => {
    const requestId = resolveRequestId(request.headers.get('x-request-id'));
    return runWithRequestContext(requestId, async () => {
      try {
        const response = await handler(request, context);
        response.headers.set('X-Request-ID', requestId);
        return response;
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'digest' in error &&
          error.digest === 'NEXT_PRERENDER_INTERRUPTED'
        ) {
          throw error;
        }

        if (error instanceof InternalApiError) {
          return NextResponse.json(
            {
              isSuccess: false,
              message: error.message,
              data: error.data,
            } satisfies FetcherError<unknown>,
            {
              status: error.status ?? HTTP_STATUS.INTERNAL_SERVER_ERROR,
              headers: { 'X-Request-ID': requestId },
            },
          );
        }

        observeInternalApiFailure({
          requestId,
          method: request.method,
          path: getPathGroup(request.url),
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          errorType: sanitizeErrorType(error),
        });

        return NextResponse.json(
          {
            isSuccess: false,
            message: 'خطای غیرمنتظره در سرور',
            data: {
              messages: {},
              details: {},
            },
          } satisfies FetcherError<unknown>,
          {
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            headers: { 'X-Request-ID': requestId },
          },
        );
      }
    });
  };
}
