import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  CreatePetTypeDTO,
  PetTypeDTO,
  PetTypeIdDTO,
  PetTypePropertyDefinitionsResultDTO,
  PetTypeQueryDTO,
  RangePetTypePropertyDefinitionsDTO,
  UpdatePetTypeDTO,
} from './pet-types.dto';
import { petTypeQuerySchema } from './pet-types.schema';

const petTypesCache = new EntityTag('pet-types');

export async function getAllPetTypesForBreed() {
  'use cache';

  petTypesCache.registerList('all');
  return customFetcher<PetTypeDTO[]>({
    url: '/pet-types',
    method: 'GET',
    auth: false,
    cache: 'force-cache',
    next: { tags: [petTypesCache.list] },
  });
}

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

export async function getPetTypePropertyDefinitions(id: PetTypeIdDTO['id']) {
  'use cache: private';
  petTypesCache.cacheLife({ stale: 600 });
  petTypesCache.registerDetail(id);
  return customFetcher<PetTypePropertyDefinitionsResultDTO>({
    url: `/pet-types/property-definitions/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

function invalidate(id?: string) {
  petTypesCache.invalidateList();
  if (id) petTypesCache.invalidateDetail(id);
}

function toPetTypeFormData(input: CreatePetTypeDTO | UpdatePetTypeDTO) {
  const formData = new FormData();
  formData.set('title', input.title);
  formData.set('description', input.description ?? '');
  formData.set('mainImage', input.mainImage);

  return formData;
}
export async function createPetType(input: CreatePetTypeDTO) {
  const result = await customFetcher<PetTypeDTO, unknown, FormData>({
    url: '/pet-types',
    method: 'POST',
    body: toPetTypeFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate();
  return result;
}
export async function updatePetType(id: string, input: UpdatePetTypeDTO) {
  const result = await customFetcher<PetTypeDTO, unknown, FormData>({
    url: `/pet-types/${id}`,
    method: 'PUT',
    body: toPetTypeFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
export async function rangePetTypePropertyDefinitions(input: RangePetTypePropertyDefinitionsDTO) {
  const result = await customFetcher<
    PetTypePropertyDefinitionsResultDTO,
    unknown,
    RangePetTypePropertyDefinitionsDTO
  >({
    url: '/pet-types/range',
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(input.id);
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
