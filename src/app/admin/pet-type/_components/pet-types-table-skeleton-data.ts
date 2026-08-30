import type { PetTypeTableRow } from './pet-types-table.types';

const SKELETON_THUMBNAIL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';

export const petTypesTableSkeletonData: PetTypeTableRow[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `skeleton-pet-type-${index + 1}`,
    title: 'عنوان نوع حیوان',
    description: 'توضیحات نوع حیوان',
    mainImage: SKELETON_THUMBNAIL,
    thumbnail: SKELETON_THUMBNAIL,
    isEnabled: false,
  }),
);
