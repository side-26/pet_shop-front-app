import type { PetTypeTableRow } from './pet-types-table.types';

export const petTypesTableSkeletonData: PetTypeTableRow[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: `skeleton-pet-type-${index + 1}`,
    title: 'عنوان نوع حیوان',
    description: 'توضیحات نوع حیوان',
    isEnabled: false,
  }),
);
