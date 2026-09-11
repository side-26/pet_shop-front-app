import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FetchErrorSectionBoundary } from './fetch-error-section-boundary';

afterEach(cleanup);

describe('FetchErrorSectionBoundary', () => {
  it('renders an accessible glass error fallback with customizable content', () => {
    render(
      <FetchErrorSectionBoundary
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

    render(<FetchErrorSectionBoundary onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
