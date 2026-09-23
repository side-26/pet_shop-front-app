import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProfileAddressesErrorBoundary } from './profile-addresses-error-boundary';

afterEach(cleanup);

function FailedAddressesContent(): never {
  throw new Error('ارتباط با سرور برقرار نشد.');
}

describe('ProfileAddressesErrorBoundary', () => {
  it('renders a recoverable section fallback for unexpected rendering failures', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ProfileAddressesErrorBoundary>
        <FailedAddressesContent />
      </ProfileAddressesErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت نشانی‌ها انجام نشد');
    consoleError.mockRestore();
  });
});
