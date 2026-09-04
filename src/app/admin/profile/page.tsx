import type { Metadata } from 'next';

import { AdminProfilePageContentWrapper } from './_components/admin-profile-page-content-wrapper';

export const metadata: Metadata = {
  title: 'پروفایل | پت‌شاپ',
  description: 'ویرایش اطلاعات شخصی و کلمه عبور حساب مدیریتی.',
};

export default function AdminProfilePage() {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <AdminProfilePageContentWrapper />
    </article>
  );
}
