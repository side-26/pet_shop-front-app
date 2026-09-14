'use client';

import { useCallback, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getLandingProductListAction } from '@/entities/landing/landing.actions';
import type {
  LandingProductListItemDTO,
  LandingProductListPageDTO,
} from '@/entities/landing/landing.dto';
import { globalErrorHandler } from '@/utils/helpers';

import { ProductGrid, productGridSkeletonData, toProductCardViewModel } from './product-grid';
import { ProductInfiniteListLoadError } from './product-infinite-list-load-error';
import { ProductInfiniteListLoader } from './product-infinite-list-loader';
import { ProductListDescription } from './product-list-description';

type ProductInfiniteListProps = Readonly<{
  data?: LandingProductListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ProductInfiniteList({ data, isSkeleton = false, query }: ProductInfiniteListProps) {
  const [products, setProducts] = useState<readonly LandingProductListItemDTO[]>(
    () => data?.result ?? [],
  );
  const [hasMore, setHasMore] = useState(data?.pagination.hasNextPage ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pageRef = useRef(data?.pagination.currentPage ?? 1);

  const loadNextPage = useCallback(
    async (isRetry = false) => {
      if (isLoading || (!hasMore && !isRetry)) return;

      setIsLoading(true);
      setLoadError(null);

      const result = await getLandingProductListAction({ ...query, page: pageRef.current + 1 });
      if (!result.isSuccess) {
        globalErrorHandler(result);
        setLoadError(result.message ?? 'دریافت محصولات بیشتر انجام نشد.');
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      pageRef.current = result.data.pagination.currentPage;
      setProducts((current) => {
        const currentIds = new Set(current.map((product) => product.id));
        return [...current, ...result.data.result.filter((product) => !currentIds.has(product.id))];
      });
      setHasMore(result.data.pagination.hasNextPage);
      setIsLoading(false);
    },
    [hasMore, isLoading, query],
  );

  if (isSkeleton) return <ProductGrid products={productGridSkeletonData} isSkeleton />;

  const productCards = products.map(toProductCardViewModel);

  return (
    <InfiniteScroll
      dataLength={products.length}
      endMessage={products.length > 0 ? <ProductListDescription /> : null}
      hasMore={hasMore}
      loader={<ProductInfiniteListLoader />}
      next={() => void loadNextPage()}
    >
      <ProductGrid products={productCards} />
      {loadError ? (
        <ProductInfiniteListLoadError
          description={loadError}
          isLoading={isLoading}
          onRetry={() => void loadNextPage(true)}
        />
      ) : null}
    </InfiniteScroll>
  );
}
