import { afterEach, describe, expect, it, vi } from 'vitest';

import { wait } from './wait';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('wait', () => {
  it('resolves after the requested duration and clears its timeout', async () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const pendingWait = wait(3_000);
    await vi.advanceTimersByTimeAsync(2_999);
    expect(clearTimeoutSpy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await expect(pendingWait).resolves.toBeUndefined();
    expect(clearTimeoutSpy).toHaveBeenCalledOnce();
  });
});
