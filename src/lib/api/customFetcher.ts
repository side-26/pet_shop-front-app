import 'server-only';

import { getSession } from '@/utils/session';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FetchErrorMessageDTO {
  value: string;
  label: string;
}

export type FetcherError<TBackendError = unknown> = {
  isSuccess: false;
  message: string | null;
  data: {
    messages: FetchErrorMessageDTO[] | Record<string, never>;
    details: TBackendError | Record<string, never>;
  };
};

export type FetcherSuccess<TData> = {
  isSuccess: true;
  message: string | null;
  data: TData;
};

export type FetcherResult<TData, TBackendError = unknown> =
  FetcherSuccess<TData> | FetcherError<TBackendError>;

export type ResponseParser<T> = (value: unknown) => T;

export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | readonly QueryPrimitive[] | null | undefined;
export type QueryParams = Record<string, QueryValue>;

type NextFetchOptions = {
  revalidate?: number | false;
  tags: [string, ...string[]];
};

type CommonOptions<TSuccess, TBackendError> = {
  url: string;
  query?: QueryParams;
  headers?: HeadersInit;
  timeoutMs?: number;
  parseSuccess?: ResponseParser<TSuccess>;
  parseErrorDetails?: ResponseParser<TBackendError>;
};

type PublicUncachedOptions = {
  auth?: false;
  cache?: 'no-store';
  next?: never;
};

type PublicCachedOptions = {
  auth?: false;
  cache: 'force-cache';
  next: NextFetchOptions;
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
  (PublicUncachedOptions | PublicCachedOptions | PrivateOptions) &
  (BodylessOptions | BodyOptions<TBody>);

export type CustomFetcherConfig = {
  customToken?: string;
};

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_ERROR_MESSAGE = 'The server returned an invalid response.';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getNonEmptyMessage(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function getResponseMessage(value: unknown): string | undefined {
  if (isRecord(value)) return getNonEmptyMessage(value.message);
  return getNonEmptyMessage(value);
}

function hasMessage(
  value: Record<string, unknown>,
): value is Record<string, unknown> & { message: string | null } {
  return value.message === null || typeof value.message === 'string';
}

function isFetchErrorMessages(value: unknown): value is FetchErrorMessageDTO[] {
  return (
    Array.isArray(value) &&
    value.every(
      (message) =>
        isRecord(message) && typeof message.value === 'string' && typeof message.label === 'string',
    )
  );
}

function isEmptyRecord(value: unknown): value is Record<string, never> {
  return isRecord(value) && Object.keys(value).length === 0;
}

function isSuccessEnvelope(value: unknown): value is FetcherSuccess<unknown> {
  return (
    isRecord(value) && value.isSuccess === true && hasMessage(value) && Object.hasOwn(value, 'data')
  );
}

function isErrorEnvelope(value: unknown): value is FetcherError<unknown> {
  if (
    !isRecord(value) ||
    value.isSuccess !== false ||
    !hasMessage(value) ||
    !isRecord(value.data)
  ) {
    return false;
  }

  return (
    (isFetchErrorMessages(value.data.messages) || isEmptyRecord(value.data.messages)) &&
    Object.hasOwn(value.data, 'details')
  );
}

function isExplicitErrorResponse(value: unknown): boolean {
  return isRecord(value) && value.isSuccess === false;
}

function transportError<TBackendError = never>(message: string): FetcherError<TBackendError> {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
}

function parseSuccess<TSuccess, TBackendError>(
  envelope: FetcherSuccess<unknown>,
  parser?: ResponseParser<TSuccess>,
): FetcherResult<TSuccess, TBackendError> {
  try {
    return {
      isSuccess: true,
      message: envelope.message,
      data: parser ? parser(envelope.data) : (envelope.data as TSuccess),
    };
  } catch {
    return transportError<TBackendError>(DEFAULT_ERROR_MESSAGE);
  }
}

function normalizeSuccessResponse(value: unknown): FetcherSuccess<unknown> {
  if (isSuccessEnvelope(value)) return value;

  if (isRecord(value) && value.isSuccess === true) {
    return {
      isSuccess: true,
      message: getResponseMessage(value) ?? null,
      data: Object.hasOwn(value, 'data') ? value.data : undefined,
    };
  }

  return {
    isSuccess: true,
    message: getResponseMessage(value) ?? null,
    data: value,
  };
}

function parseError<TBackendError>(
  envelope: FetcherError<unknown>,
  parser?: ResponseParser<TBackendError>,
): FetcherError<TBackendError> {
  const errorWithMessage = {
    ...envelope,
    message: getNonEmptyMessage(envelope.message) ?? DEFAULT_ERROR_MESSAGE,
  };

  if (!parser || isEmptyRecord(envelope.data.details)) {
    return errorWithMessage as FetcherError<TBackendError>;
  }

  try {
    return {
      ...errorWithMessage,
      data: { ...envelope.data, details: parser(envelope.data.details) },
    };
  } catch {
    return transportError<TBackendError>(DEFAULT_ERROR_MESSAGE);
  }
}

function parseResponseError<TBackendError>(
  value: unknown,
  parser?: ResponseParser<TBackendError>,
): FetcherError<TBackendError> {
  if (isErrorEnvelope(value)) return parseError(value, parser);
  return transportError<TBackendError>(getResponseMessage(value) ?? DEFAULT_ERROR_MESSAGE);
}

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
  if (customConfig?.customToken) {
    headers.set('Authorization', `Bearer ${customConfig.customToken}`);
  } else if (auth) {
    const session = await getSession();
    if (!session?.accessToken) {
      return transportError<TBackendError>('Authentication is required.');
    }
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const serializedBody = serializeBody(body);
  if (serializedBody instanceof FormData) {
    headers.delete('Content-Type');
  } else if (serializedBody) {
    headers.set('Content-Type', 'application/json');
  }

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

    const responseBody = await safeReadJson(response);

    if (!response.ok || isExplicitErrorResponse(responseBody)) {
      return parseResponseError(responseBody, parseErrorDetails);
    }

    return parseSuccess<TSuccess, TBackendError>(
      normalizeSuccessResponse(responseBody),
      successParser,
    );
  } catch (error: unknown) {
    if (controller.signal.aborted) {
      return transportError<TBackendError>('The request timed out.');
    }
    if (error instanceof TypeError) {
      return transportError<TBackendError>('Unable to reach the server.');
    }
    return transportError<TBackendError>('An unexpected error occurred.');
  } finally {
    clearTimeout(timeout);
  }
}
