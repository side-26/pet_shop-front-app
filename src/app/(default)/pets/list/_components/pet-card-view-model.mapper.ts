import type { LandingPetListCardDTO, LandingPetListItemDTO } from '@/entities/landing/landing.dto';
import type { CustomerPetDetailDTO, CustomerPetListItemDTO } from '@/entities/pets/pets.dto';

import type { PetCardViewModel } from './pet-card.types';

type PetCardSource =
  CustomerPetDetailDTO | CustomerPetListItemDTO | LandingPetListItemDTO | LandingPetListCardDTO;

type PetRelation = PetCardSource['breed'] | PetCardSource['petType'];

function relationTitle(relation: PetRelation) {
  if (!relation) return '—';

  return typeof relation === 'string' ? relation : relation.title;
}

export function toPetCardViewModel(pet: PetCardSource): PetCardViewModel {
  return {
    available: pet.inEnable && pet.quantity > 0,
    breed: relationTitle(pet.breed),
    discountPercentage: pet.discountPercentage,
    id: pet.id,
    image: pet.mainImage,
    imageThumbnail: pet.mainImageThumbnail,
    petType: relationTitle(pet.petType),
    price: pet.price,
    slug: pet.slug,
    title: pet.title,
  };
}
