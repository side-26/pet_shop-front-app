import {
  buildUrl,
  parseResponseText,
  serializeBody,
  type QueryParams,
  type FetcherError,
} from './fetcher.shared';

import { InternalApiError } from './InternalFetchError';
import { HTTP_STATUS } from './http-status';

type InternalFetcherOptions<TBody = never> = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: QueryParams;
  headers?: HeadersInit;
  body?: TBody;
  timeoutMs?: number;
  signal?: AbortSignal;
};

export async function internalFetcher<TSuccess, TBackendError = unknown, TBody = never>(
  options: InternalFetcherOptions<TBody>,
): Promise<TSuccess> {
  const {
    url,
    method = 'GET',
    query,
    headers: callerHeaders,
    body,
    timeoutMs = 15_000,
    signal,
  } = options;

  const headers = new Headers(callerHeaders);
  const serializedBody = serializeBody(body);

  if (serializedBody instanceof FormData) {
    headers.delete('Content-Type');
  } else if (serializedBody !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(buildUrl(url, query), {
      method,
      headers,
      body: serializedBody,
      cache: 'no-store',
      signal: AbortSignal.any([AbortSignal.timeout(timeoutMs), ...(signal ? [signal] : [])]),
    });

    const responseBody = parseResponseText(
      response.status === HTTP_STATUS.NO_CONTENT ? '' : await response.text(),
    );

    if (!response.ok) {
      const errorBody = responseBody as FetcherError<TBackendError>;

      throw new InternalApiError<TBackendError>(
        errorBody?.message ?? 'خطا در دریافت اطلاعات',
        errorBody?.data,
        response.status,
      );
    }

    return responseBody as TSuccess;
  } catch (error: unknown) {
    if (error instanceof InternalApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new InternalApiError('زمان درخواست به پایان رسید');
    }

    if (signal?.aborted) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new InternalApiError('خطا در اتصال به سرور');
    }

    throw new InternalApiError('خطای غیرمنتظره');
  }
}
