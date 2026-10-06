import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProfileOrdersErrorBoundary } from './profile-orders-error-boundary';

afterEach(cleanup);

function FailedOrdersContent(): never {
  throw new Error('ارتباط با سرور برقرار نشد.');
}

describe('ProfileOrdersErrorBoundary', () => {
  it('renders a recoverable section fallback for unexpected rendering failures', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ProfileOrdersErrorBoundary>
        <FailedOrdersContent />
      </ProfileOrdersErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت سفارش‌ها انجام نشد');
    consoleError.mockRestore();
  });
});
