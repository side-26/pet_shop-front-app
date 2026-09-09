import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  BrandDTO,
  BrandIdDTO,
  BrandQueryDTO,
  CreateBrandDTO,
  DeleteBrandResultDTO,
  UpdateBrandDTO,
} from './brands.dto';
import { brandQuerySchema } from './brands.schema';

const brandsCache = new EntityTag('brands');

const queryKey = (query: BrandQueryDTO) => `includeDisabled=${query.includeDisabled}`;

export async function getAllBrands(input: Partial<BrandQueryDTO> = {}) {
  return fetchAllBrands(await brandQuerySchema.validate(input, { stripUnknown: true }));
}

async function fetchAllBrands(query: BrandQueryDTO) {
  'use cache: private';

  brandsCache.cacheLife({ stale: 600 });
  brandsCache.registerList(queryKey(query));
  return customFetcher<BrandDTO[]>({
    url: '/brands',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getEnabledBrands() {
  'use cache: private';

  brandsCache.cacheLife({ stale: 600 });
  brandsCache.registerList('enabled');
  return customFetcher<BrandDTO[]>({
    url: '/brands/enabled',
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function getBrandById(id: BrandIdDTO['id']) {
  'use cache: private';

  brandsCache.cacheLife({ stale: 600 });
  brandsCache.registerDetail(id);
  return customFetcher<BrandDTO>({
    url: `/brands/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

function toBrandFormData(input: CreateBrandDTO | UpdateBrandDTO) {
  const body = new FormData();
  body.set('title', input.title);
  body.set('title_fa', input.title_fa);
  body.set('isEnable', String(input.isEnable));
  body.set(
    'description',
    typeof input.description === 'string' ? input.description : JSON.stringify(input.description),
  );
  if (input.logo instanceof File) body.set('logo', input.logo);
  return body;
}

function invalidate(id?: string) {
  brandsCache.invalidateList();
  if (id) brandsCache.invalidateDetail(id);
}

export async function createBrand(input: CreateBrandDTO) {
  const result = await customFetcher<BrandDTO, unknown, FormData>({
    url: '/brands',
    method: 'POST',
    body: toBrandFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate();
  return result;
}

export async function updateBrand(id: string, input: UpdateBrandDTO) {
  const result = await customFetcher<BrandDTO, unknown, FormData>({
    url: `/brands/${id}`,
    method: 'PUT',
    body: toBrandFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

async function updateBrandStatus(id: string, status: 'enable' | 'disable') {
  const result = await customFetcher<BrandDTO, unknown, undefined>({
    url: `/brands/${id}/${status}`,
    method: 'PATCH',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}

export const enableBrand = (id: string) => updateBrandStatus(id, 'enable');
export const disableBrand = (id: string) => updateBrandStatus(id, 'disable');

export async function deleteBrand(id: string) {
  const result = await customFetcher<DeleteBrandResultDTO>({
    url: `/brands/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
