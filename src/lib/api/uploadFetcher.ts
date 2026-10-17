import {
  buildUrl,
  fetcherMessages,
  isExplicitErrorResponse,
  normalizeSuccessResponse,
  parseResponseError,
  parseResponseText,
  parseSuccess,
  serializeBody,
  transportError,
  type FetcherResult,
  type HttpMethod,
  type QueryParams,
  type ResponseParser,
} from './fetcher.shared';
import { HTTP_STATUS } from './http-status';
import { reportClientError, setClientRequestId } from '@/lib/logging/client-reporter';
import { resolveRequestId } from '@/lib/logging/request-id';
import { getPathGroup } from '@/lib/logging/sanitize';

export type UploadProgress = {
  loaded: number;
  total: number | null;
  percent: number | null;
};

export type UploadFetcherOptions<TSuccess, TBackendError = unknown, TBody = FormData> = {
  url: string;
  body: TBody;
  method?: Extract<HttpMethod, 'POST' | 'PUT' | 'PATCH'>;
  query?: QueryParams;
  headers?: HeadersInit;
  token?: string;
  timeoutMs?: number;
  withCredentials?: boolean;
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
  parseSuccess?: ResponseParser<TSuccess>;
  parseErrorDetails?: ResponseParser<TBackendError>;
};

export type UploadFetcherPromise<TSuccess, TBackendError = unknown> = Promise<
  FetcherResult<TSuccess, TBackendError>
> & { abort: () => void };

const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * Sends a browser-side upload with progress reporting. Call `request.abort()` to
 * cancel it, or `await request` to receive the standard fetcher result envelope.
 */
export function uploadFetcher<TSuccess, TBackendError = unknown, TBody = FormData>(
  options: UploadFetcherOptions<TSuccess, TBackendError, TBody>,
): UploadFetcherPromise<TSuccess, TBackendError> {
  const request = new XMLHttpRequest();
  const requestId = resolveRequestId(new Headers(options.headers).get('x-request-id'));
  const method = options.method ?? 'POST';
  const path = getPathGroup(options.url);
  let settled = false;
  let removeAbortListener: (() => void) | undefined;

  const promise = new Promise<FetcherResult<TSuccess, TBackendError>>((resolve) => {
    const finish = (result: FetcherResult<TSuccess, TBackendError>) => {
      if (settled) return;
      settled = true;
      removeAbortListener?.();
      resolve(result);
    };

    try {
      request.open(method, buildUrl(options.url, options.query));
      request.timeout = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      request.withCredentials = options.withCredentials ?? false;

      const headers = new Headers(options.headers);
      headers.set('X-Request-ID', requestId);
      if (options.token) headers.set('Authorization', `Bearer ${options.token}`);

      const body = serializeBody(options.body);
      if (body instanceof FormData) headers.delete('Content-Type');
      else headers.set('Content-Type', 'application/json');
      headers.forEach((value, name) => request.setRequestHeader(name, value));

      request.upload.onprogress = (event) => {
        options.onProgress?.({
          loaded: event.loaded,
          total: event.lengthComputable ? event.total : null,
          percent:
            event.lengthComputable && event.total > 0 ? (event.loaded / event.total) * 100 : null,
        });
      };
      request.onload = () => {
        setClientRequestId(request.getResponseHeader('x-request-id') ?? requestId);
        const response = parseResponseText(request.responseText);
        if (
          request.status < HTTP_STATUS.OK ||
          request.status >= HTTP_STATUS.MULTIPLE_CHOICES ||
          isExplicitErrorResponse(response)
        ) {
          if (request.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
            reportClientError(new Error('Upload endpoint server error'), {
              component: 'upload-fetcher',
              errorType: 'server_error',
              fingerprintParts: [method, path, request.status],
              requestId,
            });
          }
          finish(parseResponseError(response, options.parseErrorDetails));
          return;
        }
        finish(parseSuccess(normalizeSuccessResponse(response), options.parseSuccess));
      };
      request.onerror = () => {
        reportClientError(new Error('Upload network error'), {
          component: 'upload-fetcher',
          errorType: 'network_error',
          fingerprintParts: [method, path],
          requestId,
        });
        finish(transportError<TBackendError>(fetcherMessages.serverUnavailable));
      };
      request.ontimeout = () => {
        reportClientError(new Error('Upload timeout'), {
          component: 'upload-fetcher',
          errorType: 'timeout',
          fingerprintParts: [method, path],
          requestId,
        });
        finish(transportError<TBackendError>(fetcherMessages.requestTimedOut));
      };
      request.onabort = () =>
        finish(transportError<TBackendError>(fetcherMessages.uploadCancelled));
      if (options.signal?.aborted) {
        request.abort();
        return;
      }

      const abort = () => request.abort();
      options.signal?.addEventListener('abort', abort, { once: true });
      removeAbortListener = () => options.signal?.removeEventListener('abort', abort);
      request.send(body);
    } catch (error: unknown) {
      reportClientError(error, {
        component: 'upload-fetcher',
        errorType: 'protocol_error',
        fingerprintParts: [method, path],
        requestId,
      });
      finish(transportError<TBackendError>(fetcherMessages.unexpectedError));
    }
  }) as UploadFetcherPromise<TSuccess, TBackendError>;

  promise.abort = () => request.abort();
  return promise;
}
