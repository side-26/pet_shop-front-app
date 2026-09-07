import type { Metadata } from 'next';

import { DashboardContentWrapper } from './_components/dashboard-content-wrapper';

export const metadata: Metadata = {
  title: 'داشبورد مدیریت | پت‌شاپ',
  description: 'مرور فروش، موجودی و سفارش‌های اخیر پت‌شاپ.',
};

export default function AdminDashboardPage() {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <DashboardContentWrapper />
    </article>
  );
}
