import { PaginationLayout } from '@/components/common/pagination-layout/pagination-layout';
import {
  paginationLayoutSkeletonFilters,
  paginationLayoutSkeletonSort,
} from '@/components/common/pagination-layout/pagination-layout-skeleton-data';
import { routePaths } from '@/configs/route.path';
import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';
import type { FilterDTO } from '@/entities/pagination/pagination.types';

import { ProductInfiniteList } from './product-infinite-list';
import { ProductListMobileTools } from './product-list-mobile-tools';

function getProductFilters(filters: readonly FilterDTO[] | undefined): FilterDTO[] {
  return filters?.filter((filter) => filter.key !== 'available') ?? [];
}

type ProductListRendererProps = Readonly<{
  data?: LandingProductListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ProductListRenderer({ data, isSkeleton = false, query }: ProductListRendererProps) {
  const listKey = new URLSearchParams(query).toString();
  const filters = getProductFilters(data?.filters);

  return (
    <PaginationLayout
      basePath={routePaths.productsList}
      filterLabel="فیلتر محصولات"
      filters={isSkeleton ? paginationLayoutSkeletonFilters : filters}
      isSkeleton={isSkeleton}
      mobileTools={
        <ProductListMobileTools
          basePath={routePaths.productsList}
          disabled={isSkeleton}
          filters={isSkeleton ? paginationLayoutSkeletonFilters : filters}
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
      <h2 className="tw:sr-only">فهرست محصولات</h2>
      <ProductInfiniteList key={listKey} data={data} isSkeleton={isSkeleton} query={query} />
    </PaginationLayout>
  );
}
