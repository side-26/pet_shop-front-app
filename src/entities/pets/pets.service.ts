import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  CreatePetDTO,
  CustomerPetDetailDTO,
  CustomerPetDetailsPageDTO,
  CustomerPetPaginateQueryDTO,
  CustomerPetQueryDTO,
  CustomerPetsPageDTO,
  DeletePetResultDTO,
  ManagementPetDTO,
  ManagementPetQueryDTO,
  ManagementPetsPageDTO,
  PetBaseInfoDTO,
  PetImagesDTO,
  PetPriceDTO,
  UpdatePetBaseInfoDTO,
  UpdatePetImagesDTO,
  UpdatePetPriceDTO,
} from './pets.dto';
import {
  customerPetPaginateQuerySchema,
  customerPetQuerySchema,
  managementPetQuerySchema,
} from './pets.schema';

const petsCache = new EntityTag('pets');

function queryKey(
  query: CustomerPetQueryDTO | CustomerPetPaginateQueryDTO | ManagementPetQueryDTO,
) {
  return new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, value]) => [name, String(value)]),
  ).toString();
}

export async function getCustomerPetsPage(input: Partial<CustomerPetPaginateQueryDTO> = {}) {
  const query = await customerPetPaginateQuerySchema.validate(input, { stripUnknown: true });
  return fetchCustomerPetsPage(query);
}

async function fetchCustomerPetsPage(query: CustomerPetPaginateQueryDTO) {
  'use cache';

  petsCache.cacheLife({ stale: 600 });
  petsCache.registerList(`customer-page:${queryKey(query)}`);
  return customFetcher<CustomerPetDetailsPageDTO>({
    url: '/pets/customer/paginate',
    method: 'GET',
    query,
    auth: false,
    cache: 'force-cache',
    next: { tags: [petsCache.list] },
  });
}

export async function getCustomerPets(input: Partial<CustomerPetQueryDTO> = {}) {
  const query = await customerPetQuerySchema.validate(input, { stripUnknown: true });
  return fetchCustomerPets(query);
}

async function fetchCustomerPets(query: CustomerPetQueryDTO) {
  'use cache';

  petsCache.cacheLife({ stale: 600 });
  petsCache.registerList(`customer:${queryKey(query)}`);
  return customFetcher<CustomerPetsPageDTO>({
    url: '/pets',
    method: 'GET',
    query,
    auth: false,
    cache: 'force-cache',
    next: { tags: [petsCache.list] },
  });
}

export async function getCustomerPet(id: string) {
  'use cache';

  petsCache.cacheLife({ stale: 600 });
  petsCache.registerDetail(id);
  return customFetcher<CustomerPetDetailDTO>({
    url: `/pets/customer/${id}`,
    method: 'GET',
    auth: false,
    cache: 'force-cache',
    next: { tags: [petsCache.detail(id)] },
  });
}

export async function getManagementPets(input: Partial<ManagementPetQueryDTO> = {}) {
  const query = await managementPetQuerySchema.validate(input, { stripUnknown: true });
  return fetchManagementPets(query);
}

async function fetchManagementPets(query: ManagementPetQueryDTO) {
  'use cache: private';

  petsCache.cacheLife({ stale: 600 });
  petsCache.registerList(`management:${queryKey(query)}`);
  return customFetcher<ManagementPetsPageDTO>({
    url: '/pets/paginate',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getManagementPet(id: string) {
  'use cache: private';

  petsCache.cacheLife({ stale: 600 });
  petsCache.registerDetail(id);
  return customFetcher<ManagementPetDTO>({
    url: `/pets/manage/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

function toFormData(input: CreatePetDTO | UpdatePetImagesDTO) {
  const body = new FormData();
  for (const [field, value] of Object.entries(input)) {
    if (value == null) continue;
    if (field === 'images') {
      const upload = value as CreatePetDTO['images'];
      upload.images.forEach((image, index) => {
        if (index === upload.mainImageIndex) body.set('mainImage', image);
        else body.append('images', image);
      });
    } else {
      body.set(field, String(value));
    }
  }
  return body;
}

function invalidate(id?: string) {
  petsCache.invalidateList();
  if (id) petsCache.invalidateDetail(id);
}

export async function createPet(input: CreatePetDTO) {
  console.log(input);
  const result = await customFetcher<ManagementPetDTO, unknown, FormData>({
    url: '/pets',
    method: 'POST',
    body: toFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate();
  return result;
}

export async function getPetBaseInfo(id: string) {
  return getPrivatePetSection<PetBaseInfoDTO>(id, 'base-info');
}

export async function getPetImages(id: string) {
  return getPrivatePetSection<PetImagesDTO>(id, 'images');
}

export async function getPetPrice(id: string) {
  return getPrivatePetSection<PetPriceDTO>(id, 'price');
}

async function getPrivatePetSection<T>(id: string, section: 'base-info' | 'images' | 'price') {
  'use cache: private';

  petsCache.cacheLife({ stale: 600 });
  petsCache.registerDetail(id);
  return customFetcher<T>({
    url: `/pets/${id}/${section}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function updatePetBaseInfo(id: string, input: UpdatePetBaseInfoDTO) {
  const result = await customFetcher<PetBaseInfoDTO, unknown, UpdatePetBaseInfoDTO>({
    url: `/pets/${id}`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

export async function updatePetImages(id: string, input: UpdatePetImagesDTO) {
  const result = await customFetcher<PetImagesDTO, unknown, FormData>({
    url: `/pets/${id}/images`,
    method: 'PUT',
    body: toFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

export async function updatePetPrice(id: string, input: UpdatePetPriceDTO) {
  const result = await customFetcher<PetPriceDTO, unknown, UpdatePetPriceDTO>({
    url: `/pets/${id}/price`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

async function updatePetStatus(id: string, status: 'enable' | 'disable') {
  const result = await customFetcher<ManagementPetDTO, unknown, undefined>({
    url: `/pets/${id}/${status}`,
    method: 'PATCH',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

export const enablePet = (id: string) => updatePetStatus(id, 'enable');
export const disablePet = (id: string) => updatePetStatus(id, 'disable');

export async function deletePet(id: string) {
  const result = await customFetcher<DeletePetResultDTO>({
    url: `/pets/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
