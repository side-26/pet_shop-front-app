'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';

import { ProductGrid, productGridSkeletonData } from './product-grid';
import { ProductInfiniteList } from './product-infinite-list';
import { ProductListErrorBoundary } from './product-list-error-boundary';

type ProductInfiniteListWrapperProps = Readonly<{
  data: LandingProductListPageDTO;
  query: Readonly<Record<string, string>>;
}>;

export function ProductInfiniteListWrapper({ data, query }: ProductInfiniteListWrapperProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ProductListErrorBoundary onQueryReset={reset}>
          <Suspense fallback={<ProductGrid products={productGridSkeletonData} isSkeleton />}>
            <ProductInfiniteList data={data} query={query} />
          </Suspense>
        </ProductListErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
