import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductListErrorBoundary } from './product-list-error-boundary';

afterEach(cleanup);

function FailedProductListContent(): never {
  throw new Error('Catalog rendering failed.');
}

describe('ProductListErrorBoundary', () => {
  it('renders the shared error section for an unexpected catalogue failure', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ProductListErrorBoundary>
        <FailedProductListContent />
      </ProductListErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت فهرست محصولات انجام نشد');
    consoleError.mockRestore();
  });
});
