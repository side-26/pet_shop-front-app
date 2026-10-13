import type { Metadata } from 'next';

import type { PaginationSearchParams } from '@/entities/pagination/pagination.helpers';

import { ArticlesCatalogSection } from './_components/articles-catalog/articles-catalog-section';

export const metadata: Metadata = {
  title: 'مقالات | پت‌شاپ پرشین',
  description: 'راهنماهای کاربردی و خواندنی برای مراقبت بهتر از حیوانات خانگی.',
};

// The catalog is request-rendered while its static shell and Suspense fallback prerender.
export const instant = false;

type ArticlesPageProps = Readonly<{ searchParams?: Promise<PaginationSearchParams> }>;

export default function ArticlesPage({
  searchParams = Promise.resolve({}),
}: ArticlesPageProps = {}) {
  return (
    <main className="tw:default-layout-container tw:py-10 tw:sm:py-14 tw:lg:py-20">
      <header className="tw:mx-auto tw:max-w-3xl tw:text-center">
        <p className="tw:text-label-l tw:text-primary">مجله پت‌شاپ پرشین</p>
        <h1 className="tw:mt-5 tw:text-heading-1 tw:text-balance tw:sm:text-display-l">
          برای زندگی بهتر کنار دوست پشمالوی شما
        </h1>
        <p className="tw:mt-4 tw:max-w-2xl tw:text-body-m tw:leading-8 tw:text-muted-foreground tw:sm:text-body-l">
          راهنماهای دقیق و کاربردی درباره مراقبت، تغذیه و حال خوب حیوانات خانگی را اینجا بخوانید.
        </p>
      </header>

      <ArticlesCatalogSection searchParams={searchParams} />
    </main>
  );
}
