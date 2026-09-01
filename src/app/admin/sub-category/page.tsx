import type { Metadata } from 'next';

import { SubCategoriesHeaderActionsWrapper } from './_components/sub-categories-header-actions-wrapper';
import { SubCategoriesPageContentWrapper } from './_components/sub-categories-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت زیر دسته‌بندی‌ها | پت‌شاپ',
  description: 'مشاهده و مدیریت زیر دسته‌بندی‌های پت‌شاپ',
};

export default function AdminSubCategoriesPage() {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <SubCategoriesHeaderActionsWrapper />
      <SubCategoriesPageContentWrapper />
    </article>
  );
}
