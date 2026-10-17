import { beforeEach, describe, expect, it, vi } from 'vitest';

import { observeInternalApiFailure } from '@/lib/logging/server-http-observer';

import { withApiHandler } from './with-api-handler';

vi.mock('@/lib/logging/server-http-observer', () => ({ observeInternalApiFailure: vi.fn() }));

beforeEach(() => vi.clearAllMocks());

describe('withApiHandler observability', () => {
  it('preserves a valid request ID on the response', async () => {
    const handler = withApiHandler(async () => Response.json({ ok: true }));
    const response = await handler(
      new Request('http://localhost/api/test', {
        headers: { 'X-Request-ID': 'request_12345678' },
      }),
      undefined,
    );

    expect(response.headers.get('x-request-id')).toBe('request_12345678');
    expect(observeInternalApiFailure).not.toHaveBeenCalled();
  });

  it('returns a safe correlated response and logs only normalized context on unexpected failure', async () => {
    const handler = withApiHandler(async () => {
      throw new Error('private failure message');
    });
    const response = await handler(
      new Request('http://localhost/api/private-id?token=secret', {
        headers: { 'X-Request-ID': 'request_12345678' },
      }),
      undefined,
    );

    expect(response.status).toBe(500);
    expect(response.headers.get('x-request-id')).toBe('request_12345678');
    expect(observeInternalApiFailure).toHaveBeenCalledWith({
      requestId: 'request_12345678',
      method: 'GET',
      path: '/api',
      statusCode: 500,
      errorType: 'Error',
    });
    expect(JSON.stringify(vi.mocked(observeInternalApiFailure).mock.calls)).not.toContain(
      'private failure message',
    );
  });
});
