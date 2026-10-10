import type { Metadata } from 'next';

import { ArticlesDialogProviderWrapper } from './_components/articles-dialog-provider-wrapper';
import { ArticlesHeaderActions } from './_components/articles-header-actions';
import { ArticlesPageContentWrapper } from './_components/articles-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت مقاله‌ها | پت‌شاپ',
  description: 'مشاهده و مدیریت مقاله‌های ایجادشده در پت‌شاپ',
};

export default function AdminArticlesPage() {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:overflow-hidden tw:p-3 tw:sm:p-4">
      <ArticlesDialogProviderWrapper>
        <ArticlesHeaderActions />
        <ArticlesPageContentWrapper />
      </ArticlesDialogProviderWrapper>
    </article>
  );
}
