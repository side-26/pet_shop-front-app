import type { Metadata } from 'next';

import { ProductsHeaderActionsWrapper } from './_components/products-header-actions-wrapper';
import { ProductsPageContentWrapper } from './_components/products-page-content-wrapper';

export const metadata: Metadata = {
  title: 'مدیریت محصولات | پت‌شاپ',
  description: 'مشاهده و مدیریت محصولات پت‌شاپ',
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function AdminProductsPage({ searchParams }: Props) {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <ProductsHeaderActionsWrapper searchParams={searchParams} />
      <ProductsPageContentWrapper searchParams={searchParams} />
    </article>
  );
}
