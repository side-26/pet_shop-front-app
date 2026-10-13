import { Suspense } from 'react';

import { getPaginatedArticlesAction } from '@/entities/articles/articles.actions';
import {
  normalizePaginationSearchParams,
  type PaginationSearchParams,
} from '@/entities/pagination/pagination.helpers';

import { ArticlesCatalogContent } from './articles-catalog-content';
import { ArticlesCatalogErrorBoundary } from './articles-catalog-error-boundary';
import { ArticlesCatalogRenderer } from './articles-catalog-renderer';
import { articlesCatalogSkeletonData } from './articles-catalog-skeleton-data';

type ArticlesCatalogSectionProps = Readonly<{
  searchParams: Promise<PaginationSearchParams>;
}>;

export function ArticlesCatalogSection({ searchParams }: ArticlesCatalogSectionProps) {
  return (
    <section className="tw:mt-10 tw:sm:mt-14" aria-labelledby="articles-catalog-title">
      <h2 id="articles-catalog-title" className="tw:sr-only">
        فهرست مقاله‌ها
      </h2>
      <Suspense
        fallback={
          <ArticlesCatalogRenderer data={articlesCatalogSkeletonData} isSkeleton query={{}} />
        }
      >
        <ArticlesCatalogErrorBoundary>
          <ArticlesCatalogQueryContent searchParams={searchParams} />
        </ArticlesCatalogErrorBoundary>
      </Suspense>
    </section>
  );
}

async function ArticlesCatalogQueryContent({ searchParams }: ArticlesCatalogSectionProps) {
  const query = normalizePaginationSearchParams(await searchParams);
  const articlesPromise = getPaginatedArticlesAction({ ...query, limit: query.limit ?? 12 });
  const suspenseKey = new URLSearchParams(query).toString();

  return (
    <Suspense
      key={suspenseKey}
      fallback={
        <ArticlesCatalogRenderer data={articlesCatalogSkeletonData} isSkeleton query={query} />
      }
    >
      <ArticlesCatalogContent articlesPromise={articlesPromise} query={query} />
    </Suspense>
  );
}
