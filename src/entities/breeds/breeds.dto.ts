import type { PaginateDataDTO } from '@/lib/api/pagination.dto';
import type {
  BreedInput,
  BreedQueryInput,
  BreedPropertyDefinitionsInput,
  UpdateBreedInput,
} from './breeds.schema';

export type BreedPropertyDefinitionDTO = {
  label: string;
  value: unknown;
};

export type BreedDTO = {
  id: string;
  title: string;
  petType: string;
  petTypeTitle?: string;
  country: string | null;
  ageAverage: string;
  size: number;
  activityLevel: number | null;
  propertyDefinitions: BreedPropertyDefinitionDTO[];
  mainImage: string;
  thumbnailImage: string;
  enable: boolean;
  createdAt: string;
  updatedAt: string;
};
export type BreedsPageDTO = PaginateDataDTO<BreedDTO>;
export type CreateBreedDTO = BreedInput;
export type UpdateBreedDTO = UpdateBreedInput;
export type BreedQueryDTO = BreedQueryInput;
export type BreedPropertyDefinitionsResultDTO = { result: BreedPropertyDefinitionDTO[] };
export type ReplaceBreedPropertyDefinitionsDTO = BreedPropertyDefinitionsInput;
