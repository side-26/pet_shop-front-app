import type { Metadata } from 'next';

import { OrdersHeaderActions } from './_components/orders-header-actions';
import { OrdersPageContentWrapper } from './_components/orders-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت سفارش‌ها | پت‌شاپ',
  description: 'مشاهده سفارش‌های پت‌شاپ',
};

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:overflow-hidden tw:p-3 tw:sm:p-4">
      <OrdersHeaderActions />
      <OrdersPageContentWrapper searchParams={searchParams} />
    </article>
  );
}
