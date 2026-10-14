import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSuspenseArticleCatalogInfiniteQuery } from '@/entities/articles/articles.client';
import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';

import { ArticleInfiniteList } from './article-infinite-list';

vi.mock('@/entities/articles/articles.client', () => ({
  useSuspenseArticleCatalogInfiniteQuery: vi.fn(),
}));
vi.mock('@/components/templates/custom-infinite-scroll', () => ({
  CustomInfiniteScroll: ({
    children,
    error,
    errorFallback,
    isFetchNextPageError,
  }: {
    children: React.ReactNode;
    error: unknown;
    errorFallback: (props: { error: unknown; retry: () => void }) => React.ReactNode;
    isFetchNextPageError: boolean;
  }) => (
    <>
      {children}
      {isFetchNextPageError ? errorFallback({ error, retry: retryNextPage }) : null}
    </>
  ),
}));
vi.mock('./article-grid', () => ({
  ArticleGrid: ({ isSkeleton }: { isSkeleton?: boolean }) =>
    isSkeleton ? <div>بارگذاری مقاله‌ها</div> : <div>مقاله‌ها</div>,
}));
vi.mock('./articles-catalog-error-boundary', () => ({
  ArticlesCatalogErrorFallback: ({ error, retry }: { error: unknown; retry: () => void }) => (
    <button type="button" onClick={retry}>
      {error instanceof Error ? error.message : 'تلاش مجدد'}
    </button>
  ),
}));

const retryNextPage = vi.fn();

const data = {
  result: [],
  pagination: {
    currentPage: 1,
    totalPages: 2,
    totalItems: 1,
    itemsPerPage: 12,
    hasNextPage: true,
    hasPrevPage: false,
    nextPage: 2,
    prevPage: null,
  },
  metadata: {
    tags: [],
    petTypes: [],
    sort: { current: 'newest', options: [] },
  },
} satisfies ArticlePaginatedResponse;

describe('ArticleInfiniteList', () => {
  it('delegates a next-page failure and retry to CustomInfinityScroll', () => {
    const error = new Error('بارگذاری صفحه بعد انجام نشد');
    retryNextPage.mockReset();
    vi.mocked(useSuspenseArticleCatalogInfiniteQuery).mockReturnValue({
      articles: [],
      error,
      fetchNextPage: retryNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isFetchNextPageError: true,
    } as unknown as ReturnType<typeof useSuspenseArticleCatalogInfiniteQuery>);

    render(<ArticleInfiniteList data={data} query={{}} />);

    fireEvent.click(screen.getByRole('button', { name: error.message }));

    expect(retryNextPage).toHaveBeenCalledOnce();
  });
});
