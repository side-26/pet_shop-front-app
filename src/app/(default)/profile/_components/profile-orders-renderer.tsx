import { AlertCircle, CheckCircle2, Clock3, FileText, MapPin, Package } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Price } from '@/components/ui/price';
import type { ProfileOrderDTO, ProfileOrdersPageDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

type Props = { orders: ProfileOrdersPageDTO; isSkeleton?: boolean; errorMessage?: string };

const deliveryStates: Record<
  number,
  { label: string; color: NonNullable<BadgeProps['color']>; icon: typeof Clock3 }
> = {
  0: { label: 'در انتظار بررسی', color: 'warning', icon: Clock3 },
  1: { label: 'در حال آماده‌سازی', color: 'warning', icon: Clock3 },
  2: { label: 'ارسال شده', color: 'info', icon: Package },
  3: { label: 'تحویل شده', color: 'success', icon: CheckCircle2 },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'long',
    timeZone: 'Asia/Tehran',
  }).format(new Date(value));
}

function formatAddress(order: ProfileOrderDTO) {
  const { city, detailAddress, plate, unit } = order.userAddress;
  return [city, detailAddress, `پلاک ${plate}`, unit ? `واحد ${unit}` : null]
    .filter(Boolean)
    .join('، ');
}

function OrderStatusBadge({ order }: { order: ProfileOrderDTO }) {
  const appearance = deliveryStates[order.deliveryState] ?? deliveryStates[0];
  const Icon = appearance.icon;

  return (
    <Badge variant="tonal" color={appearance.color} size="lg">
      <Icon aria-hidden="true" />
      {appearance.label}
    </Badge>
  );
}

function OrderDetailDialog({ order }: { order: ProfileOrderDTO }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button block variant="outlined" size="md" className="tw:lg:w-auto" />}
      >
        <FileText data-icon="inline-start" aria-hidden="true" />
        جزئیات سفارش
      </DialogTrigger>
      <DialogContent size="xl" className="tw:max-h-[calc(100svh-2rem)] tw:overflow-y-auto">
        <DialogHeader>
          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:pe-10">
            <DialogTitle>جزئیات سفارش</DialogTitle>
            <OrderStatusBadge order={order} />
          </div>
          <DialogDescription>
            سفارش شماره <bdi dir="ltr">{order.orderNumber}</bdi> در تاریخ{' '}
            {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>
        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-muted tw:p-4">
            <span className="tw:text-label-m tw:text-muted-foreground">مبلغ پرداخت‌شده</span>
            <strong className="tw:text-title-m tw:text-foreground">
              <Price number={order.totalPrice} />
            </strong>
          </div>
          <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-muted tw:p-4">
            <span className="tw:text-label-m tw:text-muted-foreground">تعداد کالا</span>
            <strong className="tw:text-title-m tw:text-foreground">
              {order.items.length} کالا
            </strong>
          </div>
        </div>
        <section className="tw:flex tw:flex-col tw:gap-3" aria-labelledby={`products-${order._id}`}>
          <h3 id={`products-${order._id}`} className="tw:text-title-s">
            کالاهای سفارش
          </h3>
          <ul className="tw:flex tw:flex-col tw:gap-2">
            {order.items.map((item) => (
              <li
                key={item._id}
                className="tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-border tw:bg-card tw:p-3"
              >
                <span className="tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary-muted tw:text-primary-muted-foreground">
                  <Package className="tw:size-5" aria-hidden="true" />
                </span>
                <span className="tw:text-body-m">
                  {item.title} × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="tw:flex tw:flex-col tw:gap-2" aria-labelledby={`address-${order._id}`}>
          <h3 id={`address-${order._id}`} className="tw:text-title-s">
            نشانی تحویل
          </h3>
          <p className="tw:flex tw:items-start tw:gap-2 tw:rounded-2xl tw:bg-info-muted tw:p-4 tw:text-body-m tw:text-info-muted-foreground">
            <MapPin className="tw:mt-1 tw:size-4 tw:shrink-0" aria-hidden="true" />
            {formatAddress(order)}
          </p>
        </section>
      </DialogContent>
    </Dialog>
  );
}

function OrdersSkeleton() {
  return (
    <div className="tw:grid tw:gap-4 tw:lg:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} variant="outlined" size="md">
          <CardHeader>
            <div className="tw:h-6 tw:w-36 tw:rounded tw:bg-muted" />
            <div className="tw:h-4 tw:w-24 tw:rounded tw:bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="tw:grid tw:grid-cols-2 tw:gap-3">
              <div className="tw:h-12 tw:rounded tw:bg-muted" />
              <div className="tw:h-12 tw:rounded tw:bg-muted" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="tw:ms-auto tw:h-10 tw:w-32 tw:rounded tw:bg-muted" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function ProfileOrdersRenderer({ orders, isSkeleton = false, errorMessage }: Props) {
  return (
    <section
      aria-labelledby="orders-heading"
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:flex-col tw:gap-4',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:flex tw:flex-col tw:gap-1">
        <h2 id="orders-heading" className="tw:text-title-l">
          سفارش‌های من
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          وضعیت سفارش‌ها را ببینید و جزئیات ارسال را بررسی کنید.
        </p>
      </div>
      {isSkeleton ? (
        <OrdersSkeleton />
      ) : errorMessage ? (
        <p role="alert" className="tw:flex tw:items-center tw:gap-2 tw:text-error">
          <AlertCircle aria-hidden="true" />
          دریافت سفارش‌ها ناموفق بود: {errorMessage}
        </p>
      ) : orders.result.length === 0 ? (
        <p className="tw:rounded-2xl tw:bg-muted tw:p-4 tw:text-body-m tw:text-muted-foreground">
          هنوز سفارشی ثبت نکرده‌اید.
        </p>
      ) : (
        <div className="tw:grid tw:gap-4 tw:lg:grid-cols-2">
          {orders.result.map((order) => (
            <Card key={order._id} variant="outlined" size="md">
              <CardHeader>
                <CardTitle className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                  سفارش <bdi dir="ltr">{order.orderNumber}</bdi>
                </CardTitle>
                <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                <CardAction>
                  <OrderStatusBadge order={order} />
                </CardAction>
              </CardHeader>
              <CardContent>
                <dl className="tw:grid tw:grid-cols-2 tw:gap-3">
                  <div className="tw:flex tw:flex-col tw:gap-1">
                    <dt className="tw:text-label-m tw:text-muted-foreground">مبلغ سفارش</dt>
                    <dd className="tw:text-title-s">
                      <Price number={order.totalPrice} />
                    </dd>
                  </div>
                  <div className="tw:flex tw:flex-col tw:gap-1">
                    <dt className="tw:text-label-m tw:text-muted-foreground">تعداد کالا</dt>
                    <dd className="tw:text-title-s">{order.items.length} کالا</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter className="tw:justify-end tw:border-t tw:border-border/70 tw:pt-4">
                <OrderDetailDialog order={order} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
