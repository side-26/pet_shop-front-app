import 'server-only';

import { getSession } from '@/utils/session';

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
  type QueryParams,
  type ResponseParser,
} from './fetcher.shared';
import { HTTP_STATUS } from './http-status';

export type {
  FetcherError,
  FetcherResult,
  FetcherSuccess,
  HttpMethod,
  QueryParams,
  QueryPrimitive,
  QueryValue,
  ResponseParser,
} from './fetcher.shared';

type CommonOptions<TSuccess, TBackendError> = {
  url: string;
  query?: QueryParams;
  headers?: HeadersInit;
  timeoutMs?: number;
  parseSuccess?: ResponseParser<TSuccess>;
  parseErrorDetails?: ResponseParser<TBackendError>;
};
type PublicUncachedOptions = { auth?: false; cache?: 'no-store'; next?: never };
type PrivateOptions = { auth: true; cache?: 'no-store'; next?: never };
type BodylessOptions = { method?: 'GET' | 'DELETE'; body?: never };
type BodyOptions<TBody> = { method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body: TBody };

export type CustomFetcherOptions<TSuccess, TBackendError, TBody = never> = CommonOptions<
  TSuccess,
  TBackendError
> &
  (PublicUncachedOptions | PrivateOptions) &
  (BodylessOptions | BodyOptions<TBody>);

export type CustomFetcherConfig = { customToken?: string };

const DEFAULT_TIMEOUT_MS = 15_000;

export async function customFetcher<TSuccess, TBackendError = unknown, TBody = never>(
  options: CustomFetcherOptions<TSuccess, TBackendError, TBody>,
  customConfig?: CustomFetcherConfig,
): Promise<FetcherResult<TSuccess, TBackendError>> {
  const {
    auth,
    body,
    cache = 'no-store',
    headers: callerHeaders,
    method = 'GET',
    next,
    parseErrorDetails,
    parseSuccess: successParser,
    query,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    url,
  } = options;
  const headers = new Headers(callerHeaders);
  if (customConfig?.customToken) headers.set('Authorization', `Bearer ${customConfig.customToken}`);
  else if (auth) {
    const session = await getSession();
    if (!session?.accessToken)
      return transportError<TBackendError>(
        fetcherMessages.authenticationRequired,
        HTTP_STATUS.UNAUTHORIZED,
      );
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const serializedBody = serializeBody(body);
  if (serializedBody instanceof FormData) headers.delete('Content-Type');
  else if (serializedBody) headers.set('Content-Type', 'application/json');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(buildUrl(url, query), {
      method,
      headers,
      body: serializedBody,
      cache,
      next,
      signal: controller.signal,
    });
    const responseBody = parseResponseText(
      response.status === HTTP_STATUS.NO_CONTENT ? '' : await response.text(),
    );
    if (!response.ok || isExplicitErrorResponse(responseBody)) {
      return parseResponseError(
        responseBody,
        parseErrorDetails,
        response.ok ? HTTP_STATUS.BAD_GATEWAY : response.status,
      );
    }
    return parseSuccess(
      normalizeSuccessResponse(responseBody),
      successParser,
      HTTP_STATUS.BAD_GATEWAY,
    );
  } catch (error: unknown) {
    if (controller.signal.aborted)
      return transportError<TBackendError>(
        fetcherMessages.requestTimedOut,
        HTTP_STATUS.GATEWAY_TIMEOUT,
      );
    if (error instanceof TypeError)
      return transportError<TBackendError>(
        fetcherMessages.serverUnavailable,
        HTTP_STATUS.BAD_GATEWAY,
      );
    return transportError<TBackendError>(fetcherMessages.unexpectedError, HTTP_STATUS.BAD_GATEWAY);
  } finally {
    clearTimeout(timeout);
  }
}
