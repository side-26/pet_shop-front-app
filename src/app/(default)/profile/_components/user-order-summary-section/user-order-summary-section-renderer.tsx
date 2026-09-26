import { CalendarDays, CircleCheck, PackageCheck } from 'lucide-react';

import type { ProfileOrderSummaryDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  summary: ProfileOrderSummaryDTO;
  isSkeleton?: boolean;
}>;

function formatLastPurchase(value: string | null | undefined) {
  if (!value || Number.isNaN(Date.parse(value))) return '—';

  return new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long' }).format(
    new Date(value),
  );
}

export function UserOrderSummarySectionRenderer({ summary, isSkeleton = false }: Props) {
  return (
    <section
      aria-busy={isSkeleton || undefined}
      aria-labelledby="user-order-summary-title"
      className={cn(
        'tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:grid-cols-3 tw:md:min-w-[360px]',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <h2 id="user-order-summary-title" className="tw:sr-only">
        خلاصه سفارش‌های من
      </h2>
      <dl className="tw:contents">
        <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-primary-muted tw:p-4">
          <dt className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-m tw:text-primary-muted-foreground">
            <PackageCheck className="tw:size-4" aria-hidden="true" />
            سفارش‌ها
          </dt>
          <dd className="tw:text-title-l tw:text-primary-muted-foreground">
            {isSkeleton ? '—' : summary.orders.toLocaleString('fa-IR')}
          </dd>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-success-muted tw:p-4">
          <dt className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-m tw:text-success-muted-foreground">
            <CircleCheck className="tw:size-4" aria-hidden="true" />
            تحویل‌شده
          </dt>
          <dd className="tw:text-title-l tw:text-success-muted-foreground">
            {isSkeleton ? '—' : summary.delivered.toLocaleString('fa-IR')}
          </dd>
        </div>
        <div className="tw:col-span-2 tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-info-muted tw:p-4 tw:sm:col-span-1">
          <dt className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-m tw:text-info-muted-foreground">
            <CalendarDays className="tw:size-4" aria-hidden="true" />
            آخرین خرید
          </dt>
          <dd className="tw:text-title-s tw:text-info-muted-foreground">
            {isSkeleton ? '—' : formatLastPurchase(summary.lastPurchase)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
