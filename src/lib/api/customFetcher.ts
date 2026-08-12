import 'server-only';

import { getSession } from '@/utils/session';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type FieldErrors = Record<string, string[]>;

export type FetcherErrorKind =
  'unauthorized' | 'backend' | 'network' | 'timeout' | 'invalid-response' | 'unknown';

export type FetcherError<TBackendError = unknown> = {
  kind: FetcherErrorKind;
  message: string;
  code?: string;
  details?: TBackendError;
  fieldErrors?: FieldErrors;
};

export type FetcherSuccess<TData> = {
  isSuccess: true;
  data: TData;
  status: number;
};

export type FetcherFailure<TBackendError> = {
  isSuccess: false;
  error: FetcherError<TBackendError>;
  status: number | null;
};

export type FetcherResult<TData, TBackendError = unknown> =
  FetcherSuccess<TData> | FetcherFailure<TBackendError>;

export type BackendSuccess<TPayload extends object> = { isSuccess: true } & TPayload;
export type BackendFailure<TPayload extends object> = { isSuccess: false } & TPayload;
export type BackendResponse<TSuccessPayload extends object, TErrorPayload extends object> =
  BackendSuccess<TSuccessPayload> | BackendFailure<TErrorPayload>;

export type ResponseParser<T> = (value: unknown) => T;

export type ErrorNormalizer<TBackendError> = (payload: TBackendError) => {
  message: string;
  code?: string;
  fieldErrors?: FieldErrors;
};

export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | readonly QueryPrimitive[] | null | undefined;
export type QueryParams = Record<string, QueryValue>;

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type CommonOptions<TSuccess, TBackendError> = {
  url: string;
  query?: QueryParams;
  headers?: HeadersInit;
  timeoutMs?: number;
  parseSuccess?: ResponseParser<TSuccess>;
  parseError?: ResponseParser<TBackendError>;
  normalizeError?: ErrorNormalizer<TBackendError>;
};

type PublicOptions = {
  auth?: false;
  cache?: RequestCache;
  next?: NextFetchOptions;
};

type PrivateOptions = {
  auth: true;
  cache?: 'no-store';
  next?: never;
};

type BodylessOptions = {
  method?: 'GET' | 'DELETE';
  body?: never;
};

type BodyOptions<TBody> = {
  method: 'POST' | 'PUT' | 'PATCH';
  body: TBody;
};

export type CustomFetcherOptions<TSuccess, TBackendError, TBody = never> = CommonOptions<
  TSuccess,
  TBackendError
> &
  (PublicOptions | PrivateOptions) &
  (BodylessOptions | BodyOptions<TBody>);

const DEFAULT_TIMEOUT_MS = 15_000;

function buildUrl(path: string, query?: QueryParams): string {
  const configuredBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const baseUrl = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(/^https?:\/\//i.test(path) ? path : `${baseUrl}${normalizedPath}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null) continue;

    const values = Array.isArray(value) ? value : [value];
    for (const item of values) url.searchParams.append(key, String(item));
  }

  return url.toString();
}

function serializeBody<TBody>(body: TBody | undefined): BodyInit | undefined {
  if (body == null) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
}

async function safeReadJson(response: Response): Promise<unknown | undefined> {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function isBackendResponse(value: unknown): value is { isSuccess: boolean } & object {
  return (
    typeof value === 'object' &&
    value !== null &&
    'isSuccess' in value &&
    typeof value.isSuccess === 'boolean'
  );
}

function omitIsSuccess<T extends { isSuccess: boolean }>(response: T): Omit<T, 'isSuccess'> {
  const { isSuccess: _, ...payload } = response;
  return payload;
}

function isFieldErrors(value: unknown): value is FieldErrors {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(
      (messages) =>
        Array.isArray(messages) && messages.every((message) => typeof message === 'string'),
    )
  );
}

function defaultNormalizeError(payload: unknown): ReturnType<ErrorNormalizer<unknown>> {
  if (typeof payload !== 'object' || payload === null) return { message: 'Request failed.' };

  const record = payload as Record<string, unknown>;
  return {
    message: typeof record.message === 'string' ? record.message : 'Request failed.',
    ...(typeof record.code === 'string' ? { code: record.code } : {}),
    ...(isFieldErrors(record.errors) ? { fieldErrors: record.errors } : {}),
  };
}

function failure<TBackendError>(
  kind: FetcherErrorKind,
  message: string,
  status: number | null,
  extras?: Omit<FetcherError<TBackendError>, 'kind' | 'message'>,
): FetcherFailure<TBackendError> {
  return { isSuccess: false, status, error: { kind, message, ...extras } };
}

export async function customFetcher<TSuccess, TBackendError = unknown, TBody = never>(
  options: CustomFetcherOptions<TSuccess, TBackendError, TBody>,
): Promise<FetcherResult<TSuccess, TBackendError>> {
  const {
    auth,
    body,
    cache,
    headers: callerHeaders,
    method = 'GET',
    next,
    normalizeError,
    parseError,
    parseSuccess,
    query,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    url,
  } = options;

  const headers = new Headers(callerHeaders);

  if (auth) {
    const session = await getSession();
    if (!session?.accessToken) {
      return failure('unauthorized', 'Authentication is required.', 401);
    }

    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const serializedBody = serializeBody(body);
  if (serializedBody && !(serializedBody instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  } else if (serializedBody instanceof FormData) {
    headers.delete('Content-Type');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildUrl(url, query), {
      method,
      headers,
      body: serializedBody,
      cache: auth ? 'no-store' : cache,
      next: auth ? undefined : next,
      signal: controller.signal,
    });
    const responseBody = await safeReadJson(response);

    if (response.status === 204 && response.ok) {
      return { isSuccess: true, data: undefined as TSuccess, status: response.status };
    }

    if (!isBackendResponse(responseBody)) {
      return failure(
        'invalid-response',
        'The server returned an invalid response.',
        response.status,
      );
    }

    const payload = omitIsSuccess(responseBody);

    if (response.ok && responseBody.isSuccess) {
      try {
        return {
          isSuccess: true,
          data: parseSuccess ? parseSuccess(payload) : (payload as TSuccess),
          status: response.status,
        };
      } catch {
        return failure(
          'invalid-response',
          'The server returned an invalid response.',
          response.status,
        );
      }
    }

    if (!responseBody.isSuccess) {
      let details: TBackendError;
      try {
        details = parseError ? parseError(payload) : (payload as TBackendError);
      } catch {
        return failure(
          'invalid-response',
          'The server returned an invalid response.',
          response.status,
        );
      }

      const normalized = normalizeError ? normalizeError(details) : defaultNormalizeError(details);

      return failure('backend', normalized.message, response.status, {
        details,
        ...(normalized.code ? { code: normalized.code } : {}),
        ...(normalized.fieldErrors ? { fieldErrors: normalized.fieldErrors } : {}),
      });
    }

    return failure('invalid-response', 'The server returned an invalid response.', response.status);
  } catch (error: unknown) {
    if (controller.signal.aborted) {
      return failure('timeout', 'The request timed out.', null);
    }

    if (error instanceof TypeError) {
      return failure('network', 'Unable to reach the server.', null);
    }

    return failure('unknown', 'An unexpected error occurred.', null);
  } finally {
    clearTimeout(timeout);
  }
}
