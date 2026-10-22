'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import type { ReactNode } from 'react';

import { FetchErrorSection } from '@/components/common/fetch-error-section';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { Price } from '@/components/ui/price';
import { useOrderDetailQuery } from '@/entities/orders/orders.client';
import { cn } from '@/lib/utils';

import { useOrdersDetailDialogParams } from './orders-detail-dialog-context';
import { orderDetailDialogSkeletonData } from './orders-detail-dialog-skeleton-data';

export type OrderDetailDialogViewModel = Readonly<{
  orderNumber: string;
  trackingCode: string;
  totalPrice: number;
  paymentStatus: string;
  items: readonly Readonly<{
    _id: string;
    title: string;
    quantity: number;
  }>[];
}>;

export function OrdersDetailDialogContent() {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <main className="tw:min-h-0 tw:flex-auto tw:overflow-auto">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorStateBoundary
            key={retryKey}
            fallbackRender={({ error, retry }) => (
              <FetchErrorSection
                title="جزئیات سفارش در دسترس نیست"
                description={
                  error instanceof Error ? error.message : 'دریافت جزئیات سفارش ناموفق بود.'
                }
                onRetry={() => {
                  reset();
                  setRetryKey((key) => key + 1);
                  retry();
                }}
              />
            )}
          >
            <Suspense
              fallback={
                <OrdersDetailDialogMainContent order={orderDetailDialogSkeletonData} isSkeleton />
              }
            >
              <OrdersDetailDialogRenderer />
            </Suspense>
          </ErrorStateBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}

function OrdersDetailDialogRenderer() {
  const { orderId } = useOrdersDetailDialogParams();
  const { data: order } = useOrderDetailQuery(orderId);

  return <OrdersDetailDialogMainContent order={order} />;
}

export function OrdersDetailDialogMainContent({
  order,
  isSkeleton = false,
}: Readonly<{
  order: OrderDetailDialogViewModel;
  isSkeleton?: boolean;
}>) {
  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:flex-col tw:gap-5 tw:p-6',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
        <Detail label="شماره سفارش" value={order.orderNumber} ltr />
        <Detail label="کد رهگیری" value={order.trackingCode || '—'} ltr />
        <Detail label="مبلغ کل" value={<Price number={order.totalPrice} />} />
        <Detail label="وضعیت پرداخت" value={order.paymentStatus} />
      </div>
      <section className="tw:flex tw:flex-col tw:gap-3" aria-labelledby="order-items">
        <h3 id="order-items" className="tw:text-title-s">
          اقلام سفارش
        </h3>
        <ul className="tw:flex tw:flex-col tw:gap-2">
          {order.items.map((item) => (
            <li key={item._id} className="tw:rounded-2xl tw:bg-muted tw:p-3">
              {item.title} × {item.quantity}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Detail({
  label,
  value,
  ltr = false,
}: Readonly<{ label: string; value: ReactNode; ltr?: boolean }>) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-muted tw:p-4">
      <span className="tw:text-label-m tw:text-muted-foreground">{label}</span>
      <strong className="tw:text-body-m">{ltr ? <bdi dir="ltr">{value}</bdi> : value}</strong>
    </div>
  );
}
