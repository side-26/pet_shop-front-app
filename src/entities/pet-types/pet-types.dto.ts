import type {
  PetTypeIdInput,
  PetTypeInput,
  PetTypeQueryInput,
  UpdatePetTypeInput,
} from './pet-types.schema';

export type PetTypePropertyDefinitionDTO = {
  key: string;
  label: string;
  valueType: string;
  required: boolean;
};
export type PetTypeDTO = {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
  propertyDefinitions: PetTypePropertyDefinitionDTO[];
  slug: string;
  createdAt: string;
  updatedAt: string;
};
export type PetTypeQueryDTO = PetTypeQueryInput;
export type PetTypeIdDTO = PetTypeIdInput;
export type CreatePetTypeDTO = PetTypeInput;
export type UpdatePetTypeDTO = UpdatePetTypeInput;
