import type { ManagementPetsPageDTO, PetRelationDTO } from '@/entities/pets/pets.dto';

import type { PetsPageViewModel } from './pets-table.types';

function relationTitle(relation: PetRelationDTO | string) {
  return typeof relation === 'string' ? relation : relation.title;
}

export function mapPetsPageViewModel(data: ManagementPetsPageDTO): PetsPageViewModel {
  const pets = data.result.map((pet) => ({
    id: pet.id,
    mainImage: pet.mainImage,
    mainImageThumbnail: pet.mainImageThumbnail,
    title: pet.title,
    petType: relationTitle(pet.petType),
    breed: relationTitle(pet.breed),
    summary: pet.summary?.trim() || '_',
    quantity: pet.quantity,
    isEnable: pet.inEnable,
  }));
  const total = Number(data.pagination.totalItems);
  return {
    pets,
    page: Math.max(1, data.pagination.currentPage),
    pageCount: Math.max(1, data.pagination.totalPages),
    total: Number.isFinite(total) && total >= 0 ? total : pets.length,
  };
}
