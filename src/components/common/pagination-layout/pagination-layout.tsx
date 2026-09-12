import type { ReactNode } from 'react';

import type { PaginationDTO } from '@/entities/pagination/pagination.dto';
import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';
import { cn } from '@/lib/utils';

import { PaginationFilters } from './pagination-filters';
import { PaginationNavigation } from './pagination-navigation';
import { PaginationSort } from './pagination-sort';
import { PaginationMobileTools } from './pagination-mobile-tools';

type PaginationLayoutProps = Readonly<{
  basePath: string;
  children: ReactNode;
  filterLabel: string;
  filters?: readonly FilterDTO[];
  isSkeleton?: boolean;
  itemCount: number;
  itemLabel: string;
  pagination: PaginationDTO;
  query: Readonly<Record<string, string>>;
  sort?: SortDTO;
}>;

export function PaginationLayout({
  basePath,
  children,
  filterLabel,
  filters = [],
  isSkeleton = false,
  itemCount,
  itemLabel,
  pagination,
  query,
  sort,
}: PaginationLayoutProps) {
  const controlsKey = new URLSearchParams(query).toString();

  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:min-w-0 tw:flex-col tw:gap-5',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <PaginationMobileTools
        key={`mobile-${controlsKey}`}
        basePath={basePath}
        disabled={isSkeleton}
        filterLabel={filterLabel}
        filters={filters}
        query={query}
        sort={sort}
      />

      <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="tw:sticky tw:top-28 tw:hidden tw:lg:block" aria-label={filterLabel}>
          <PaginationFilters
            key={`desktop-${controlsKey}`}
            basePath={basePath}
            disabled={isSkeleton}
            filters={filters}
            idPrefix="desktop"
            label={filterLabel}
            query={query}
          />
        </aside>

        <section className="tw:flex tw:min-w-0 tw:flex-col tw:gap-5">
          <PaginationSort basePath={basePath} disabled={isSkeleton} query={query} sort={sort} />
          {children}
          <PaginationNavigation
            basePath={basePath}
            disabled={isSkeleton}
            itemCount={itemCount}
            itemLabel={itemLabel}
            pagination={pagination}
            query={query}
          />
        </section>
      </div>
    </div>
  );
}
