import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  CategoryDTO,
  CategoryIdDTO,
  CategoryQueryDTO,
  CreateCategoryDTO,
  DeleteCategoryResultDTO,
  UpdateCategoryDTO,
} from './categories.dto';
import { categoryQuerySchema } from './categories.schema';

const categoriesCache = new EntityTag('categories');

function createCategoryQueryKey(query: CategoryQueryDTO) {
  return new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, value]) => [name, String(value)]),
  ).toString();
}

export async function getAllCategories(input: Partial<CategoryQueryDTO> = {}) {
  const query = await categoryQuerySchema.validate(input, { stripUnknown: true });
  return fetchAllCategories(query);
}

async function fetchAllCategories(query: CategoryQueryDTO) {
  'use cache: private';

  categoriesCache.cacheLife({ stale: 600 });
  categoriesCache.registerList(createCategoryQueryKey(query));

  return customFetcher<CategoryDTO[]>({
    url: '/categories',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getCategoryById(id: CategoryIdDTO['id']) {
  'use cache: private';

  categoriesCache.cacheLife({ stale: 600 });
  categoriesCache.registerDetail(id);

  return customFetcher<CategoryDTO>({
    url: `/categories/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

function invalidate(id?: string) {
  categoriesCache.invalidateList();
  if (id) categoriesCache.invalidateDetail(id);
}

export async function createCategory(input: CreateCategoryDTO) {
  const result = await customFetcher<CategoryDTO, unknown, CreateCategoryDTO>({
    url: '/categories',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) invalidate();
  return result;
}

export async function updateCategory(id: string, input: UpdateCategoryDTO) {
  const result = await customFetcher<CategoryDTO, unknown, UpdateCategoryDTO>({
    url: `/categories/${id}`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) invalidate(id);
  return result;
}

async function updateCategoryStatus(id: string, status: 'enable' | 'disable') {
  const result = await customFetcher<CategoryDTO, unknown, undefined>({
    url: `/categories/${status}/${id}`,
    method: 'PUT',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) invalidate(id);
  return result;
}

export function enableCategory(id: string) {
  return updateCategoryStatus(id, 'enable');
}

export function disableCategory(id: string) {
  return updateCategoryStatus(id, 'disable');
}

export async function deleteCategory(id: string) {
  const result = await customFetcher<DeleteCategoryResultDTO>({
    url: `/categories/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) invalidate(id);
  return result;
}
