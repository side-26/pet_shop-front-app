import type { BreedQueryInput } from '@/entities/breeds/breeds.schema';

import type { BreedsSearchParams } from '../page';

type BreedLevelFilterValue = '' | '0' | '1' | '2' | '3' | '4';

export type BreedsFilterValues = Omit<
  BreedQueryInput,
  'activityLevel' | 'country' | 'petType' | 'search' | 'size' | 'title'
> & {
  activityLevel: BreedLevelFilterValue;
  country: string;
  petType: string;
  search: string;
  size: BreedLevelFilterValue;
  title: string;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isSort(value: string | undefined): value is BreedsFilterValues['sort'] {
  return value === 'title' || value === 'createdAt' || value === 'updatedAt';
}

function isObjectId(value: string | undefined): value is string {
  return value !== undefined && /^[a-f\d]{24}$/i.test(value);
}

function isBreedLevel(value: string | undefined): value is BreedLevelFilterValue {
  return (
    value === '' ||
    value === '0' ||
    value === '1' ||
    value === '2' ||
    value === '3' ||
    value === '4'
  );
}

export function createBreedsFilterValues(
  initialValues?: Partial<BreedsFilterValues>,
): BreedsFilterValues {
  return {
    title: initialValues?.title ?? '',
    petType: initialValues?.petType ?? '',
    country: initialValues?.country ?? '',
    size: initialValues?.size ?? '',
    activityLevel: initialValues?.activityLevel ?? '',
    includeDisabled: initialValues?.includeDisabled ?? true,
    search: initialValues?.search ?? '',
    page: initialValues?.page ?? 1,
    limit: initialValues?.limit ?? 10,
    sort: initialValues?.sort ?? 'title',
  };
}

export function parseBreedsFilterSearchParams(
  searchParams: BreedsSearchParams,
): BreedsFilterValues {
  const includeDisabled = firstValue(searchParams.includeDisabled);
  const petType = firstValue(searchParams.petType);
  const size = firstValue(searchParams.size);
  const activityLevel = firstValue(searchParams.activityLevel);
  const sort = firstValue(searchParams.sort);

  return {
    title: firstValue(searchParams.title) ?? '',
    petType: isObjectId(petType) ? petType : '',
    country: firstValue(searchParams.country) ?? '',
    size: isBreedLevel(size) ? size : '',
    activityLevel: isBreedLevel(activityLevel) ? activityLevel : '',
    includeDisabled: includeDisabled !== 'false',
    search: firstValue(searchParams.search) ?? '',
    page: positiveInteger(firstValue(searchParams.page), 1),
    limit: positiveInteger(firstValue(searchParams.limit), 10),
    sort: isSort(sort) ? sort : 'title',
  };
}

export function toBreedsSearchParams(values: BreedsFilterValues) {
  const params = new URLSearchParams();

  if (values.title) params.set('title', values.title);
  if (values.petType) params.set('petType', values.petType);
  if (values.country) params.set('country', values.country);
  if (values.size !== '') params.set('size', values.size);
  if (values.activityLevel !== '') params.set('activityLevel', values.activityLevel);
  if (values.search) params.set('search', values.search);
  if (!values.includeDisabled) params.set('includeDisabled', 'false');
  if (values.sort !== 'title') params.set('sort', values.sort);
  if (values.limit !== 10) params.set('limit', String(values.limit));
  params.set('page', '1');

  return params;
}
