import type { PetTypeDTO } from '@/entities/pet-types/pet-types.dto';

import type { PetTypeTableRow } from './pet-types-table.types';

export function mapPetTypesTableRows(petTypes: PetTypeDTO[]): PetTypeTableRow[] {
  return petTypes.map((petType) => ({
    id: petType.id,
    title: petType.title,
    description: petType.description,
    mainImage: petType.mainImage,
    thumbnail: petType.thumbnail,
    isEnabled: petType.isEnabled,
  }));
}
