'use client';

import { CustomInfiniteScroll } from '@/components/templates/custom-infinite-scroll';
import { useSuspenseLandingProductsInfiniteQuery } from '@/entities/landing/landing.client';
import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';

import { ProductGrid } from './product-grid';
import { ProductInfiniteListLoader } from './product-infinite-list-loader';
import { ProductListDescription } from './product-list-description';
import { ProductListErrorFallback } from './product-list-error-boundary';

type ProductInfiniteListProps = Readonly<{
  data: LandingProductListPageDTO;
  query: Readonly<Record<string, string>>;
}>;

export function ProductInfiniteList({ data, query }: ProductInfiniteListProps) {
  const { products, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
    useSuspenseLandingProductsInfiniteQuery(data, query);

  return (
    <CustomInfiniteScroll
      dataLength={products.length}
      endMessage={products.length > 0 ? <ProductListDescription /> : null}
      error={error}
      errorFallback={({ error: nextPageError, retry }) => (
        <ProductListErrorFallback error={nextPageError} refreshOnRetry={false} retry={retry} />
      )}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage ?? false}
      isFetchingNextPage={isFetchingNextPage}
      isFetchNextPageError={isFetchNextPageError}
      loader={<ProductInfiniteListLoader />}
    >
      <ProductGrid products={products} />
    </CustomInfiniteScroll>
  );
}
