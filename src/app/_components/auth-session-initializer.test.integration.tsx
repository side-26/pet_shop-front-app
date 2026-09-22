import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { syncUserIdentity } from '@/entities/auth/auth.client';

import { AuthSessionInitializer } from './auth-session-initializer';

vi.mock('@/entities/auth/auth.client', () => ({ syncUserIdentity: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('AuthSessionInitializer', () => {
  it('synchronizes identity with an abortable request when the application mounts', async () => {
    const { unmount } = render(<AuthSessionInitializer />);

    await waitFor(() => expect(syncUserIdentity).toHaveBeenCalledOnce());
    const signal = vi.mocked(syncUserIdentity).mock.calls[0]?.[0];
    expect(signal).toBeInstanceOf(AbortSignal);

    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
