import type { ProfileOrdersPageDTO } from '@/entities/profile/profile.dto';

import { ProfileOrdersInfiniteList } from './profile-orders-infinite-list';

export function ProfileOrdersResolved({ orders }: Readonly<{ orders: ProfileOrdersPageDTO }>) {
  return (
    <section aria-labelledby="orders-heading" className="tw:flex tw:flex-col tw:gap-4">
      <div className="tw:flex tw:flex-col tw:gap-1">
        <h2 id="orders-heading" className="tw:text-title-l">
          سفارش‌های من
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          وضعیت سفارش‌ها را ببینید و جزئیات ارسال را بررسی کنید.
        </p>
      </div>
      <ProfileOrdersInfiniteList initialPage={orders} />
    </section>
  );
}
