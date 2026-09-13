import type { ReactNode } from 'react';

import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';
import { cn } from '@/lib/utils';

import { PaginationFilters, type RangeQueryKeys } from './pagination-filters/default';
import { PaginationSort } from './pagination-sort';
import { PaginationMobileTools } from './pagination-mobile-tools';

type PaginationLayoutProps = Readonly<{
  basePath: string;
  children: ReactNode;
  filterLabel: string;
  filters?: readonly FilterDTO[];
  isSkeleton?: boolean;
  mobileTools?: ReactNode;
  query: Readonly<Record<string, string>>;
  rangeQueryKeys?: Readonly<Record<string, RangeQueryKeys>>;
  resetPageOnChange?: boolean;
  sort?: SortDTO;
}>;

export function PaginationLayout({
  basePath,
  children,
  filterLabel,
  filters = [],
  isSkeleton = false,
  mobileTools,
  query,
  rangeQueryKeys,
  resetPageOnChange = true,
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
      {mobileTools ?? (
        <PaginationMobileTools
          key={`mobile-${controlsKey}`}
          basePath={basePath}
          disabled={isSkeleton}
          filterLabel={filterLabel}
          filters={filters}
          query={query}
          rangeQueryKeys={rangeQueryKeys}
          resetPageOnChange={resetPageOnChange}
          sort={sort}
        />
      )}

      <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[16rem_minmax(0,1fr)] tw:xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="tw:sticky tw:top-28 tw:hidden tw:lg:block" aria-label={filterLabel}>
          <PaginationFilters
            key={`desktop-${controlsKey}`}
            basePath={basePath}
            disabled={isSkeleton}
            filters={filters}
            idPrefix="desktop"
            label={filterLabel}
            query={query}
            rangeQueryKeys={rangeQueryKeys}
            resetPageOnChange={resetPageOnChange}
          />
        </aside>

        <section className="tw:flex tw:min-w-0 tw:flex-col tw:gap-5">
          <PaginationSort
            basePath={basePath}
            disabled={isSkeleton}
            query={query}
            resetPageOnChange={resetPageOnChange}
            sort={sort}
          />
          {children}
        </section>
      </div>
    </div>
  );
}
