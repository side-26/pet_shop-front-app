import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PetInfiniteListLoadError } from './pet-infinite-list-load-error';
import { PetInfiniteListLoader } from './pet-infinite-list-loader';

afterEach(cleanup);

describe('Pet infinite-list support components', () => {
  it('reserves a non-interactive two-row card-grid skeleton while loading another page', () => {
    render(<PetInfiniteListLoader />);

    expect(screen.getByLabelText('در حال دریافت حیوانات بیشتر').getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(screen.getAllByRole('heading', { name: 'عنوان نمونه حیوان' })).toHaveLength(8);
  });

  it('renders the fetch error and retries through its dedicated action', () => {
    const onRetry = vi.fn();
    render(
      <PetInfiniteListLoadError
        description="دریافت حیوانات بیشتر انجام نشد."
        isLoading={false}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت حیوانات بیشتر انجام نشد.');
    fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
