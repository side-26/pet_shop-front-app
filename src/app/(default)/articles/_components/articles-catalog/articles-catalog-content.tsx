import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';

import { ArticlesCatalogEmptyFetch } from './articles-catalog-empty-fetch';
import { ArticlesCatalogRenderer } from './articles-catalog-renderer';

type ArticlesCatalogContentProps = Readonly<{
  articlesPromise: Promise<ArticlePaginatedResponse>;
  query: Readonly<Record<string, string>>;
}>;

export function ArticlesCatalogContent({ articlesPromise, query }: ArticlesCatalogContentProps) {
  const data = use(articlesPromise);

  return (
    <EmptyStateBoundary
      data={data.result}
      fallback={<ArticlesCatalogEmptyFetch />}
      isEmpty={() => data.result.length === 0}
    >
      <ArticlesCatalogRenderer data={data} query={query} />
    </EmptyStateBoundary>
  );
}
