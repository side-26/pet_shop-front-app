import type { ManagementProductQueryInput } from '@/entities/products/products.schema';

export type ProductsFilterValues = Omit<ManagementProductQueryInput, 'isEnable' | 'sort'> & {
  isEnable: boolean | null;
  sort: ManagementProductQueryInput['sort'] | '';
};
export type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const positive = (value: string | undefined, fallback: number) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

export function parseProductsFilterSearchParams(params: SearchParams): ProductsFilterValues {
  const enabled = first(params.isEnable);
  const sort = first(params.sort);
  const sorts = ['title', 'createdAt', 'updatedAt', 'price', 'quantity'] as const;
  return {
    title: first(params.title) ?? '',
    category: first(params.category) ?? '',
    subCategory: first(params.subCategory) ?? '',
    quantity: first(params.quantity) === undefined ? undefined : Number(first(params.quantity)),
    price: first(params.price) === undefined ? undefined : Number(first(params.price)),
    isEnable: enabled === 'true' ? true : enabled === 'false' ? false : null,
    page: positive(first(params.page), 1),
    limit: positive(first(params.limit), 10),
    sort: sorts.find((value) => value === sort) ?? '',
    includeDisabled: true,
  };
}
