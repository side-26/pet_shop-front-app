import type { Metadata } from 'next';

import { UsersPageContentWrapper } from './_components/users-page-content-wrapper';
import { UsersHeaderActionsWrapper } from './_components/users-header-actions-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت کاربران | پت‌شاپ',
  description: 'مشاهده و مدیریت کاربران پت‌شاپ',
};

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <UsersHeaderActionsWrapper searchParams={searchParams} />
      <UsersPageContentWrapper searchParams={searchParams} />
    </article>
  );
}
