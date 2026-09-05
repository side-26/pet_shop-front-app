import {
  buildUrl,
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
  let settled = false;

  const promise = new Promise<FetcherResult<TSuccess, TBackendError>>((resolve) => {
    const finish = (result: FetcherResult<TSuccess, TBackendError>) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    try {
      request.open(options.method ?? 'POST', buildUrl(options.url, options.query));
      request.timeout = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      request.withCredentials = options.withCredentials ?? false;

      const headers = new Headers(options.headers);
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
        const response = parseResponseText(request.responseText);
        if (request.status < 200 || request.status >= 300 || isExplicitErrorResponse(response)) {
          finish(parseResponseError(response, options.parseErrorDetails));
          return;
        }
        finish(parseSuccess(normalizeSuccessResponse(response), options.parseSuccess));
      };
      request.onerror = () => finish(transportError<TBackendError>('Unable to reach the server.'));
      request.ontimeout = () => finish(transportError<TBackendError>('The request timed out.'));
      request.onabort = () => finish(transportError<TBackendError>('The upload was cancelled.'));
      request.send(body);
    } catch {
      finish(transportError<TBackendError>('An unexpected error occurred.'));
    }
  }) as UploadFetcherPromise<TSuccess, TBackendError>;

  promise.abort = () => request.abort();
  return promise;
}
