import { PaginationLayout } from '@/components/common/pagination-layout/pagination-layout';
import {
  paginationLayoutSkeletonFilters,
  paginationLayoutSkeletonSort,
} from '@/components/common/pagination-layout/pagination-layout-skeleton-data';
import { routePaths } from '@/configs/route.path';
import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetInfiniteList } from './pet-infinite-list';
import { PetListDescription } from './pet-list-description';
import { PetListMobileTools } from './pet-list-mobile-tools';

type PetListRendererProps = Readonly<{
  data?: LandingPetListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function PetListRenderer({ data, isSkeleton = false, query }: PetListRendererProps) {
  const listKey = new URLSearchParams(query).toString();

  return (
    <PaginationLayout
      basePath={routePaths.petsList}
      filterLabel="فیلتر حیوانات"
      filters={isSkeleton ? paginationLayoutSkeletonFilters : data?.filters}
      isSkeleton={isSkeleton}
      mobileTools={
        <PetListMobileTools
          basePath={routePaths.petsList}
          disabled={isSkeleton}
          filters={isSkeleton ? paginationLayoutSkeletonFilters : (data?.filters ?? [])}
          query={query}
          rangeQueryKeys={{ price: { min: 'priceFrom', max: 'priceTo' } }}
          resetPageOnChange={false}
          sort={isSkeleton ? paginationLayoutSkeletonSort : data?.sort}
        />
      }
      query={query}
      rangeQueryKeys={{ price: { min: 'priceFrom', max: 'priceTo' } }}
      resetPageOnChange={false}
      sort={isSkeleton ? paginationLayoutSkeletonSort : data?.sort}
    >
      <h2 className="tw:sr-only">فهرست حیوانات</h2>
      <PetInfiniteList
        key={listKey}
        data={data}
        endMessage={<PetListDescription />}
        isSkeleton={isSkeleton}
        query={query}
      />
    </PaginationLayout>
  );
}
