'use client';

import { CustomInfiniteScroll } from '@/components/templates/custom-infinite-scroll';
import { useSuspenseArticleCatalogInfiniteQuery } from '@/entities/articles/articles.client';
import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';

import { ArticleGrid } from './article-grid';
import { ArticlesCatalogErrorFallback } from './articles-catalog-error-boundary';
import { articlesCatalogSkeletonItems } from './articles-catalog-skeleton-data';

type ArticleInfiniteListProps = Readonly<{
  data: ArticlePaginatedResponse;
  query: Readonly<Record<string, string>>;
}>;

export function ArticleInfiniteList({ data, query }: ArticleInfiniteListProps) {
  const { articles, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
    useSuspenseArticleCatalogInfiniteQuery(data, query);

  return (
    <CustomInfiniteScroll
      dataLength={articles.length}
      endMessage={articles.length > 0 ? <EndListMessage /> : null}
      error={error}
      errorFallback={({ error: nextPageError, retry }) => (
        <ArticlesCatalogErrorFallback error={nextPageError} refreshOnRetry={false} retry={retry} />
      )}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage ?? false}
      isFetchingNextPage={isFetchingNextPage}
      isFetchNextPageError={isFetchNextPageError}
      loader={<ArticleGrid articles={articlesCatalogSkeletonItems} isSkeleton />}
    >
      <ArticleGrid articles={articles} />
    </CustomInfiniteScroll>
  );
}

function EndListMessage() {
  return (
    <p className="tw:py-6 tw:text-center tw:text-body-s tw:text-muted-foreground">
      به انتهای لیست رسیده‌اید.
    </p>
  );
}
