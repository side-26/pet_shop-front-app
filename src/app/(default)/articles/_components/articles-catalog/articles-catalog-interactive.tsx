'use client';

import { TagsIcon } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';
import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';
import {
  createPaginationRangeFilterHref,
  createPaginationSingleFilterHref,
  createPaginationSortHref,
} from '@/entities/pagination/pagination.helpers';
import { cn } from '@/lib/utils';

import { ArticleGrid } from './article-grid';
import { ArticleInfiniteListWrapper } from './article-infinite-list-wrapper';
import { ArticlesPetTypeFilterSection } from './articles-pet-type-filter-section';
import { ArticlesSortSection } from './articles-sort-section';
import { ArticlesTagFilterSection } from './articles-tag-filter-section';
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
  const router = useRouter();
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
        className="tw:order-2 tw:lg:sticky tw:lg:top-28 tw:lg:order-1"
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
            <ArticlesTagFilterSection
              disabled={isSkeleton}
              selectedTags={selectedTags}
              tags={data.metadata.tags}
              onToggle={(tag) =>
                router.push(
                  createPaginationRangeFilterHref(routePaths.articles, query, 'tags', tag),
                  { scroll: false },
                )
              }
            />
            <Separator className="tw:my-5" />
            <ArticlesPetTypeFilterSection
              disabled={isSkeleton}
              petTypes={data.metadata.petTypes}
              value={query.petType}
              onValueChange={(petType) =>
                router.push(
                  createPaginationSingleFilterHref(routePaths.articles, query, 'petType', petType),
                  { scroll: false },
                )
              }
            />
          </CardContent>
        </Card>
      </aside>

      <div className="tw:order-1 tw:flex tw:min-w-0 tw:flex-col tw:gap-5 tw:lg:order-2">
        <ArticlesSortSection
          current={data.metadata.sort.current}
          disabled={isSkeleton}
          options={data.metadata.sort.options}
          totalItems={data.pagination.totalItems}
          onSortChange={(sort) =>
            router.push(createPaginationSortHref(routePaths.articles, query, sort), {
              scroll: false,
            })
          }
        />

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
