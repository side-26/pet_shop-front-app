import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CategoriesSectionErrorBoundary } from './categories-section-error-boundary';

afterEach(cleanup);

function FailedPetTypesContent(): never {
  throw new Error('ارتباط با سرور برقرار نشد.');
}

describe('CategoriesSectionErrorBoundary', () => {
  it('renders FetchErrorSectionBoundary when the pet-type content fails', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <CategoriesSectionErrorBoundary>
        <FailedPetTypesContent />
      </CategoriesSectionErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت دسته‌بندی حیوانات انجام نشد');
    expect(screen.getByRole('alert').textContent).toContain(
      'هنگام نمایش دسته‌بندی‌های حیوانات خطای غیرمنتظره‌ای رخ داد.',
    );

    consoleError.mockRestore();
  });
});
