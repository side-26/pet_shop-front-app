import { Suspense } from 'react';

import { OrdersPaginateTable } from './orders-paginate-table';
import {
  getOrdersRequestedPage,
  toOrdersQuery,
  type OrdersSearchParams,
} from './orders-query.helpers';
import { ordersTableSkeletonData } from './orders-table-skeleton-data';
import { OrdersTableWrapper } from './orders-table-wrapper';

type OrdersPageContentWrapperProps = { searchParams: Promise<OrdersSearchParams> };

async function OrdersPageContent({ searchParams }: OrdersPageContentWrapperProps) {
  const query = toOrdersQuery(await searchParams);
  return <OrdersTableWrapper page={getOrdersRequestedPage(query)} query={query} />;
}

export function OrdersPageContentWrapper(props: OrdersPageContentWrapperProps) {
  return (
    <Suspense
      fallback={
        <OrdersPaginateTable
          orders={ordersTableSkeletonData}
          page={1}
          pageCount={1}
          total={ordersTableSkeletonData.length}
          query={{}}
          isLoading
        />
      }
    >
      <OrdersPageContent {...props} />
    </Suspense>
  );
}
