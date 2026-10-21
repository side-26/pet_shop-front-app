import { Suspense } from 'react';

import { getAllOrdersPageAction } from '@/entities/orders/orders.actions';

import { OrdersPaginateTable } from './orders-paginate-table';
import { OrdersTableErrorBoundary } from './orders-table-error-boundary';
import { ordersTableSkeletonData } from './orders-table-skeleton-data';
import { OrdersTableContainer } from './orders-table-container';

type OrdersTableWrapperProps = {
  page: number;
  query: Record<string, string>;
};

export function OrdersTableWrapper({ page, query }: OrdersTableWrapperProps) {
  const ordersPromise = getAllOrdersPageAction(query);
  const suspenseKey = JSON.stringify(query);

  return (
    <Suspense
      key={suspenseKey}
      fallback={
        <OrdersPaginateTable
          orders={ordersTableSkeletonData}
          page={page}
          pageCount={1}
          total={ordersTableSkeletonData.length}
          query={query}
          isLoading
        />
      }
    >
      <OrdersTableErrorBoundary>
        <OrdersTableContainer ordersPromise={ordersPromise} query={query} />
      </OrdersTableErrorBoundary>
    </Suspense>
  );
}
