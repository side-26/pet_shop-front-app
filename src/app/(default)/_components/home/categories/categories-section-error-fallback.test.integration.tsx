import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CategoriesSectionErrorFallback } from './categories-section-error-fallback';

afterEach(cleanup);

describe('CategoriesSectionErrorFallback', () => {
  it('shows the normalized query error message and retries the affected query', () => {
    const onRetry = vi.fn();

    render(
      <CategoriesSectionErrorFallback
        error={new Error('ارتباط با سرور برقرار نشد.')}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert').textContent).toContain('ارتباط با سرور برقرار نشد.');
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('uses a safe fallback description for errors without a message', () => {
    render(<CategoriesSectionErrorFallback error={null} onRetry={vi.fn()} />);

    expect(screen.getByRole('alert').textContent).toContain(
      'دریافت دسته‌بندی‌های حیوانات با مشکل روبه‌رو شد.',
    );
  });
});
