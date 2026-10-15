import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PetInfiniteListLoader } from './pet-infinite-list-loader';

afterEach(cleanup);

describe('Pet infinite-list support components', () => {
  it('reserves a non-interactive two-row card-grid skeleton while loading another page', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={queryClient}>
        <PetInfiniteListLoader />
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText('در حال دریافت حیوانات بیشتر').getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(screen.getAllByRole('heading', { name: 'عنوان نمونه حیوان' })).toHaveLength(8);
  });
});
