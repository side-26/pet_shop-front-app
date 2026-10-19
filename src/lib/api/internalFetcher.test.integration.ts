import { beforeEach, describe, expect, it, vi } from 'vitest';

import { reportClientError, setClientRequestId } from '@/lib/logging/client-reporter';

import { internalFetcher } from './internalFetcher';

vi.mock('@/lib/logging/client-reporter', () => ({
  reportClientError: vi.fn(),
  setClientRequestId: vi.fn(),
}));

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.test/api');
});

describe('internalFetcher observability', () => {
  it('propagates and captures request correlation without changing the response contract', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ result: [] }), {
        status: 200,
        headers: { 'X-Request-ID': 'server_request_1234' },
      }),
    );

    await expect(
      internalFetcher<{ result: never[] }>({
        url: '/api/landing/products',
        headers: { 'X-Request-ID': 'client_request_1234' },
      }),
    ).resolves.toEqual({ result: [] });

    const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('http://localhost/api/landing/products');
    expect(headers.get('x-request-id')).toBe('client_request_1234');
    expect(setClientRequestId).toHaveBeenCalledWith('server_request_1234');
    expect(reportClientError).not.toHaveBeenCalled();
  });

  it('reports unexpected server failures through the narrow browser reporter', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: 'Backend failure' }), { status: 503 }),
    );

    await expect(
      internalFetcher({
        url: '/api/landing/products/private-slug',
        headers: { 'X-Request-ID': 'client_request_1234' },
      }),
    ).rejects.toMatchObject({ status: 503 });

    expect(reportClientError).toHaveBeenCalledWith(expect.any(Error), {
      component: 'internal-fetcher',
      errorType: 'server_error',
      fingerprintParts: ['GET', '/api', 503],
      requestId: 'client_request_1234',
    });
  });
});
