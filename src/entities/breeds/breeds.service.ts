import 'server-only';
import { customFetcher, type FetcherResult } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';
import type {
  BreedDTO,
  BreedsDTO,
  BreedPropertyDefinitionsResultDTO,
  BreedQueryDTO,
  BreedsPageDTO,
  CreateBreedDTO,
  ReplaceBreedPropertyDefinitionsDTO,
  UpdateBreedDTO,
} from './breeds.dto';
import { breedQuerySchema } from './breeds.schema';

const breedsCache = new EntityTag('breeds');
function withSuccessMessage<T>(result: FetcherResult<T>, fallback: string): FetcherResult<T> {
  return result.isSuccess && !result.message?.trim() ? { ...result, message: fallback } : result;
}
const key = (query: BreedQueryDTO) =>
  new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, value]) => [name, String(value)]),
  ).toString();
async function fetchPage(query: BreedQueryDTO) {
  'use cache: private';
  breedsCache.cacheLife({ stale: 600 });
  breedsCache.registerList(key(query));

  const result = customFetcher<BreedsPageDTO>({
    url: '/breeds/paginate',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
  return result;
}
export async function getBreedsPage(input: Partial<BreedQueryDTO> = {}) {
  return fetchPage(await breedQuerySchema.validate(input, { stripUnknown: true }));
}
export async function getBreeds(input: Partial<BreedQueryDTO> = {}) {
  return fetchList(await breedQuerySchema.validate(input, { stripUnknown: true }));
}
async function fetchList(query: BreedQueryDTO) {
  'use cache: private';

  breedsCache.cacheLife({ stale: 600 });
  breedsCache.registerList(`list:${key(query)}`);
  return customFetcher<BreedsDTO>({
    url: '/breeds',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}
export async function getBreed(id: string) {
  'use cache: private';
  breedsCache.cacheLife({ stale: 600 });
  breedsCache.registerDetail(id);
  return customFetcher<BreedDTO>({
    url: `/breeds/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}
export async function getBreedPropertyDefinitions(id: string) {
  'use cache: private';
  breedsCache.cacheLife({ stale: 600 });
  breedsCache.registerDetail(id);
  return customFetcher<BreedPropertyDefinitionsResultDTO>({
    url: `/breeds/property-definitions/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}
function formData(input: CreateBreedDTO | UpdateBreedDTO) {
  const body = new FormData();
  body.set('title', input.title);
  body.set('petType', input.petType);
  body.set('country', input.country ?? 'null');
  body.set('ageAverage', input.ageAverage);
  body.set('size', String(input.size));
  body.set('activityLevel', input.activityLevel == null ? 'null' : String(input.activityLevel));
  body.set('enable', String(input.enable));
  if (input.mainImage instanceof File) body.set('mainImage', input.mainImage);
  return body;
}
function invalidate(id?: string) {
  breedsCache.invalidateList();
  if (id) breedsCache.invalidateDetail(id);
}
export async function createBreed(input: CreateBreedDTO) {
  const result = withSuccessMessage(
    await customFetcher<BreedDTO, unknown, FormData>({
      url: '/breeds',
      method: 'POST',
      body: formData(input),
      auth: true,
      cache: 'no-store',
    }),
    'نژاد با موفقیت ایجاد شد.',
  );
  if (result.isSuccess) invalidate();
  return result;
}
export async function updateBreed(id: string, input: UpdateBreedDTO) {
  const result = withSuccessMessage(
    await customFetcher<BreedDTO, unknown, FormData>({
      url: `/breeds/${id}`,
      method: 'PUT',
      body: formData(input),
      auth: true,
      cache: 'no-store',
    }),
    'تغییرات نژاد با موفقیت ذخیره شد.',
  );
  if (result.isSuccess) invalidate(id);
  return result;
}
export async function replaceBreedPropertyDefinitions(input: ReplaceBreedPropertyDefinitionsDTO) {
  const result = withSuccessMessage(
    await customFetcher<
      BreedPropertyDefinitionsResultDTO,
      unknown,
      ReplaceBreedPropertyDefinitionsDTO
    >({ url: '/breeds/range', method: 'PUT', body: input, auth: true, cache: 'no-store' }),
    'ویژگی‌های نژاد با موفقیت ذخیره شد.',
  );
  if (result.isSuccess) invalidate(input.id);
  return result;
}
async function status(id: string, value: 'enable' | 'disable') {
  const result = withSuccessMessage(
    await customFetcher<BreedDTO, unknown, undefined>({
      url: `/breeds/${id}/${value}`,
      method: 'PATCH',
      body: undefined,
      auth: true,
      cache: 'no-store',
    }),
    'وضعیت نژاد با موفقیت تغییر کرد.',
  );
  if (result.isSuccess) invalidate(id);
  return result;
}
export const enableBreed = (id: string) => status(id, 'enable');
export const disableBreed = (id: string) => status(id, 'disable');
export async function deleteBreed(id: string) {
  const result = withSuccessMessage(
    await customFetcher<{ id: string }>({
      url: `/breeds/${id}`,
      method: 'DELETE',
      auth: true,
      cache: 'no-store',
    }),
    'نژاد با موفقیت حذف شد.',
  );
  if (result.isSuccess) invalidate(id);
  return result;
}
