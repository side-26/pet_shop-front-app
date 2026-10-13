import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReactQueryProvider } from '@/app/react-query-provider';
import { useSuspenseLandingSearchQuery } from '@/entities/landing/landing.client';

import { HeaderProductSearchEmptyFallback } from './header-product-search-empty-fallback';
import { HeaderProductSearchProvider } from './header-product-search-context';
import { HeaderProductSearchErrorFallback } from './header-product-search-error-fallback';
import { HeaderProductSearchResultsStream } from './header-product-search-results-stream';
import { HeaderProductSearchSuggestionItemGroup } from './suggestion-item-group';

vi.mock('@/entities/landing/landing.client', () => ({
  useSuspenseLandingSearchQuery: vi.fn(),
}));

afterEach(cleanup);

describe('HeaderProductSearchResultsStream', () => {
  it('renders horizontal item cards and a show-more link', async () => {
    vi.mocked(useSuspenseLandingSearchQuery).mockReturnValue({
      data: [
        {
          itemType: 'product',
          title: 'غذای خشک سگ بالغ',
          slug: 'adult-dog-dry-food',
          mainImage: '/images/home/product-dog-food.jpg',
          thumbnailImage: '',
        },
        {
          itemType: 'pet',
          title: 'غذای خشک گربه بالغ',
          slug: 'adult-cat-dry-food',
          mainImage: '/images/home/product-wet-food.jpg',
          thumbnailImage: '',
        },
      ],
    } as never);
    render(
      <ReactQueryProvider>
        <HeaderProductSearchProvider onCloseHoverCard={() => undefined}>
          <HeaderProductSearchResultsStream query="غذای" />
        </HeaderProductSearchProvider>
      </ReactQueryProvider>,
    );

    expect(await screen.findByText('غذای خشک سگ بالغ')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'مشاهده جزئیات' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'مشاهده بیشتر' })).toBeTruthy();
    expect(
      screen
        .getAllByRole('link', { name: 'مشاهده جزئیات' })
        .map((link) => link.getAttribute('href')),
    ).toEqual(['/products/adult-dog-dry-food', '/pets/adult-cat-dry-food']);
    expect(useSuspenseLandingSearchQuery).toHaveBeenCalledWith({
      search: 'غذای',
      page: 1,
      limit: 3,
    });
  });

  it('shows an informational empty fallback without an action', () => {
    render(<HeaderProductSearchEmptyFallback description="آیتمی وجود ندارد." />);

    expect(screen.getByText('آیتمی پیدا نشد')).toBeTruthy();
    expect(screen.getByText('آیتمی وجود ندارد.')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows an informational error fallback without a refresh action', () => {
    render(<HeaderProductSearchErrorFallback />);

    expect(screen.getByText('نمایش نتایج ممکن نیست')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('uses the Item group renderer for a non-interactive skeleton', () => {
    render(
      <ReactQueryProvider>
        <HeaderProductSearchProvider onCloseHoverCard={() => undefined}>
          <HeaderProductSearchSuggestionItemGroup isSkeleton />
        </HeaderProductSearchProvider>
      </ReactQueryProvider>,
    );

    expect(screen.getByRole('list', { busy: true })).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByRole('link', { name: 'مشاهده جزئیات' })).toBeNull();
  });
});
