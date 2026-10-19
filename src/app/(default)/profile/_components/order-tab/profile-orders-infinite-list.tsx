'use client';

import { useRef } from 'react';

import { CustomInfiniteScroll } from '@/components/templates/custom-infinite-scroll';
import { useDialogController } from '@/hooks/use-dialog-controller';
import { useProfileOrdersPage } from '@/entities/profile/profile.client';
import type { ProfileOrdersPageDTO } from '@/entities/profile/profile.dto';

import { OrderItem } from './order-item';
import { OrderDetailDialogWrapper, type OrderDetailDialogRef } from './order-detail-dialog-wrapper';
import { ProfileOrdersEndMessage } from './profile-orders-end-message';

export function ProfileOrdersInfiniteList({
  initialPage,
}: Readonly<{ initialPage: ProfileOrdersPageDTO }>) {
  const {
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    loadedOrders,
  } = useProfileOrdersPage(initialPage);
  const dialogRef = useRef<OrderDetailDialogRef>(null);
  const dialogs = useDialogController({ orderDetail: { ref: dialogRef } });
  const loadError = error instanceof Error ? error.message : null;

  return (
    <>
      <CustomInfiniteScroll
        dataLength={loadedOrders.length}
        endMessage={
          isFetchNextPageError ? null : (
            <ProfileOrdersEndMessage
              errorMessage={null}
              hasNextPage={hasNextPage ?? false}
              isLoading={isFetchingNextPage}
              onLoadMore={() => void fetchNextPage()}
            />
          )
        }
        error={error}
        errorFallback={({ error: nextPageError, retry }) => (
          <ProfileOrdersEndMessage
            errorMessage={nextPageError instanceof Error ? nextPageError.message : loadError}
            hasNextPage={hasNextPage ?? false}
            isLoading={false}
            onLoadMore={retry}
          />
        )}
        fetchNextPage={fetchNextPage}
        hasChildren
        hasNextPage={false}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={isFetchNextPageError}
        loader={null}
      >
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-2 tw:lg:grid-cols-3">
          {loadedOrders.map((order) => (
            <OrderItem
              key={order._id}
              onOpenDetail={(orderId) => dialogs.open('orderDetail', { orderId })}
              order={order}
            />
          ))}
        </div>
      </CustomInfiniteScroll>
      <OrderDetailDialogWrapper ref={dialogRef} />
    </>
  );
}
