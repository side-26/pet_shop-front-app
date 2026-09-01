import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  CreateSubCategoryDTO,
  DeleteSubCategoryResultDTO,
  SubCategoryDTO,
  SubCategoryIdDTO,
  SubCategoryQueryDTO,
  UpdateSubCategoryDTO,
} from './sub-categories.dto';
import { subCategoryQuerySchema } from './sub-categories.schema';

const subCategoriesCache = new EntityTag('sub-categories');

function createQueryKey(query: SubCategoryQueryDTO) {
  return new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, value]) => [name, String(value)]),
  ).toString();
}

export async function getAllSubCategories(input: Partial<SubCategoryQueryDTO> = {}) {
  const query = await subCategoryQuerySchema.validate(input, { stripUnknown: true });
  return fetchAllSubCategories(query);
}

async function fetchAllSubCategories(query: SubCategoryQueryDTO) {
  'use cache: private';

  subCategoriesCache.cacheLife({ stale: 600 });
  subCategoriesCache.registerList(createQueryKey(query));

  return customFetcher<SubCategoryDTO[]>({
    url: '/sub-categories',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getSubCategoryById(id: SubCategoryIdDTO['id']) {
  'use cache: private';

  subCategoriesCache.cacheLife({ stale: 600 });
  subCategoriesCache.registerDetail(id);

  return customFetcher<SubCategoryDTO>({
    url: `/sub-categories/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

function invalidate(id?: string) {
  subCategoriesCache.invalidateList();
  if (id) subCategoriesCache.invalidateDetail(id);
}

export async function createSubCategory(input: CreateSubCategoryDTO) {
  const result = await customFetcher<SubCategoryDTO, unknown, CreateSubCategoryDTO>({
    url: '/sub-categories',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) invalidate();
  return result;
}

export async function updateSubCategory(id: string, input: UpdateSubCategoryDTO) {
  const result = await customFetcher<SubCategoryDTO, unknown, UpdateSubCategoryDTO>({
    url: `/sub-categories/${id}`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) invalidate(id);
  return result;
}

export async function deleteSubCategory(id: string) {
  const result = await customFetcher<DeleteSubCategoryResultDTO>({
    url: `/sub-categories/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) invalidate(id);
  return result;
}
