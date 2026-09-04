import { Suspense } from 'react';

import { getManagementProductsAction } from '@/entities/products/products.actions';

import { ProductsPaginateTable } from './products-paginate-table';
import { ProductsTableContainer } from './products-table-container';
import { productsTableSkeletonData } from './products-table-skeleton-data';

type Props = { page: number; query: Record<string, string> };

export function ProductsTableWrapper({ page, query }: Props) {
  const productsPromise = getManagementProductsAction(query);
  const key = new URLSearchParams(
    Object.entries(query).sort(([a], [b]) => a.localeCompare(b)),
  ).toString();
  return (
    <Suspense
      key={key}
      fallback={
        <ProductsPaginateTable
          products={productsTableSkeletonData}
          page={page}
          pageCount={1}
          total={productsTableSkeletonData.length}
          query={query}
          isLoading
        />
      }
    >
      <ProductsTableContainer productsPromise={productsPromise} query={query} />
    </Suspense>
  );
}
