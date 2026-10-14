import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { Props as InfiniteScrollProps } from 'react-infinite-scroll-component';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomInfiniteScroll } from '.';

type MockInfiniteScrollProps = Pick<
  InfiniteScrollProps,
  'children' | 'hasMore' | 'loader' | 'next'
>;

vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children, hasMore, loader, next }: MockInfiniteScrollProps) => (
    <section data-testid="infinite-scroll" data-has-more={hasMore}>
      <button type="button" onClick={next}>
        بارگذاری بیشتر
      </button>
      {loader}
      {children}
    </section>
  ),
}));

afterEach(cleanup);

function renderCustomInfiniteScroll({
  error = null,
  errorFallback = () => null,
  fetchNextPage = vi.fn().mockResolvedValue(undefined),
  isFetchingNextPage = false,
  isFetchNextPageError = false,
}: {
  error?: unknown;
  errorFallback?: (props: { error: unknown; retry: () => void }) => ReactNode;
  fetchNextPage?: () => Promise<unknown>;
  isFetchingNextPage?: boolean;
  isFetchNextPageError?: boolean;
} = {}) {
  render(
    <CustomInfiniteScroll
      dataLength={2}
      error={error}
      errorFallback={errorFallback}
      fetchNextPage={fetchNextPage}
      hasNextPage
      isFetchingNextPage={isFetchingNextPage}
      isFetchNextPageError={isFetchNextPageError}
      loader={<p>در حال بارگذاری</p>}
    >
      <p>نتایج فعلی</p>
    </CustomInfiniteScroll>,
  );

  return { fetchNextPage };
}

describe('CustomInfiniteScroll', () => {
  it('requests the next page while more data is available', () => {
    const { fetchNextPage } = renderCustomInfiniteScroll();

    fireEvent.click(screen.getByRole('button', { name: 'بارگذاری بیشتر' }));

    expect(fetchNextPage).toHaveBeenCalledOnce();
    expect(screen.getByText('نتایج فعلی')).toBeTruthy();
  });

  it('renders the feature fallback and retries instead of auto-loading after a next-page failure', () => {
    const error = new Error('بارگذاری صفحه بعد انجام نشد');
    const { fetchNextPage } = renderCustomInfiniteScroll({
      error,
      isFetchNextPageError: true,
      errorFallback: ({ error: fallbackError, retry }) => (
        <button type="button" onClick={retry}>
          {fallbackError instanceof Error ? fallbackError.message : 'تلاش مجدد'}
        </button>
      ),
    });

    expect(screen.getByText('بارگذاری صفحه بعد انجام نشد')).toBeTruthy();
    expect(screen.getByTestId('infinite-scroll').getAttribute('data-has-more')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'بارگذاری بیشتر' }));
    expect(fetchNextPage).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'بارگذاری صفحه بعد انجام نشد' }));
    expect(fetchNextPage).toHaveBeenCalledOnce();
  });
});
