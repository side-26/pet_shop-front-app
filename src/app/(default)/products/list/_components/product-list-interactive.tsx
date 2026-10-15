'use client';

import { PaginationLayout } from '@/components/common/pagination-layout/pagination-layout';
import {
  paginationLayoutSkeletonFilters,
  paginationLayoutSkeletonSort,
} from '@/components/common/pagination-layout/pagination-layout-skeleton-data';
import { routePaths } from '@/configs/route.path';
import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';
import type { FilterDTO } from '@/entities/pagination/pagination.types';

import { ProductGrid, productGridSkeletonData } from './product-grid';
import { ProductInfiniteListWrapper } from './product-infinite-list-wrapper';
import { ProductListMobileTools } from './product-list-mobile-tools';

function getProductFilters(filters: readonly FilterDTO[] | undefined): FilterDTO[] {
  return filters?.filter((filter) => filter.key !== 'available') ?? [];
}

type ProductListInteractiveProps = Readonly<{
  data: LandingProductListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ProductListInteractive({
  data,
  isSkeleton = false,
  query,
}: ProductListInteractiveProps) {
  const listKey = new URLSearchParams(query).toString();
  const filters = getProductFilters(data.filters);

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
          sort={isSkeleton ? paginationLayoutSkeletonSort : data.sort}
        />
      }
      query={query}
      rangeQueryKeys={{ price: { min: 'priceFrom', max: 'priceTo' } }}
      resetPageOnChange={false}
      skeletonFallback={<ProductGrid products={productGridSkeletonData} isSkeleton />}
      sort={isSkeleton ? paginationLayoutSkeletonSort : data.sort}
    >
      <h2 className="tw:sr-only">فهرست محصولات</h2>
      <ProductInfiniteListWrapper key={listKey} data={data} query={query} />
    </PaginationLayout>
  );
}
