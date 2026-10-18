import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useRouter } from './use-router';

const router = { push: vi.fn() };

vi.mock('nextjs-toploader/app', () => ({
  useRouter: () => router,
}));

describe('useRouter', () => {
  it('returns the nextjs-toploader router', () => {
    const { result } = renderHook(() => useRouter());

    expect(result.current).toBe(router);
  });
});
