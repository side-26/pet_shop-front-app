import { use } from 'react';

import type { getCurrentUserArticlesAction } from '@/entities/articles/articles.actions';
import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';

import { ArticlesTableEmptyState } from './articles-table-empty-state';
import { ArticlesTable } from './articles-table';
import { transformArticleListResult } from '@/entities/articles/articles.transformer';

type ArticlesTableContainerProps = {
  articlesPromise: ReturnType<typeof getCurrentUserArticlesAction>;
};

export function ArticlesTableContainer({ articlesPromise }: ArticlesTableContainerProps) {
  const request = use(articlesPromise);

  const data = transformArticleListResult(request);

  return (
    <EmptyStateBoundary data={data} fallback={<ArticlesTableEmptyState />}>
      <ArticlesTable articles={data} />
    </EmptyStateBoundary>
  );
}
