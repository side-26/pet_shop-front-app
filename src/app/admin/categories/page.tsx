import type { Metadata } from 'next';

import { CategoriesHeaderActionsWrapper } from './_components/categories-header-actions-wrapper';
import { CategoriesPageContentWrapper } from './_components/categories-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت دسته‌بندی‌ها | پت‌شاپ',
  description: 'مشاهده و مدیریت دسته‌بندی‌های پت‌شاپ',
};

export default function AdminCategoriesPage() {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <CategoriesHeaderActionsWrapper />
      <CategoriesPageContentWrapper />
    </article>
  );
}
