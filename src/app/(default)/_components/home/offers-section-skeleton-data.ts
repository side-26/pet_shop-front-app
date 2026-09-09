import type { OffersProductViewModel } from './offers-section.types';

const skeletonTitles = [
  'پیشنهاد اول',
  'پیشنهاد دوم',
  'پیشنهاد سوم',
  'پیشنهاد چهارم',
  'پیشنهاد پنجم',
];

export const offersSectionSkeletonData: OffersProductViewModel[] = skeletonTitles.map(
  (title, index) => ({
    id: `skeleton-offer-${index}`,
    title,
    mainImage: '',
    summary: 'در حال دریافت پیشنهادهای شگفت‌انگیز',
    price: 0,
    discountPercentage: 0,
    discountPrice: 0,
  }),
);
