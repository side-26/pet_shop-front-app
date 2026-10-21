import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { OrdersPaginatedDTO } from '@/entities/orders/orders.dto';
import { transform } from '@/lib/transform';

import { OrdersPaginateTable } from './orders-paginate-table';
import { OrdersTableEmpty } from './orders-table-empty';
import { OrdersTableViewModel } from './orders-table.types';

type OrdersTableContainerProps = {
  ordersPromise: Promise<OrdersPaginatedDTO>;
  query: Record<string, string>;
};

export function OrdersTableContainer({ ordersPromise, query }: OrdersTableContainerProps) {
  const viewModel = transform(OrdersTableViewModel, use(ordersPromise));

  return (
    <EmptyStateBoundary data={viewModel.orders} fallback={<OrdersTableEmpty />}>
      <OrdersPaginateTable {...viewModel} query={query} />
    </EmptyStateBoundary>
  );
}
