'use client';

import InfiniteScroll from 'react-infinite-scroll-component';

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
  const { articles, error, fetchNextPage, hasNextPage } = useSuspenseArticleCatalogInfiniteQuery(
    data,
    query,
  );

  return (
    <InfiniteScroll
      dataLength={articles.length}
      endMessage={articles.length > 0 ? <EndListMessage /> : null}
      hasMore={hasNextPage ?? false}
      loader={<ArticleGrid articles={articlesCatalogSkeletonItems} isSkeleton />}
      next={() => void fetchNextPage()}
    >
      <ArticleGrid articles={articles} />
      {error ? (
        <ArticlesCatalogErrorFallback
          error={error}
          refreshOnRetry={false}
          retry={() => void fetchNextPage()}
        />
      ) : null}
    </InfiniteScroll>
  );
}

function EndListMessage() {
  return (
    <p className="tw:py-6 tw:text-center tw:text-body-s tw:text-muted-foreground">
      به انتهای لیست رسیده‌اید.
    </p>
  );
}
