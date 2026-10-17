import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getSession } from '@/utils/session';
import { serverLogger } from '@/lib/logging/server-logger';

import { POST } from './route';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/logging/server-logger', () => ({
  serverLogger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const validReport = {
  event: 'client.unexpected_error',
  component: 'global',
  error_type: 'unhandled_error',
  error_fingerprint: 'fp_1234abcd',
  interaction_type: 'pointer',
  request_id: 'request_12345678',
};

function reportRequest(body: unknown): Request {
  return new Request('http://localhost/api/observability/client-errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('CLIENT_ERROR_REPORTING_ENABLED', 'true');
  vi.mocked(getSession).mockResolvedValue({ userId: 'trusted-user' } as never);
});

describe('POST /api/observability/client-errors', () => {
  it('accepts a valid authenticated report without logging browser identity or payloads', async () => {
    const response = await POST(reportRequest(validReport));

    expect(response.status).toBe(202);
    expect(await response.text()).toBe('');
    expect(serverLogger.error).toHaveBeenCalledWith(
      {
        event: 'client.unexpected_error',
        component: 'client-telemetry',
        upstream: 'browser',
        request_id: 'request_12345678',
        error_type: 'unhandled_error',
        error_fingerprint: 'fp_1234abcd',
        interaction_type: 'pointer',
      },
      'Browser error reported',
    );
  });

  it('rejects unauthenticated, unknown, and oversized reports', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);
    expect((await POST(reportRequest(validReport))).status).toBe(401);

    expect((await POST(reportRequest({ ...validReport, severity: 'fatal' }))).status).toBe(400);

    const oversized = new Request('http://localhost/api/observability/client-errors', {
      method: 'POST',
      headers: { 'Content-Length': '9000' },
      body: '{}',
    });
    expect((await POST(oversized)).status).toBe(413);
  });

  it('honors the server kill switch', async () => {
    vi.stubEnv('CLIENT_ERROR_REPORTING_ENABLED', 'false');

    expect((await POST(reportRequest(validReport))).status).toBe(404);
    expect(getSession).not.toHaveBeenCalled();
  });
});
