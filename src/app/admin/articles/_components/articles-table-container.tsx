import { use } from 'react';

import type { getCurrentUserArticlesAction } from '@/entities/articles/articles.actions';

import { ArticlesTableEmptyState } from './articles-table-empty-state';
import { ArticlesTableFetchError } from './articles-table-fetch-error';
import { mapArticlesTableRows } from './articles-table.mapper';
import { ArticlesTable } from './articles-table';

type ArticlesTableContainerProps = {
  articlesPromise: ReturnType<typeof getCurrentUserArticlesAction>;
};

export function ArticlesTableContainer({ articlesPromise }: ArticlesTableContainerProps) {
  const result = use(articlesPromise);

  if (!result.isSuccess) {
    return <ArticlesTableFetchError description={result.message} />;
  }

  if (!result.data.length) return <ArticlesTableEmptyState />;

  return <ArticlesTable articles={mapArticlesTableRows(result.data)} />;
}
