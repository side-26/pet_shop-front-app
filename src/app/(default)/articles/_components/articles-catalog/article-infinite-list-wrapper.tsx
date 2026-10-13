'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';

import { ArticleGrid } from './article-grid';
import { ArticleInfiniteList } from './article-infinite-list';
import { ArticlesCatalogErrorBoundary } from './articles-catalog-error-boundary';
import { articlesCatalogSkeletonItems } from './articles-catalog-skeleton-data';

type ArticleInfiniteListWrapperProps = Readonly<{
  data: ArticlePaginatedResponse;
  query: Readonly<Record<string, string>>;
}>;

export function ArticleInfiniteListWrapper({ data, query }: ArticleInfiniteListWrapperProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ArticlesCatalogErrorBoundary onQueryReset={reset}>
          <Suspense fallback={<ArticleGrid articles={articlesCatalogSkeletonItems} isSkeleton />}>
            <ArticleInfiniteList data={data} query={query} />
          </Suspense>
        </ArticlesCatalogErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
