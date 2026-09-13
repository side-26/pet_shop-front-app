import { Suspense } from 'react';

import {
  normalizePaginationSearchParams,
  type PaginationSearchParams,
} from '@/entities/pagination/pagination.helpers';
import { getLandingProductList } from '@/entities/landing/landing.service';

import { ProductListBreadcrumb } from './product-list-breadcrumb';
import { ProductListContainer } from './product-list-container';
import { ProductListRenderer } from './product-list-renderer';

type ProductListContentProps = Readonly<{
  searchParams: Promise<PaginationSearchParams>;
}>;

export function ProductListContent({ searchParams }: ProductListContentProps) {
  return (
    <main className="tw:default-layout-container tw:flex tw:flex-col tw:gap-5 tw:py-5 tw:md:gap-6 tw:md:py-8 tw:lg:py-10">
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
  const {
    limit: _limit,
    page: _page,
    ...query
  } = normalizePaginationSearchParams(await searchParams);
  const productsPromise = getLandingProductList(query);
  const suspenseKey = new URLSearchParams(query).toString();

  return (
    <Suspense key={suspenseKey} fallback={<ProductListRenderer query={query} isSkeleton />}>
      <ProductListContainer productsPromise={productsPromise} query={query} />
    </Suspense>
  );
}
