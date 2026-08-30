import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  CreatePetTypeDTO,
  PetTypeDTO,
  PetTypeIdDTO,
  PetTypeQueryDTO,
  UpdatePetTypeDTO,
} from './pet-types.dto';
import { petTypeQuerySchema } from './pet-types.schema';

const petTypesCache = new EntityTag('pet-types');

export async function getAllPetTypes(input: Partial<PetTypeQueryDTO> = {}) {
  const query = await petTypeQuerySchema.validate(input, { stripUnknown: true });
  return fetchAllPetTypes(query);
}

async function fetchAllPetTypes(query: PetTypeQueryDTO) {
  'use cache: private';
  petTypesCache.cacheLife({ stale: 600 });
  petTypesCache.registerList(`includeDisabled=${query.includeDisabled}`);
  return customFetcher<PetTypeDTO[]>({
    url: '/pet-types',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getPetTypeById(id: PetTypeIdDTO['id']) {
  'use cache: private';
  petTypesCache.cacheLife({ stale: 600 });
  petTypesCache.registerDetail(id);
  return customFetcher<PetTypeDTO>({
    url: `/pet-types/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

function invalidate(id?: string) {
  petTypesCache.invalidateList();
  if (id) petTypesCache.invalidateDetail(id);
}
export async function createPetType(input: CreatePetTypeDTO) {
  const result = await customFetcher<PetTypeDTO, unknown, CreatePetTypeDTO>({
    url: '/pet-types',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate();
  return result;
}
export async function updatePetType(id: string, input: UpdatePetTypeDTO) {
  const result = await customFetcher<PetTypeDTO, unknown, UpdatePetTypeDTO>({
    url: `/pet-types/${id}`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
export async function enablePetType(id: string) {
  const result = await customFetcher<PetTypeDTO, unknown, undefined>({
    url: `/pet-types/${id}/enable`,
    method: 'PATCH',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
export async function disablePetType(id: string) {
  const result = await customFetcher<PetTypeDTO, unknown, undefined>({
    url: `/pet-types/${id}/disable`,
    method: 'PATCH',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
export async function deletePetType(id: string) {
  const result = await customFetcher<{ id: string }>({
    url: `/pet-types/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
