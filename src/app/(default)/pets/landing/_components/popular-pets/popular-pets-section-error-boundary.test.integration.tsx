import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PopularPetsSectionErrorBoundary } from './popular-pets-section-error-boundary';

afterEach(cleanup);

function FailedPopularPetsContent(): never {
  throw new Error('ارتباط با سرور برقرار نشد.');
}

describe('PopularPetsSectionErrorBoundary', () => {
  it('renders FetchErrorSectionBoundary when the popular-pets content fails', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <PopularPetsSectionErrorBoundary>
        <FailedPopularPetsContent />
      </PopularPetsSectionErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت حیوانات پرطرفدار انجام نشد');
    expect(screen.getByRole('alert').textContent).toContain(
      'هنگام نمایش حیوانات پرطرفدار خطای غیرمنتظره‌ای رخ داد.',
    );

    consoleError.mockRestore();
  });
});
