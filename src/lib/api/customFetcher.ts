import 'server-only';

import { getSession } from '@/utils/session';

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
  type QueryParams,
  type ResponseParser,
} from './fetcher.shared';

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

type NextFetchOptions = { revalidate?: number | false; tags: [string, ...string[]] };
type CommonOptions<TSuccess, TBackendError> = {
  url: string;
  query?: QueryParams;
  headers?: HeadersInit;
  timeoutMs?: number;
  parseSuccess?: ResponseParser<TSuccess>;
  parseErrorDetails?: ResponseParser<TBackendError>;
};
type PublicUncachedOptions = { auth?: false; cache?: 'no-store'; next?: never };
type PublicCachedOptions = { auth?: false; cache: 'force-cache'; next: NextFetchOptions };
type PrivateOptions = { auth: true; cache?: 'no-store'; next?: never };
type BodylessOptions = { method?: 'GET' | 'DELETE'; body?: never };
type BodyOptions<TBody> = { method: 'POST' | 'PUT' | 'PATCH'; body: TBody };

export type CustomFetcherOptions<TSuccess, TBackendError, TBody = never> = CommonOptions<
  TSuccess,
  TBackendError
> &
  (PublicUncachedOptions | PublicCachedOptions | PrivateOptions) &
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
    if (!session?.accessToken) return transportError<TBackendError>('Authentication is required.');
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
    const responseBody = parseResponseText(response.status === 204 ? '' : await response.text());
    if (!response.ok || isExplicitErrorResponse(responseBody)) {
      return parseResponseError(responseBody, parseErrorDetails);
    }
    return parseSuccess(normalizeSuccessResponse(responseBody), successParser);
  } catch (error: unknown) {
    if (controller.signal.aborted) return transportError<TBackendError>('The request timed out.');
    if (error instanceof TypeError)
      return transportError<TBackendError>('Unable to reach the server.');
    return transportError<TBackendError>('An unexpected error occurred.');
  } finally {
    clearTimeout(timeout);
  }
}
