import { createRef } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Countdown, type CountdownRef } from './countdown';
import { formatCountdown } from './countdown.helpers';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-08-16T00:00:00Z'));
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Countdown', () => {
  it('shows hours only when the duration reaches one hour', () => {
    expect(formatCountdown(3561)).toBe('59:21');
    expect(formatCountdown(3600)).toBe('01:00:00');
    expect(formatCountdown(90061)).toBe('25:01:01');
  });

  it('keeps the minutes segment when fewer than sixty seconds remain', () => {
    expect(formatCountdown(32)).toBe('00:32');
    expect(formatCountdown(0)).toBe('00:00');
  });

  it('counts down to zero and exposes the current value accessibly', () => {
    render(<Countdown seconds={2} />);

    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 00:02');

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 00:01');

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 00:00');
  });

  it('restarts from the latest seconds prop through its imperative ref', () => {
    const ref = createRef<CountdownRef>();
    const { rerender } = render(<Countdown ref={ref} seconds={5} />);

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 00:03');

    act(() => ref.current?.reset());
    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 00:05');

    rerender(<Countdown ref={ref} seconds={8} />);
    expect(screen.getByRole('timer').getAttribute('aria-label')).toBe('زمان باقی‌مانده: 00:08');
  });

  it('applies semantic color, size, custom classes, and a custom accessible label', () => {
    render(
      <Countdown
        seconds={32}
        color="warning"
        size="xl"
        className="tw:justify-center"
        aria-label="زمان تخفیف"
      />,
    );

    const timer = screen.getByRole('timer', { name: 'زمان تخفیف' });

    expect(timer.getAttribute('data-color')).toBe('warning');
    expect(timer.getAttribute('data-size')).toBe('xl');
    expect(timer.className).toContain('tw:justify-center');
    expect(timer.getAttribute('dir')).toBe('ltr');
  });
});
