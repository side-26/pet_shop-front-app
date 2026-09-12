import { PaginationLayout } from '@/components/common/pagination-layout/pagination-layout';
import {
  paginationLayoutSkeletonFilters,
  paginationLayoutSkeletonPagination,
  paginationLayoutSkeletonSort,
} from '@/components/common/pagination-layout/pagination-layout-skeleton-data';
import { routePaths } from '@/configs/route.path';
import type { CustomerProductsPageDTO } from '@/entities/products/products.dto';

import { ProductGrid, productGridSkeletonData, toProductCardViewModel } from './product-grid';

type ProductListRendererProps = Readonly<{
  data?: CustomerProductsPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ProductListRenderer({ data, isSkeleton = false, query }: ProductListRendererProps) {
  const products = isSkeleton
    ? productGridSkeletonData
    : (data?.result ?? []).map(toProductCardViewModel);

  return (
    <PaginationLayout
      basePath={routePaths.productsList}
      filterLabel="فیلتر محصولات"
      filters={isSkeleton ? paginationLayoutSkeletonFilters : data?.filters}
      isSkeleton={isSkeleton}
      itemCount={products.length}
      itemLabel="محصول"
      pagination={
        isSkeleton
          ? paginationLayoutSkeletonPagination
          : (data?.pagination ?? paginationLayoutSkeletonPagination)
      }
      query={query}
      sort={isSkeleton ? paginationLayoutSkeletonSort : data?.sort}
    >
      <h2 className="tw:sr-only">فهرست محصولات</h2>
      <ProductGrid products={products} isSkeleton={isSkeleton} />
    </PaginationLayout>
  );
}
