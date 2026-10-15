'use client';

import { PaginationLayout } from '@/components/common/pagination-layout/pagination-layout';
import {
  paginationLayoutSkeletonFilters,
  paginationLayoutSkeletonSort,
} from '@/components/common/pagination-layout/pagination-layout-skeleton-data';
import { routePaths } from '@/configs/route.path';
import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetGrid } from './pet-grid';
import { petGridSkeletonData } from './pet-grid-skeleton-data';
import { PetInfiniteListWrapper } from './pet-infinite-list-wrapper';
import { PetListMobileTools } from './pet-list-mobile-tools';

type PetListInteractiveProps = Readonly<{
  data: LandingPetListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function PetListInteractive({ data, isSkeleton = false, query }: PetListInteractiveProps) {
  const listKey = new URLSearchParams(query).toString();
  const filters = data.filters ?? [];

  return (
    <PaginationLayout
      basePath={routePaths.petsList}
      filterLabel="فیلتر حیوانات"
      filters={isSkeleton ? paginationLayoutSkeletonFilters : filters}
      isSkeleton={isSkeleton}
      mobileTools={
        <PetListMobileTools
          basePath={routePaths.petsList}
          disabled={isSkeleton}
          filters={isSkeleton ? paginationLayoutSkeletonFilters : filters}
          query={query}
          rangeQueryKeys={{ price: { min: 'priceFrom', max: 'priceTo' } }}
          resetPageOnChange={false}
          sort={isSkeleton ? paginationLayoutSkeletonSort : data.sort}
        />
      }
      query={query}
      rangeQueryKeys={{ price: { min: 'priceFrom', max: 'priceTo' } }}
      resetPageOnChange={false}
      skeletonFallback={<PetGrid pets={petGridSkeletonData} isSkeleton />}
      sort={isSkeleton ? paginationLayoutSkeletonSort : data.sort}
    >
      <h2 className="tw:sr-only">فهرست حیوانات</h2>
      <PetInfiniteListWrapper key={listKey} data={data} query={query} />
    </PaginationLayout>
  );
}
