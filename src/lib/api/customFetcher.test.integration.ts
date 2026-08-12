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
  it('normalizes a public successful response', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ isSuccess: true, products: [1, 2] }));

    const result = await customFetcher<{ products: number[] }>({ url: '/products' });

    expect(result).toEqual({ isSuccess: true, data: { products: [1, 2] }, status: 200 });
  });

  it('attaches the session token and prevents an Authorization override', async () => {
    mockedGetSession.mockResolvedValueOnce({
      accessToken: 'session-token',
      accessExp: 1,
      refreshToken: 'refresh-token',
      sessionExp: 1,
      userId: 1,
    });
    fetchMock.mockResolvedValueOnce(jsonResponse({ isSuccess: true, user: { id: 1 } }));

    await customFetcher<{ user: { id: number } }>({
      url: '/profile',
      auth: true,
      headers: { Authorization: 'Bearer caller-token' },
    });

    const request = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(request?.headers).get('Authorization')).toBe('Bearer session-token');
    expect(request?.cache).toBe('no-store');
    expect(request?.next).toBeUndefined();
  });

  it('returns unauthorized without making a request when the session is missing', async () => {
    mockedGetSession.mockResolvedValueOnce(null);

    const result = await customFetcher({ url: '/profile', auth: true });

    expect(result).toEqual({
      isSuccess: false,
      status: 401,
      error: { kind: 'unauthorized', message: 'Authentication is required.' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([200, 422])('normalizes isSuccess false with HTTP %s', async (status) => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          isSuccess: false,
          message: 'Validation failed.',
          code: 'VALIDATION_ERROR',
          errors: { title: ['Title is required.'] },
        },
        status,
      ),
    );

    const result = await customFetcher<never, { message: string }>({ url: '/products' });

    expect(result).toMatchObject({
      isSuccess: false,
      status,
      error: {
        kind: 'backend',
        message: 'Validation failed.',
        code: 'VALIDATION_ERROR',
        fieldErrors: { title: ['Title is required.'] },
      },
    });
  });

  it('returns invalid-response for malformed server responses', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>Error</html>', { status: 500 }));

    const result = await customFetcher({ url: '/products' });

    expect(result).toMatchObject({
      isSuccess: false,
      status: 500,
      error: { kind: 'invalid-response' },
    });
  });

  it('uses success and error parsers', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ isSuccess: true, value: '4' }))
      .mockResolvedValueOnce(jsonResponse({ isSuccess: false, reason: 'invalid' }, 400));

    const success = await customFetcher<number>({
      url: '/value',
      parseSuccess: (value) => Number((value as { value: string }).value),
    });
    const error = await customFetcher<never, string>({
      url: '/value',
      parseError: (value) => (value as { reason: string }).reason,
      normalizeError: (reason) => ({ message: reason }),
    });

    expect(success).toEqual({ isSuccess: true, data: 4, status: 200 });
    expect(error).toMatchObject({
      isSuccess: false,
      error: { kind: 'backend', message: 'invalid', details: 'invalid' },
    });
  });

  it('returns invalid-response when a response parser rejects the payload', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ isSuccess: true, value: 'invalid' }));

    const result = await customFetcher<number>({
      url: '/value',
      parseSuccess: () => {
        throw new Error('Invalid payload');
      },
    });

    expect(result).toMatchObject({ isSuccess: false, error: { kind: 'invalid-response' } });
  });

  it('normalizes network and timeout failures', async () => {
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

    expect(network).toMatchObject({ isSuccess: false, error: { kind: 'network' } });
    expect(timeout).toMatchObject({ isSuccess: false, error: { kind: 'timeout' } });
  });

  it('supports successful empty 204 responses', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const result = await customFetcher<void>({ url: '/products/1', method: 'DELETE' });

    expect(result).toEqual({ isSuccess: true, data: undefined, status: 204 });
  });

  it('serializes JSON and FormData with the correct content type', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ isSuccess: true }))
      .mockResolvedValueOnce(jsonResponse({ isSuccess: true }));

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
    fetchMock.mockResolvedValueOnce(jsonResponse({ isSuccess: true }));

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
