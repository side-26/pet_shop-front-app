import { MapPin, Package } from 'lucide-react';

import { Price } from '@/components/ui/price';
import type { ProfileOrderDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

import type { OrderItemDTO } from '@/entities/orders/orders.dto';

import { OrderPaymentStatusBadge } from './order-payment-status-badge';

type Props = Readonly<{ order?: ProfileOrderDTO; isSkeleton?: boolean }>;

function OrderProductItem({ item }: Readonly<{ item: OrderItemDTO }>) {
  return (
    <li className="tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-border tw:bg-card tw:p-3">
      <span className="tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary-muted tw:text-primary-muted-foreground">
        <Package className="tw:size-5" aria-hidden="true" />
      </span>
      <span className="tw:text-body-m">
        {item.title} × {item.quantity}
      </span>
    </li>
  );
}

function formatAddress(order: ProfileOrderDTO) {
  const { city, detailAddress, plate, unit } = order.userAddress;
  return [city, detailAddress, `پلاک ${plate}`, unit ? `واحد ${unit}` : null]
    .filter(Boolean)
    .join('، ');
}

export function OrderDetailDialogContentRenderer({ order, isSkeleton = false }: Props) {
  const displayOrder = order;
  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:flex-col tw:gap-5 tw:p-6',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {displayOrder ? (
        <OrderPaymentStatusBadge order={displayOrder} />
      ) : (
        <div className="tw:h-8 tw:w-32 tw:rounded tw:bg-muted" />
      )}
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
        <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-muted tw:p-4">
          <span className="tw:text-label-m tw:text-muted-foreground">مبلغ پرداخت‌شده</span>
          <strong className="tw:text-title-m tw:text-foreground">
            {displayOrder ? (
              <Price number={displayOrder.totalPrice} />
            ) : (
              <span className="tw:block tw:h-7 tw:w-28 tw:rounded tw:bg-muted-foreground/20" />
            )}
          </strong>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-muted tw:p-4">
          <span className="tw:text-label-m tw:text-muted-foreground">تعداد کالا</span>
          <strong className="tw:text-title-m tw:text-foreground">
            {displayOrder ? (
              `${displayOrder.items.length} کالا`
            ) : (
              <span className="tw:block tw:h-7 tw:w-16 tw:rounded tw:bg-muted-foreground/20" />
            )}
          </strong>
        </div>
      </div>
      <section className="tw:flex tw:flex-col tw:gap-3" aria-labelledby="order-products">
        <h3 id="order-products" className="tw:text-title-s">
          کالاهای سفارش
        </h3>
        <ul className="tw:flex tw:flex-col tw:gap-2">
          {displayOrder ? (
            displayOrder.items.map((item) => <OrderProductItem key={item._id} item={item} />)
          ) : (
            <li className="tw:h-16 tw:rounded-2xl tw:bg-muted" />
          )}
        </ul>
      </section>
      <section className="tw:flex tw:flex-col tw:gap-2" aria-labelledby="order-address">
        <h3 id="order-address" className="tw:text-title-s">
          نشانی تحویل
        </h3>
        {displayOrder ? (
          <p className="tw:flex tw:items-start tw:gap-2 tw:rounded-2xl tw:bg-info-muted tw:p-4 tw:text-body-m tw:text-info-muted-foreground">
            <MapPin className="tw:mt-1 tw:size-4 tw:shrink-0" aria-hidden="true" />
            {formatAddress(displayOrder)}
          </p>
        ) : (
          <div className="tw:h-20 tw:rounded-2xl tw:bg-muted" />
        )}
      </section>
    </div>
  );
}
