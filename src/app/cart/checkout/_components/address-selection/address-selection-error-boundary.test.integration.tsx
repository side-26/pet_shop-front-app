import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CheckoutAddressSelectionErrorBoundary } from './address-selection-error-boundary';

afterEach(cleanup);

function FailedAddressSelection(): never {
  throw new Error('Address rendering failed.');
}

describe('CheckoutAddressSelectionErrorBoundary', () => {
  it('renders a recoverable error section for unexpected failures', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <CheckoutAddressSelectionErrorBoundary>
        <FailedAddressSelection />
      </CheckoutAddressSelectionErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت نشانی‌ها انجام نشد');
    consoleError.mockRestore();
  });
});
