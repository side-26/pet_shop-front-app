'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import InfiniteScroll, { type Props as InfiniteScrollProps } from 'react-infinite-scroll-component';

type CustomInfiniteScrollErrorFallbackProps = Readonly<{
  error: unknown;
  retry: () => void;
}>;

type CustomInfiniteScrollProps = Readonly<
  Omit<InfiniteScrollProps, 'children' | 'hasMore' | 'loader' | 'next'> & {
    children: ReactNode;
    error: unknown;
    errorFallback: (props: CustomInfiniteScrollErrorFallbackProps) => ReactNode;
    fetchNextPage: () => Promise<unknown>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isFetchNextPageError: boolean;
    loader: ReactNode;
  }
>;

export function CustomInfiniteScroll({
  children,
  error,
  errorFallback,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  loader,
  ...infiniteScrollProps
}: CustomInfiniteScrollProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => {
        const retry = () => {
          reset();
          void fetchNextPage();
        };
        const loadNextPage = () => {
          if (isFetchingNextPage || isFetchNextPageError) return;

          void fetchNextPage();
        };

        return (
          <InfiniteScroll
            {...infiniteScrollProps}
            hasMore={hasNextPage && !isFetchNextPageError}
            loader={loader}
            next={loadNextPage}
          >
            {children}
            {isFetchNextPageError ? errorFallback({ error, retry }) : null}
          </InfiniteScroll>
        );
      }}
    </QueryErrorResetBoundary>
  );
}

export type { CustomInfiniteScrollErrorFallbackProps, CustomInfiniteScrollProps };
