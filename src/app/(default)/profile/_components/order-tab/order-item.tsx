import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import type { ProfileOrderDTO } from '@/entities/profile/profile.dto';

import { OrderPaymentStatusBadge } from './order-payment-status-badge';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'long',
    timeZone: 'Asia/Tehran',
  }).format(new Date(value));
}

export function OrderItem({
  order,
  onOpenDetail,
}: Readonly<{ onOpenDetail: (orderId: string) => void; order: ProfileOrderDTO }>) {
  return (
    <Card variant="outlined" size="sm">
      <CardHeader>
        <CardTitle className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
          سفارش <bdi dir="ltr">{order.orderNumber}</bdi>
        </CardTitle>
        <CardDescription>{formatDate(order.createdAt)}</CardDescription>
        <CardAction>
          <OrderPaymentStatusBadge order={order} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="tw:grid tw:grid-cols-3 tw:gap-3">
          <div className="tw:flex tw:flex-col tw:gap-1">
            <dt className="tw:text-label-s tw:text-muted-foreground tw:lg:text-label-m">
              کد رهگیری
            </dt>
            <dd className="tw:text-label-l tw:lg:text-title-s">
              {order.trackingCode ? <bdi dir="ltr">{order.trackingCode}</bdi> : '—'}
            </dd>
          </div>
          <div className="tw:flex tw:flex-col tw:gap-1">
            <dt className="tw:text-label-s tw:text-muted-foreground tw:lg:text-label-m">
              مبلغ سفارش
            </dt>
            <dd className="tw:text-label-l tw:lg:text-title-s">
              <Price number={order.totalPrice} />
            </dd>
          </div>
          <div className="tw:flex tw:flex-col tw:items-center tw:gap-1 tw:text-center tw:lg:items-start tw:lg:text-start">
            <dt className="tw:text-label-s tw:text-muted-foreground tw:lg:text-label-m">
              تعداد کالا
            </dt>
            <dd className="tw:text-label-l tw:lg:text-title-s">{order.items.length} کالا</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="tw:justify-end tw:border-t tw:border-border/70 tw:pt-4">
        <Button
          block
          className="tw:lg:w-auto"
          onClick={() => onOpenDetail(order._id)}
          size="md"
          type="button"
          variant="outlined"
        >
          <FileText data-icon="inline-start" aria-hidden="true" />
          جزئیات سفارش
        </Button>
      </CardFooter>
    </Card>
  );
}
