import { Suspense } from 'react';

import { getCurrentUserArticlesAction } from '@/entities/articles/articles.actions';

import { ArticlesTableContainer } from './articles-table-container';
import { ArticlesTableErrorBoundary } from './articles-table-error-boundary';
import { articlesTableSkeletonData } from './articles-table-skeleton-data';
import { ArticlesTable } from './articles-table';

export function ArticlesTableWrapper() {
  const articlesPromise = getCurrentUserArticlesAction();

  return (
    <Suspense fallback={<ArticlesTable articles={articlesTableSkeletonData} isLoading />}>
      <ArticlesTableErrorBoundary>
        <ArticlesTableContainer articlesPromise={articlesPromise} />
      </ArticlesTableErrorBoundary>
    </Suspense>
  );
}
