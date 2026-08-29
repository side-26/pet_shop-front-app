import { USER_ROLES, type UserRole } from '@/configs/user-role';
import { USER_SORT_ORDERS, type GetAllPaginatedUsersInput } from '@/entities/users/users.schema';

type UsersAllPaginateFilterValues = Omit<GetAllPaginatedUsersInput, 'role' | 'sort'> & {
  role: GetAllPaginatedUsersInput['role'] | '';
  sort: GetAllPaginatedUsersInput['sort'] | '';
};

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function isUserRole(value: string | undefined): value is UserRole {
  return Object.values(USER_ROLES).some((role) => role === value);
}

function isSortOrder(
  value: string | undefined,
): value is NonNullable<GetAllPaginatedUsersInput['sort']> {
  return USER_SORT_ORDERS.some((order) => order === value);
}

function createUsersFilterFormValues(
  initialValues?: Partial<UsersAllPaginateFilterValues>,
): UsersAllPaginateFilterValues {
  return {
    fullName: initialValues?.fullName ?? '',
    role: initialValues?.role ?? '',
    phoneNumber: initialValues?.phoneNumber ?? '',
    nationalCode: initialValues?.nationalCode ?? '',
    page: initialValues?.page ?? 1,
    limit: initialValues?.limit ?? 20,
    isEnable: initialValues?.isEnable ?? null,
    sort: initialValues?.sort ?? '',
  };
}

function parseUsersFilterSearchParams(searchParams: SearchParams): UsersAllPaginateFilterValues {
  const role = firstValue(searchParams.role);
  const sort = firstValue(searchParams.sort);
  const isEnable = firstValue(searchParams.isEnable);

  return {
    fullName: firstValue(searchParams.fullName) ?? '',
    role: isUserRole(role) ? role : '',
    phoneNumber: firstValue(searchParams.phoneNumber) ?? '',
    nationalCode: firstValue(searchParams.nationalCode) ?? '',
    page: positiveInteger(firstValue(searchParams.page), 1),
    limit: positiveInteger(firstValue(searchParams.limit), 20),
    isEnable: isEnable === 'true' ? true : isEnable === 'false' ? false : null,
    sort: isSortOrder(sort) ? sort : '',
  };
}

export {
  createUsersFilterFormValues,
  parseUsersFilterSearchParams,
  type SearchParams,
  type UsersAllPaginateFilterValues,
};
