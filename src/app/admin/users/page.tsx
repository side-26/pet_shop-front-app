import type { Metadata } from 'next';

import { UsersPageContentWrapper } from './_components/users-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت کاربران | پت‌شاپ',
  description: 'مشاهده و مدیریت کاربران پت‌شاپ',
};

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  return (
    <div className="tw:flex tw:min-h-0 tw:flex-1 tw:flex-col tw:p-4 tw:sm:p-6">
      <h2 className="tw:sr-only">فهرست کاربران</h2>
      <UsersPageContentWrapper searchParams={searchParams} />
    </div>
  );
}
