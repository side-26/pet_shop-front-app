import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from './use-debounce';

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebounce', () => {
  it('uses a 500ms delay by default', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: '' },
    });

    rerender({ value: 'غذای سگ' });

    act(() => vi.advanceTimersByTime(499));
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('غذای سگ');
  });

  it('uses the latest dynamic delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: '', delay: 500 },
    });

    rerender({ value: 'غذای گربه', delay: 100 });

    act(() => vi.advanceTimersByTime(99));
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('غذای گربه');
  });
});
