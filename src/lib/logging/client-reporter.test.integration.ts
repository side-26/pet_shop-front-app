import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  noteClientInteraction,
  reportClientError,
  resetClientReportingForTests,
  setClientRequestId,
} from './client-reporter';

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NEXT_PUBLIC_CLIENT_ERROR_REPORTING_ENABLED', 'true');
  vi.stubEnv('NEXT_PUBLIC_CLIENT_ERROR_SAMPLE_RATE', '1');
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockResolvedValue(new Response(null, { status: 202 }));
  resetClientReportingForTests();
});

describe('client error reporter', () => {
  it('sends a closed, correlation-aware report without the raw error', () => {
    setClientRequestId('request_12345678');
    noteClientInteraction('pointer');

    expect(() =>
      reportClientError(new Error('private user-entered message'), {
        component: 'global',
        errorType: 'unhandled_error',
      }),
    ).not.toThrow();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    const payload = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(url).toBe('/api/observability/client-errors');
    expect(init).toMatchObject({ method: 'POST', credentials: 'same-origin', keepalive: true });
    expect(payload).toEqual({
      event: 'client.unexpected_error',
      component: 'global',
      error_type: 'unhandled_error',
      error_fingerprint: expect.stringMatching(/^fp_[a-f0-9]{8}$/),
      interaction_type: 'pointer',
      request_id: 'request_12345678',
    });
    expect(JSON.stringify(payload)).not.toContain('private user-entered message');
  });

  it('deduplicates reports and isolates transport failure', () => {
    fetchMock.mockRejectedValue(new Error('collector unavailable'));

    expect(() => {
      reportClientError(new Error('failure'), {
        component: 'global',
        errorType: 'unhandled_error',
      });
      reportClientError(new Error('failure'), {
        component: 'global',
        errorType: 'unhandled_error',
      });
    }).not.toThrow();

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('does nothing when the kill switch is disabled', () => {
    vi.stubEnv('NEXT_PUBLIC_CLIENT_ERROR_REPORTING_ENABLED', 'false');

    reportClientError(new Error('failure'), {
      component: 'global',
      errorType: 'unhandled_error',
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
