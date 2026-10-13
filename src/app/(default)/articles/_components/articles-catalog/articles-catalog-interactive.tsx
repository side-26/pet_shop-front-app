'use client';

import { TagsIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';
import { cn } from '@/lib/utils';

import { ArticleGrid } from './article-grid';
import { ArticleInfiniteListWrapper } from './article-infinite-list-wrapper';
import { ArticlesCatalogFilterControls } from './articles-catalog-filter-controls';
import { ArticlesCatalogMobileToolbar } from './articles-catalog-mobile-toolbar';
import { ArticlesSortSection } from './articles-sort-section';
import { articlesCatalogSkeletonItems } from './articles-catalog-skeleton-data';

type ArticlesCatalogInteractiveProps = Readonly<{
  data: ArticlePaginatedResponse;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ArticlesCatalogInteractive({
  data,
  isSkeleton = false,
  query,
}: ArticlesCatalogInteractiveProps) {
  const selectedTags = new Set((query.tags ?? '').split(',').filter(Boolean));

  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:grid tw:items-start tw:gap-5 tw:lg:grid-cols-[15rem_minmax(0,1fr)] tw:lg:gap-7',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <aside
        className="tw:order-2 tw:hidden tw:lg:sticky tw:lg:top-28 tw:lg:block tw:lg:order-1"
        aria-label="موضوعات مقاله‌ها"
      >
        <Card size="sm" variant="filled">
          <CardHeader>
            <CardTitle className="tw:flex tw:items-center tw:gap-2">
              <TagsIcon aria-hidden="true" className="tw:size-4 tw:text-primary" />
              فیلتر موضوعی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ArticlesCatalogFilterControls
              disabled={isSkeleton}
              petTypes={data.metadata.petTypes}
              query={query}
              selectedTags={selectedTags}
              tags={data.metadata.tags}
              value={query.petType}
            />
          </CardContent>
        </Card>
      </aside>

      <div className="tw:order-1 tw:flex tw:min-w-0 tw:flex-col tw:gap-5 tw:lg:order-2">
        <ArticlesCatalogMobileToolbar
          currentSort={data.metadata.sort.current}
          disabled={isSkeleton}
          options={data.metadata.sort.options}
          petType={query.petType}
          petTypes={data.metadata.petTypes}
          query={query}
          selectedTags={selectedTags}
          tags={data.metadata.tags}
          totalItems={data.pagination.totalItems}
        />
        <div className="tw:hidden tw:lg:block">
          <ArticlesSortSection
            current={data.metadata.sort.current}
            disabled={isSkeleton}
            options={data.metadata.sort.options}
            query={query}
            totalItems={data.pagination.totalItems}
          />
        </div>

        {isSkeleton ? (
          <ArticleGrid articles={articlesCatalogSkeletonItems} isSkeleton />
        ) : (
          <ArticleInfiniteListWrapper
            key={new URLSearchParams(query).toString()}
            data={data}
            query={query}
          />
        )}
      </div>
    </div>
  );
}
