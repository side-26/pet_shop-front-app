import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { reportClientError } from '@/lib/logging/client-reporter';

import { createFetchErrorSectionBoundary, FetchErrorSection } from './fetch-error-section';

vi.mock('@/lib/logging/client-reporter', () => ({
  reportClientError: vi.fn(),
}));

afterEach(cleanup);

describe('FetchErrorSection', () => {
  it('renders an accessible glass error fallback with customizable content', () => {
    render(
      <FetchErrorSection
        description="فهرست نژادها در دسترس نیست."
        onRetry={vi.fn()}
        title="خطا در دریافت نژادها"
      />,
    );

    const fallback = screen.getByRole('alert');
    expect(fallback.getAttribute('data-variant')).toBe('glass');
    expect(fallback.textContent).toContain('خطا در دریافت نژادها');
    expect(fallback.textContent).toContain('فهرست نژادها در دسترس نیست.');
    expect(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'بارگذاری مجدد صفحه' })).toBeTruthy();
  });

  it('uses the supplied recovery callback to retry only the failed data request', () => {
    const onRetry = vi.fn();

    render(<FetchErrorSection onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('prevents repeated retries until its short cooldown expires', () => {
    vi.useFakeTimers();
    const onRetry = vi.fn();

    render(<FetchErrorSection onRetry={onRetry} retryCooldownMs={500} />);

    const retryButton = screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' });
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledOnce();
    expect(retryButton).toHaveProperty('disabled', true);

    act(() => vi.advanceTimersByTime(500));
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('creates a shared boundary that reports the failed fetch region', async () => {
    const fetchError = new Error('Failed to load breeds');
    const FetchErrorBoundary = createFetchErrorSectionBoundary({
      description: 'فهرست نژادها در دسترس نیست.',
      title: 'خطا در دریافت نژادها',
    });

    function FailedFetch(): never {
      throw fetchError;
    }

    render(
      <FetchErrorBoundary>
        <FailedFetch />
      </FetchErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('خطا در دریافت نژادها');
    await waitFor(() =>
      expect(reportClientError).toHaveBeenCalledWith(fetchError, {
        component: 'react-boundary',
        errorType: 'render_error',
      }),
    );
  });
});
