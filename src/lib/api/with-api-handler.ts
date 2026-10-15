import 'server-only';

import { NextResponse } from 'next/server';

import { InternalApiError } from './InternalFetchError';
import type { FetcherError } from './fetcher.shared';
import { HTTP_STATUS } from './http-status';

type ApiHandler<TContext = unknown> = (request: Request, context: TContext) => Promise<Response>;

export function withApiHandler<TContext = unknown>(
  handler: ApiHandler<TContext>,
): ApiHandler<TContext> {
  return async (request, context) => {
    try {
      return await handler(request, context);
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
          },
        );
      }

      console.error('[INTERNAL_API_ERROR]', error);

      return NextResponse.json(
        {
          isSuccess: false,
          message: 'خطای غیرمنتظره در سرور',
          data: {
            messages: {},
            details: {},
          },
        } satisfies FetcherError<unknown>,
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
      );
    }
  };
}
