import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  AllPaginatedUsersDTO,
  CreateUserDTO,
  DeleteUserByIdDTO,
  GetAllPaginatedUsersParams,
  GetAllPaginatedUsersQueryDTO,
  UserDetailDTO,
  UserGetDetailByIdDTO,
  UserDTO,
} from './users.dto';
import { createUsersListCacheKey } from './users.helpers';
import { getAllPaginatedUsersSchema } from './users.schema';

const usersCache = new EntityTag('users');

export async function userGetDetailById(id: UserGetDetailByIdDTO['id']) {
  'use cache: private';

  usersCache.cacheLife({ stale: 360 });
  usersCache.registerDetail(id);

  return customFetcher<UserDetailDTO>({
    url: `/users/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

async function fetchAllPaginatedUsers(query: GetAllPaginatedUsersQueryDTO) {
  'use cache: private';

  usersCache.cacheLife({ stale: 600 });
  usersCache.registerList(createUsersListCacheKey(query));

  const res = await customFetcher<AllPaginatedUsersDTO>({
    url: '/users/paginate',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
  return res;
}

export async function getAllPaginatedUsers(params: GetAllPaginatedUsersParams = {}) {
  const query = await getAllPaginatedUsersSchema.validate(params, { stripUnknown: true });
  return fetchAllPaginatedUsers(query);
}

export async function createUser(input: CreateUserDTO) {
  const result = await customFetcher<UserDTO, unknown, CreateUserDTO>({
    url: '/users',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) {
    usersCache.invalidateList();
  }

  return result;
}

export async function deleteUserById(id: DeleteUserByIdDTO['id']) {
  const result = await customFetcher<void>({
    url: `/users/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) {
    usersCache.invalidateDetail(id);
    usersCache.invalidateList();
  }

  return result;
}
