import { PaginationLayout } from '@/components/common/pagination-layout/pagination-layout';
import {
  paginationLayoutSkeletonFilters,
  paginationLayoutSkeletonSort,
} from '@/components/common/pagination-layout/pagination-layout-skeleton-data';
import { routePaths } from '@/configs/route.path';
import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';

import { ProductInfiniteList } from './product-infinite-list';

type ProductListRendererProps = Readonly<{
  data?: LandingProductListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ProductListRenderer({ data, isSkeleton = false, query }: ProductListRendererProps) {
  const listKey = new URLSearchParams(query).toString();

  return (
    <PaginationLayout
      basePath={routePaths.productsList}
      filterLabel="فیلتر محصولات"
      filters={isSkeleton ? paginationLayoutSkeletonFilters : data?.filters}
      isSkeleton={isSkeleton}
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
