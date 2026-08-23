import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSetDefaultValue } from './use-set-default-value';

afterEach(() => {
  vi.useRealTimers();
});

describe('useSetDefaultValue', () => {
  it('updates the returned value after the configured debounce delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useSetDefaultValue(value, 300), {
      initialProps: { value: '' },
    });

    rerender({ value: 'غذای سگ' });
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('غذای سگ');
  });
});
