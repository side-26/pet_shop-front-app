import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardErrorBoundary } from './dashboard-error-boundary';

function ThrowError({ message }: Readonly<{ message: string }>): never {
  throw new Error(message);
}

describe('DashboardErrorBoundary', () => {
  it('shows the safe thrown message', () => {
    render(
      <DashboardErrorBoundary>
        <ThrowError message="دسترسی به آمار امکان‌پذیر نیست." />
      </DashboardErrorBoundary>,
    );

    expect(screen.getByText('دریافت آمار داشبورد انجام نشد')).toBeTruthy();
    expect(screen.getByText('دسترسی به آمار امکان‌پذیر نیست.')).toBeTruthy();
  });

  it('uses the dashboard fallback when the error message is blank', () => {
    render(
      <DashboardErrorBoundary>
        <ThrowError message="" />
      </DashboardErrorBoundary>,
    );

    expect(screen.getByText('نمایش آمار داشبورد انجام نشد. دوباره تلاش کنید.')).toBeTruthy();
  });
});
