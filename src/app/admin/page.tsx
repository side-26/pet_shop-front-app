import type { Metadata } from 'next';

import { DashboardHeaderActionsWrapper } from './_components/dashboard-header-actions-wrapper';
import { DashboardPageContentWrapper } from './_components/dashboard-page-content-wrapper';

export const metadata: Metadata = {
  title: 'داشبورد مدیریت | پت‌شاپ',
  description: 'مرور فروش، موجودی و سفارش‌های اخیر پت‌شاپ.',
};

type AdminDashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:overflow-hidden tw:p-3 tw:sm:p-4">
      <DashboardHeaderActionsWrapper searchParams={searchParams} />
      <DashboardPageContentWrapper searchParams={searchParams} />
    </article>
  );
}
