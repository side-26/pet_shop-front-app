import type {
  PetTypeIdInput,
  PetTypeInput,
  PetTypeQueryInput,
  RangePetTypePropertyDefinitionsInput,
  UpdatePetTypeInput,
} from './pet-types.schema';
import type { RichTextFormValue } from '@/lib/rich-text';

export type PetTypePropertyDefinitionDTO = {
  key: string;
  label: string;
  valueType: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  defaultValue?: unknown;
};
export type PetTypeDTO = {
  id: string;
  title: string;
  description: RichTextFormValue;
  mainImage: string;
  thumbnail: string;
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
export type RangePetTypePropertyDefinitionsDTO = RangePetTypePropertyDefinitionsInput;
export type PetTypePropertyDefinitionsResultDTO = {
  result: Array<{ label: string; value: string | number }>;
};
