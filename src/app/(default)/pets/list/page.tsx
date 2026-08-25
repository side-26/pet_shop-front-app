import type { Metadata } from 'next';

import { PetListContent } from './_components/pet-list-content';

export const metadata: Metadata = {
  title: 'فهرست حیوانات خانگی | پناهگاه پرشین',
  description: 'مشاهده و انتخاب حیوانات خانگی سالم و دوست‌داشتنی برای پیوستن به خانواده شما.',
};

export default function PetListPage() {
  return <PetListContent />;
}
