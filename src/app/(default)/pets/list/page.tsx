import type { Metadata } from 'next';

import type { PaginationSearchParams } from '@/entities/pagination/pagination.helpers';

import { PetListContent } from './_components/pet-list-content';

export const metadata: Metadata = {
  title: 'فهرست حیوانات خانگی | پت شاپ پرشین',
  description: 'مشاهده و انتخاب حیوانات خانگی سالم و دوست‌داشتنی برای پیوستن به خانواده شما.',
};

type PetListPageProps = Readonly<{ searchParams?: Promise<PaginationSearchParams> }>;

export default function PetListPage({ searchParams = Promise.resolve({}) }: PetListPageProps = {}) {
  return <PetListContent searchParams={searchParams} />;
}
