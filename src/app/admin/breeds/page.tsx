import type { Metadata } from 'next';

import { BreedsHeaderActionsWrapper } from './_components/breeds-header-actions-wrapper';
import { BreedsPageContentWrapper } from './_components/breeds-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت نژادها | پت‌شاپ',
  description: 'مشاهده و مدیریت نژادهای پت‌شاپ',
};

export type BreedsSearchParams = Record<string, string | string[] | undefined>;

type AdminBreedsPageProps = {
  searchParams: Promise<BreedsSearchParams>;
};

export default function AdminBreedsPage({ searchParams }: AdminBreedsPageProps) {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <BreedsHeaderActionsWrapper searchParams={searchParams} />
      <BreedsPageContentWrapper searchParams={searchParams} />
    </article>
  );
}
