import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { OffersSectionErrorBoundary } from './offers-section-error-boundary';

afterEach(cleanup);

function FailedOffersContent(): never {
  throw new Error('ارتباط با سرور برقرار نشد.');
}

describe('OffersSectionErrorBoundary', () => {
  it('renders FetchErrorSectionBoundary when the offers content fails', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <OffersSectionErrorBoundary>
        <FailedOffersContent />
      </OffersSectionErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت پیشنهادها انجام نشد');
    expect(screen.getByRole('alert').textContent).toContain(
      'هنگام نمایش پیشنهادهای شگفت‌انگیز خطای غیرمنتظره‌ای رخ داد.',
    );

    consoleError.mockRestore();
  });
});
