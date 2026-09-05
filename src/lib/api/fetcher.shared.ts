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

const DEFAULT_ERROR_MESSAGE = 'The server returned an invalid response.';

export function buildUrl(path: string, query?: QueryParams): string {
  const configuredBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const baseUrl = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(/^https?:\/\//i.test(path) ? path : `${baseUrl}${normalizedPath}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null) continue;

    for (const item of Array.isArray(value) ? value : [value]) {
      url.searchParams.append(key, String(item));
    }
  }

  return url.toString();
}

export function serializeBody<TBody>(body: TBody | undefined): XMLHttpRequestBodyInit | undefined {
  if (body == null) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getNonEmptyMessage(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function getResponseMessage(value: unknown): string | undefined {
  return isRecord(value) ? getNonEmptyMessage(value.message) : getNonEmptyMessage(value);
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
  return (
    isRecord(value) &&
    value.isSuccess === false &&
    hasMessage(value) &&
    isRecord(value.data) &&
    (isFetchErrorMessages(value.data.messages) || isEmptyRecord(value.data.messages)) &&
    Object.hasOwn(value.data, 'details')
  );
}

export function isExplicitErrorResponse(value: unknown): boolean {
  return isRecord(value) && value.isSuccess === false;
}

export function transportError<TBackendError = never>(
  message: string,
): FetcherError<TBackendError> {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
}

export function parseResponseText(text: string): unknown | undefined {
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

export function parseSuccess<TSuccess, TBackendError>(
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

export function normalizeSuccessResponse(value: unknown): FetcherSuccess<unknown> {
  if (isSuccessEnvelope(value)) return value;
  if (isRecord(value) && value.isSuccess === true) {
    return {
      isSuccess: true,
      message: getResponseMessage(value) ?? null,
      data: Object.hasOwn(value, 'data') ? value.data : undefined,
    };
  }
  return { isSuccess: true, message: getResponseMessage(value) ?? null, data: value };
}

function parseError<TBackendError>(
  envelope: FetcherError<unknown>,
  parser?: ResponseParser<TBackendError>,
): FetcherError<TBackendError> {
  const errorWithMessage = {
    ...envelope,
    message: getNonEmptyMessage(envelope.message) ?? DEFAULT_ERROR_MESSAGE,
  };
  if (!parser || isEmptyRecord(envelope.data.details))
    return errorWithMessage as FetcherError<TBackendError>;
  try {
    return {
      ...errorWithMessage,
      data: { ...envelope.data, details: parser(envelope.data.details) },
    };
  } catch {
    return transportError<TBackendError>(DEFAULT_ERROR_MESSAGE);
  }
}

export function parseResponseError<TBackendError>(
  value: unknown,
  parser?: ResponseParser<TBackendError>,
): FetcherError<TBackendError> {
  return isErrorEnvelope(value)
    ? parseError(value, parser)
    : transportError<TBackendError>(getResponseMessage(value) ?? DEFAULT_ERROR_MESSAGE);
}
