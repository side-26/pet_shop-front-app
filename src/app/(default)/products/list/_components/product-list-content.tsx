import { Suspense } from 'react';

import {
  normalizePaginationSearchParams,
  type PaginationSearchParams,
} from '@/entities/pagination/pagination.helpers';
import { getCustomerProducts } from '@/entities/products/products.service';

import { ProductListBreadcrumb } from './product-list-breadcrumb';
import { ProductListContainer } from './product-list-container';
import { ProductListRenderer } from './product-list-renderer';

type ProductListContentProps = Readonly<{
  searchParams: Promise<PaginationSearchParams>;
}>;

export function ProductListContent({ searchParams }: ProductListContentProps) {
  return (
    <main className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-5 tw:px-3 tw:py-5 tw:sm:px-5 tw:md:gap-6 tw:md:px-6 tw:md:py-8 tw:lg:px-8 tw:lg:py-10">
      <ProductListBreadcrumb />
      <header>
        <h1 className="tw:text-heading-2 tw:lg:text-heading-1">محصولات حیوانات خانگی</h1>
      </header>
      <Suspense fallback={<ProductListRenderer query={{}} isSkeleton />}>
        <ProductListQueryContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ProductListQueryContent({ searchParams }: ProductListContentProps) {
  const query = normalizePaginationSearchParams(await searchParams);
  const productsPromise = getCustomerProducts(query);
  const suspenseKey = new URLSearchParams(query).toString();

  return (
    <Suspense key={suspenseKey} fallback={<ProductListRenderer query={query} isSkeleton />}>
      <ProductListContainer productsPromise={productsPromise} query={query} />
    </Suspense>
  );
}
