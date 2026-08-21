import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSession } from '@/utils/session';

import { customFetcher } from './customFetcher';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));

const mockedGetSession = vi.mocked(getSession);
const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('API_BASE_URL', 'https://api.example.test');
  vi.stubGlobal('fetch', fetchMock);
});

describe('customFetcher', () => {
  it('returns the backend success envelope and defaults to no-store', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ isSuccess: true, message: 'Products loaded.', data: [1, 2] }),
    );

    const result = await customFetcher<number[]>({ url: '/products' });

    expect(result).toEqual({ isSuccess: true, message: 'Products loaded.', data: [1, 2] });
    expect(fetchMock.mock.calls[0]?.[1]?.cache).toBe('no-store');
  });

  it('treats a partial HTTP success envelope as a successful request', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ isSuccess: true, message: 'Registration completed.' }, 201),
    );

    const result = await customFetcher<void>({ url: '/users/register' });

    expect(result).toEqual({
      isSuccess: true,
      message: 'Registration completed.',
      data: undefined,
    });
  });

  it('treats a successful empty response as a successful request', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 201 }));

    const result = await customFetcher<void>({ url: '/users/register' });

    expect(result).toEqual({ isSuccess: true, message: null, data: undefined });
  });

  it('supports explicit public caching with reusable tags', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ isSuccess: true, message: null, data: [1, 2] }));

    await customFetcher<number[]>({
      url: '/products',
      cache: 'force-cache',
      next: { revalidate: 300, tags: ['products'] },
    });

    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      cache: 'force-cache',
      next: { revalidate: 300, tags: ['products'] },
    });
  });

  it('attaches the session token and keeps authenticated requests uncached', async () => {
    mockedGetSession.mockResolvedValueOnce({
      accessToken: 'session-token',
      accessExp: 1,
      refreshToken: 'refresh-token',
      sessionExp: 1,
      userId: '1',
      role: 'customer',
    });
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ isSuccess: true, message: null, data: { id: 1 } }),
    );

    await customFetcher<{ id: number }>({
      url: '/profile',
      auth: true,
      headers: { Authorization: 'Bearer caller-token' },
    });

    const request = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(request?.headers).get('Authorization')).toBe('Bearer session-token');
    expect(request?.cache).toBe('no-store');
    expect(request?.next).toBeUndefined();
  });

  it('returns an envelope error without requesting when authentication is missing', async () => {
    mockedGetSession.mockResolvedValueOnce(null);

    const result = await customFetcher({ url: '/profile', auth: true });

    expect(result).toEqual({
      isSuccess: false,
      message: 'Authentication is required.',
      data: { messages: {}, details: {} },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([200, 422])('preserves the backend error envelope with HTTP %s', async (status) => {
    const backendError = {
      isSuccess: false,
      message: 'Validation failed.',
      data: {
        messages: [{ value: 'title', label: 'Title is required.' }],
        details: { code: 'VALIDATION_ERROR' },
      },
    } as const;
    fetchMock.mockResolvedValueOnce(jsonResponse(backendError, status));

    const result = await customFetcher<never, { code: string }>({ url: '/products' });

    expect(result).toEqual(backendError);
  });

  it('uses a backend message from a partial error response', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ message: 'This phone number is already registered.' }, 409),
    );

    const result = await customFetcher({ url: '/users/register' });

    expect(result).toEqual({
      isSuccess: false,
      message: 'This phone number is already registered.',
      data: { messages: {}, details: {} },
    });
  });

  it('uses the default message when a backend error has no non-empty message', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ isSuccess: false, message: null, data: { messages: {}, details: {} } }, 500),
    );

    const result = await customFetcher({ url: '/products' });

    expect(result).toEqual({
      isSuccess: false,
      message: 'The server returned an invalid response.',
      data: { messages: {}, details: {} },
    });
  });

  it('applies parsers to success data and error details', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ isSuccess: true, message: null, data: '4' }))
      .mockResolvedValueOnce(
        jsonResponse({
          isSuccess: false,
          message: 'Invalid value.',
          data: { messages: {}, details: { reason: 'invalid' } },
        }),
      );

    const success = await customFetcher<number>({
      url: '/value',
      parseSuccess: (value) => Number(value),
    });
    const error = await customFetcher<never, string>({
      url: '/value',
      parseErrorDetails: (value) => (value as { reason: string }).reason,
    });

    expect(success).toEqual({ isSuccess: true, message: null, data: 4 });
    expect(error).toEqual({
      isSuccess: false,
      message: 'Invalid value.',
      data: { messages: {}, details: 'invalid' },
    });
  });

  it('returns an envelope error for malformed responses and parser failures', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('<html>Error</html>', { status: 500 }))
      .mockResolvedValueOnce(jsonResponse({ isSuccess: true, message: null, data: 'invalid' }));

    const malformed = await customFetcher({ url: '/malformed' });
    const parserFailure = await customFetcher<number>({
      url: '/value',
      parseSuccess: () => {
        throw new Error('Invalid payload');
      },
    });

    expect(malformed).toEqual({
      isSuccess: false,
      message: 'The server returned an invalid response.',
      data: { messages: {}, details: {} },
    });
    expect(parserFailure).toEqual(malformed);
  });

  it('normalizes network and timeout failures into the error envelope', async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError('Connection refused'))
      .mockImplementationOnce((_url, init) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        });
      });

    const network = await customFetcher({ url: '/network' });
    const timeout = await customFetcher({ url: '/timeout', timeoutMs: 1 });

    expect(network).toMatchObject({ isSuccess: false, message: 'Unable to reach the server.' });
    expect(timeout).toMatchObject({ isSuccess: false, message: 'The request timed out.' });
  });

  it('supports successful empty 204 responses', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const result = await customFetcher<void>({ url: '/products/1', method: 'DELETE' });

    expect(result).toEqual({ isSuccess: true, message: null, data: undefined });
  });

  it('serializes JSON and FormData with the correct content type', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ isSuccess: true, message: null, data: {} }))
      .mockResolvedValueOnce(jsonResponse({ isSuccess: true, message: null, data: {} }));

    await customFetcher<object, unknown, { title: string }>({
      url: '/products',
      method: 'POST',
      body: { title: 'Cat food' },
    });
    const formData = new FormData();
    formData.set('image', new Blob(['image']));
    await customFetcher<object, unknown, FormData>({
      url: '/uploads',
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const jsonRequest = fetchMock.mock.calls[0]?.[1];
    const formRequest = fetchMock.mock.calls[1]?.[1];
    expect(new Headers(jsonRequest?.headers).get('Content-Type')).toBe('application/json');
    expect(jsonRequest?.body).toBe(JSON.stringify({ title: 'Cat food' }));
    expect(new Headers(formRequest?.headers).has('Content-Type')).toBe(false);
    expect(formRequest?.body).toBe(formData);
  });

  it('encodes primitive and repeated query parameters', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ isSuccess: true, message: null, data: {} }));

    await customFetcher<object>({
      url: '/products',
      query: { category: ['cat food', 'toys'], page: 2, active: true, ignored: null },
    });

    const requestedUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requestedUrl.searchParams.getAll('category')).toEqual(['cat food', 'toys']);
    expect(requestedUrl.searchParams.get('page')).toBe('2');
    expect(requestedUrl.searchParams.get('active')).toBe('true');
    expect(requestedUrl.searchParams.has('ignored')).toBe(false);
  });
});
