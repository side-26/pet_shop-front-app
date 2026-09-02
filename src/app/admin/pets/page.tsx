import type { Metadata } from 'next';

import { PetsHeaderActionsWrapper } from './_components/pets-header-actions-wrapper';
import { PetsPageContentWrapper } from './_components/pets-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت حیوانات | پت‌شاپ',
  description: 'مشاهده و مدیریت حیوانات پت‌شاپ',
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function AdminPetsPage({ searchParams }: Props) {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <PetsHeaderActionsWrapper searchParams={searchParams} />
      <PetsPageContentWrapper searchParams={searchParams} />
    </article>
  );
}
