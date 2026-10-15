import type { PetDetailViewModel } from './pet-detail-data';

export const petDetailSkeleton: PetDetailViewModel = {
  id: 'pet-skeleton',
  slug: 'pet-skeleton',
  title: 'عنوان حیوان خانگی',
  summary: 'خلاصه‌ای از شرایط نگهداری و ویژگی‌های این حیوان خانگی در این بخش نمایش داده می‌شود.',
  description: {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'معرفی حیوان خانگی' }] }],
  },
  descriptionText: 'معرفی حیوان خانگی',
  petType: { id: 'pet-type-skeleton', title: 'نوع حیوان' },
  breed: { id: 'breed-skeleton', title: 'نژاد حیوان' },
  rating: 4,
  reviewCount: 12,
  price: 10_000_000,
  payablePrice: 9_000_000,
  discountPercentage: 10,
  quantity: 1,
  images: [{ alt: '' }, { alt: '' }, { alt: '' }],
  specifications: [
    { label: 'ویژگی حیوان', value: 'مقدار ویژگی' },
    { label: 'ویژگی نژاد', value: 'مقدار ویژگی' },
  ],
};
