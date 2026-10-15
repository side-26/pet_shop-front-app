import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductDetailErrorBoundary } from './product-detail-error-boundary';

afterEach(cleanup);

function FailedProductDetail(): never {
  throw new Error('دریافت جزئیات محصول در دسترس نیست.');
}

describe('ProductDetailErrorBoundary', () => {
  it('renders the user-safe action error in its scoped recovery UI', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ProductDetailErrorBoundary>
        <FailedProductDetail />
      </ProductDetailErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('نمایش محصول انجام نشد');
    expect(screen.getByRole('alert').textContent).toContain('دریافت جزئیات محصول در دسترس نیست.');

    consoleError.mockRestore();
  });
});
