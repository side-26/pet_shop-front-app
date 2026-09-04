import { Suspense } from 'react';

import { ProductsPaginateTable } from './products-paginate-table';
import { productsTableSkeletonData } from './products-table-skeleton-data';
import { ProductsTableWrapper } from './products-table-wrapper';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const KEYS = [
  'title',
  'category',
  'subCategory',
  'quantity',
  'price',
  'isEnable',
  'page',
  'limit',
  'sort',
] as const;

async function ProductsPageContent({ searchParams }: Props) {
  const params = await searchParams;
  const query = Object.fromEntries(
    KEYS.flatMap((key) => {
      const value = Array.isArray(params[key]) ? params[key][0] : params[key];
      return value === undefined ? [] : [[key, value]];
    }),
  );
  const requestedPage = Number(query.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  return <ProductsTableWrapper page={page} query={query} />;
}

export function ProductsPageContentWrapper({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <ProductsPaginateTable
          products={productsTableSkeletonData}
          page={1}
          pageCount={1}
          total={productsTableSkeletonData.length}
          query={{}}
          isLoading
        />
      }
    >
      <ProductsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
