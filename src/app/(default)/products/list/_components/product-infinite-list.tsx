'use client';

import { useCallback, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getLandingProductListAction } from '@/entities/landing/landing.actions';
import type {
  LandingProductListItemDTO,
  LandingProductListPageDTO,
} from '@/entities/landing/landing.dto';
import { globalErrorHandler } from '@/utils/helpers';

import { ProductGrid, productGridSkeletonData, toProductCardViewModel } from './product-grid';

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
      endMessage={
        products.length > 0 ? (
          <p className="tw:py-2 tw:text-center tw:text-body-s tw:text-muted-foreground">
            همه محصولات نمایش داده شدند.
          </p>
        ) : null
      }
      hasMore={hasMore}
      loader={
        <div
          className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:py-4"
          aria-live="polite"
        >
          <Spinner aria-hidden="true" />
          <span className="tw:text-body-s tw:text-muted-foreground">
            در حال دریافت محصولات بیشتر
          </span>
        </div>
      }
      next={() => void loadNextPage()}
    >
      <ProductGrid isAppending={isLoading} products={productCards} />
      {loadError ? (
        <div className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:py-4" role="alert">
          <p className="tw:text-body-s tw:text-error">{loadError}</p>
          <Button
            color="secondary"
            size="sm"
            variant="outlined"
            isLoading={isLoading}
            loadingText="در حال تلاش دوباره"
            onClick={() => void loadNextPage(true)}
          >
            تلاش دوباره
          </Button>
        </div>
      ) : null}
    </InfiniteScroll>
  );
}
