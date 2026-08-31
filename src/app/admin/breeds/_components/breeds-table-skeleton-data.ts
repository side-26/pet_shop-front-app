import type { BreedTableRow } from './breeds-table.types';

export const breedsTableSkeletonData: BreedTableRow[] = Array.from({ length: 5 }, (_, index) => ({
  id: `skeleton-breed-${index + 1}`,
  title: 'عنوان نژاد حیوان',
  petTypeTitle: 'نوع حیوان',
  country: 'کشور مبدأ',
  ageAverage: '۱۰ تا ۱۲ سال',
  size: 'متوسط',
  activityLevel: 'متوسط',
  mainImage: '',
  thumbnailImage: '',
  isEnabled: false,
}));
