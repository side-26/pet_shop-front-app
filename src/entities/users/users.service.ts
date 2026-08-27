import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type {
  AllPaginatedUsersDTO,
  GetAllPaginatedUsersParams,
  GetAllPaginatedUsersQueryDTO,
} from './users.dto';
import { createUsersListCacheKey } from './users.helpers';
import { getAllPaginatedUsersSchema } from './users.schema';

const usersCache = new EntityTag('users');

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
  console.log(res, 'res');
  return res;
}

export async function getAllPaginatedUsers(params: GetAllPaginatedUsersParams = {}) {
  const query = await getAllPaginatedUsersSchema.validate(params, { stripUnknown: true });
  console.log(query, 'query');
  return fetchAllPaginatedUsers(query);
}
