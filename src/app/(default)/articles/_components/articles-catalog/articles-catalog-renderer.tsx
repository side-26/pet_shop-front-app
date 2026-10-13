import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';

import { ArticlesCatalogInteractive } from './articles-catalog-interactive';

type ArticlesCatalogRendererProps = Readonly<{
  data: ArticlePaginatedResponse;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ArticlesCatalogRenderer({
  data,
  isSkeleton = false,
  query,
}: ArticlesCatalogRendererProps) {
  return <ArticlesCatalogInteractive data={data} isSkeleton={isSkeleton} query={query} />;
}
