import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductInfiniteListLoadError } from './product-infinite-list-load-error';
import { ProductInfiniteListLoader } from './product-infinite-list-loader';

afterEach(cleanup);

describe('Product infinite-list support components', () => {
  it('reserves a non-interactive two-row card-grid skeleton while loading another page', () => {
    render(<ProductInfiniteListLoader />);

    expect(screen.getByLabelText('در حال دریافت محصولات بیشتر').getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(screen.getAllByRole('heading', { name: 'عنوان نمونه محصول' })).toHaveLength(8);
  });

  it('renders the fetch error and retries through its dedicated action', () => {
    const onRetry = vi.fn();
    render(
      <ProductInfiniteListLoadError
        description="دریافت محصولات بیشتر انجام نشد."
        isLoading={false}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت محصولات بیشتر انجام نشد.');
    fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
