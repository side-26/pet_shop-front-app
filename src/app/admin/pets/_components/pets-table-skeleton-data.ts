import type { PetTableRow } from './pets-table.types';

export const petsTableSkeletonData: PetTableRow[] = Array.from({ length: 5 }, (_, index) => ({
  id: `skeleton-pet-${index + 1}`,
  mainImage: '',
  mainImageThumbnail: '',
  title: 'عنوان حیوان',
  petType: 'نوع حیوان',
  breed: 'نژاد حیوان',
  summary: 'خلاصه‌ای کوتاه درباره حیوان برای نمایش در جدول مدیریت',
  quantity: 0,
  isEnable: false,
}));
