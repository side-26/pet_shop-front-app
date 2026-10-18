import { describe, expect, it, vi } from 'vitest';

const { pinoMock, transportMock } = vi.hoisted(() => {
  const transport = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  return { pinoMock: vi.fn(() => transport), transportMock: transport };
});

vi.mock('pino', () => ({ default: pinoMock }));

import { serverLogger } from './server-logger';

describe('serverLogger', () => {
  it('does not read the runtime clock when Next.js reports a prerender failure', () => {
    expect(pinoMock).toHaveBeenCalledWith(expect.objectContaining({ timestamp: false }));

    serverLogger.error(
      {
        event: 'server.unexpected_error',
        component: 'next-runtime',
        error_type: 'Error',
      },
      'Next runtime operation failed',
    );

    expect(transportMock.error).toHaveBeenCalledOnce();
  });
});
