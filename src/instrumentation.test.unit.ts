import { beforeEach, describe, expect, it, vi } from 'vitest';

import { observeNextRequestFailure } from '@/lib/logging/server-http-observer';

import { onRequestError } from './instrumentation';

vi.mock('@/lib/logging/server-http-observer', () => ({
  observeNextRequestFailure: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NEXT_RUNTIME', 'nodejs');
});

describe('server instrumentation', () => {
  it('reports a normalized Server Action failure without the raw error or headers', async () => {
    await onRequestError(
      new TypeError('private error message'),
      {
        path: '/checkout?private=value',
        method: 'POST',
        headers: { 'x-request-id': 'request_12345678', cookie: 'private-cookie' },
      },
      {
        routerKind: 'App Router',
        routePath: '/app/cart/checkout/page',
        routeType: 'action',
        renderSource: 'react-server-components',
        revalidateReason: undefined,
      },
    );

    expect(observeNextRequestFailure).toHaveBeenCalledWith({
      requestId: 'request_12345678',
      method: 'POST',
      routePath: '/app/cart/checkout/page',
      routeType: 'action',
      errorType: 'TypeError',
    });
    expect(JSON.stringify(vi.mocked(observeNextRequestFailure).mock.calls)).not.toContain(
      'private',
    );
  });
});
