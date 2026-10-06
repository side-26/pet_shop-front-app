'use client';

import InfiniteScroll from 'react-infinite-scroll-component';
import { useRef } from 'react';

import { useProfileOrdersPage } from '@/entities/profile/profile.client';
import type { ProfileOrdersPageDTO } from '@/entities/profile/profile.dto';

import { OrderItem } from './order-item';
import { OrderDetailDialogWrapper, type OrderDetailDialogRef } from './order-detail-dialog-wrapper';
import { ProfileOrdersEndMessage } from './profile-orders-end-message';

export function ProfileOrdersInfiniteList({
  initialPage,
}: Readonly<{ initialPage: ProfileOrdersPageDTO }>) {
  const { error, fetchNextPage, hasNextPage, isFetchingNextPage, loadedOrders } =
    useProfileOrdersPage(initialPage);
  const dialogRef = useRef<OrderDetailDialogRef>(null);
  const loadError = error instanceof Error ? error.message : null;

  return (
    <>
      <InfiniteScroll
        dataLength={loadedOrders.length}
        endMessage={
          <ProfileOrdersEndMessage
            errorMessage={loadError}
            hasNextPage={hasNextPage ?? false}
            isLoading={isFetchingNextPage}
            onLoadMore={() => void fetchNextPage()}
          />
        }
        hasChildren
        hasMore={false}
        loader={null}
        next={() => undefined}
      >
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-2 tw:lg:grid-cols-3">
          {loadedOrders.map((order) => (
            <OrderItem
              key={order._id}
              onOpenDetail={(orderId) => dialogRef.current?.open(orderId)}
              order={order}
            />
          ))}
        </div>
      </InfiniteScroll>
      <OrderDetailDialogWrapper ref={dialogRef} />
    </>
  );
}
