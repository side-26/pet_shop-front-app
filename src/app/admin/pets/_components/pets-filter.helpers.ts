import type { ManagementPetQueryInput } from '@/entities/pets/pets.schema';

export type PetsFilterValues = Omit<ManagementPetQueryInput, 'isEnable' | 'sort'> & {
  isEnable: boolean | null;
  sort: ManagementPetQueryInput['sort'] | '';
};
export type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const positive = (value: string | undefined, fallback: number) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export function parsePetsFilterSearchParams(params: SearchParams): PetsFilterValues {
  const enabled = first(params.isEnable);
  const sort = first(params.sort);
  const sorts = ['title', 'createdAt', 'updatedAt', 'price', 'quantity'] as const;
  return {
    title: first(params.title) ?? '',
    petType: first(params.petType) ?? '',
    breed: first(params.breed) ?? '',
    quantity: first(params.quantity) === undefined ? undefined : Number(first(params.quantity)),
    isEnable: enabled === 'true' ? true : enabled === 'false' ? false : null,
    page: positive(first(params.page), 1),
    limit: positive(first(params.limit), 10),
    sort: sorts.find((value) => value === sort) ?? '',
  };
}
