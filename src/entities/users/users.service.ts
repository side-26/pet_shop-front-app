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
  'use cache';

  usersCache.registerList(createUsersListCacheKey(query));

  return customFetcher<AllPaginatedUsersDTO>({
    url: '/users/all-paginate',
    method: 'GET',
    query,
    auth: false,
    cache: 'force-cache',
    next: { tags: [usersCache.list] },
  });
}

export async function getAllPaginatedUsers(params: GetAllPaginatedUsersParams = {}) {
  const query = await getAllPaginatedUsersSchema.validate(params, { stripUnknown: true });
  return fetchAllPaginatedUsers(query);
}
