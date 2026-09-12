import type { Metadata } from 'next';

import type { PaginationSearchParams } from '@/entities/pagination/pagination.helpers';

import { ProductListContent } from './_components/product-list-content';

export const metadata: Metadata = {
  title: 'فهرست محصولات حیوانات خانگی | پت شاپ پرشین',
  description: 'خرید محصولات منتخب تغذیه، بازی و مراقبت سگ و گربه.',
};

type ProductListPageProps = Readonly<{ searchParams?: Promise<PaginationSearchParams> }>;

export default function ProductListPage({
  searchParams = Promise.resolve({}),
}: ProductListPageProps = {}) {
  return <ProductListContent searchParams={searchParams} />;
}
