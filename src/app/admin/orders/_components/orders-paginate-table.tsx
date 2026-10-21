import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  PackageCheck,
  PackageSearch,
  Truck,
} from 'lucide-react';

import { TablePagination } from '@/components/common/table-pagination';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { OrdersRowActions } from './orders-row-actions';
import type { OrderTableRow } from './orders-table.types';

const paymentPresentation = {
  pending: { label: 'در انتظار پرداخت', color: 'warning', icon: Clock3 },
  paid: { label: 'پرداخت شده', color: 'success', icon: CheckCircle2 },
  failed: { label: 'پرداخت ناموفق', color: 'error', icon: AlertCircle },
} as const satisfies Record<
  OrderTableRow['paymentStatus'],
  { label: string; color: NonNullable<BadgeProps['color']>; icon: typeof Clock3 }
>;

const deliveryPresentation: Record<
  number,
  { label: string; color: NonNullable<BadgeProps['color']>; icon: typeof PackageSearch }
> = {
  0: { label: 'در انتظار بررسی', color: 'neutral', icon: PackageSearch },
  1: { label: 'در حال آماده‌سازی', color: 'warning', icon: PackageSearch },
  2: { label: 'ارسال شده', color: 'info', icon: Truck },
  3: { label: 'تحویل شده', color: 'success', icon: PackageCheck },
};

type OrdersPaginateTableProps = {
  orders: OrderTableRow[];
  page: number;
  pageCount: number;
  total: number;
  query?: Record<string, string>;
  isLoading?: boolean;
};

export function OrdersPaginateTable({
  orders,
  page,
  pageCount,
  total,
  query = {},
  isLoading = false,
}: OrdersPaginateTableProps) {
  return (
    <section
      aria-busy={isLoading || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isLoading && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border tw:[&>[data-slot=table-container]]:overflow-visible">
        <Table className="tw:h-full">
          <TableHeader className="tw:[&_[data-slot=table-head]]:sticky tw:[&_[data-slot=table-head]]:top-0 tw:[&_[data-slot=table-head]]:z-10 tw:[&_[data-slot=table-head]]:bg-background">
            <TableRow>
              <TableHead>
                <div>شماره سفارش</div>
              </TableHead>
              <TableHead>
                <div>کد رهگیری</div>
              </TableHead>
              <TableHead>
                <div>مشتری</div>
              </TableHead>
              <TableHead>
                <div>مبلغ کل</div>
              </TableHead>
              <TableHead>
                <div>وضعیت پرداخت</div>
              </TableHead>
              <TableHead>
                <div>وضعیت ارسال</div>
              </TableHead>
              <TableHead className="tw:w-16">
                <div>
                  <span className="tw:sr-only">عملیات</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length ? (
              orders.map((order) => {
                const payment = paymentPresentation[order.paymentStatus];
                const delivery = deliveryPresentation[order.deliveryState] ?? {
                  label: 'نامشخص',
                  color: 'neutral' as const,
                  icon: PackageSearch,
                };
                const PaymentIcon = payment.icon;
                const DeliveryIcon = delivery.icon;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="tw:font-medium">
                      <bdi dir="ltr">{order.orderNumber || '—'}</bdi>
                    </TableCell>
                    <TableCell>
                      <bdi dir="ltr">{order.trackingCode || '—'}</bdi>
                    </TableCell>
                    <TableCell className="tw:whitespace-normal">
                      <div className="tw:line-clamp-2">{order.userFullName}</div>
                    </TableCell>
                    <TableCell>
                      <Price number={order.totalPrice} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="tonal" color={payment.color}>
                        <PaymentIcon aria-hidden="true" />
                        {payment.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="tonal" color={delivery.color}>
                        <DeliveryIcon aria-hidden="true" />
                        {delivery.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <OrdersRowActions orderNumber={order.orderNumber} disabled={isLoading} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="tw:h-full tw:text-center tw:text-muted-foreground"
                >
                  —
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        basePath={routePaths.adminOrders}
        query={query}
        page={page}
        pageCount={pageCount}
        total={total}
        itemCount={orders.length}
        itemLabel="سفارش"
        limitOptions={[10, 20, 40, 100]}
        disabled={isLoading}
      />
    </section>
  );
}
