import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { usersCache } from '@/entities/users/users.cache';

import type {
  CreateProfileAddressDTO,
  GetProfileOrdersParams,
  GetProfileOrdersQueryDTO,
  ProfileAccountDTO,
  ProfileAddressDTO,
  ProfileOrderDTO,
  ProfileOrderSummaryDTO,
  ProfileOrdersPageDTO,
  ResetProfilePasswordDTO,
  UpdateProfileAddressDTO,
} from './profile.dto';
import { createProfileOrdersCacheKey } from './profile.helpers';
import { getProfileOrdersSchema } from './profile.schema';
import { profileCache } from './profile.cache';

export async function getProfileAccount(userId: string) {
  'use cache: private';

  profileCache.cacheLife({ stale: 360 });
  profileCache.registerDetail(userId);

  return customFetcher<ProfileAccountDTO>({
    url: '/profile/account',
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function resetProfilePassword(input: ResetProfilePasswordDTO) {
  const result = await customFetcher<void, unknown, ResetProfilePasswordDTO>({
    url: '/profile/reset-password',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) profileCache.invalidateAll();
  return result;
}

export async function deleteProfileAvatar(userId: string) {
  const result = await customFetcher<{ avatar: string }>({
    url: '/profile/avatar',
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) {
    profileCache.invalidateDetail(userId);
    usersCache.invalidateDetail(userId);
  }

  return result;
}

export async function getProfileAddresses(userId: string) {
  'use cache: private';

  profileCache.cacheLife({ stale: 360 });
  profileCache.registerList(`addresses:${userId}`);

  return customFetcher<ProfileAddressDTO[]>({
    url: '/profile/addresses',
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function getProfileAddress(userId: string, addressId: string) {
  'use cache: private';

  profileCache.cacheLife({ stale: 360 });
  profileCache.registerDetail(`${userId}:address:${addressId}`);

  return customFetcher<ProfileAddressDTO>({
    url: `/profile/addresses/${addressId}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function createProfileAddress(input: CreateProfileAddressDTO) {
  const result = await customFetcher<ProfileAddressDTO, unknown, CreateProfileAddressDTO>({
    url: '/profile/addresses',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) profileCache.invalidateList();
  return result;
}

export async function updateProfileAddress(
  userId: string,
  addressId: string,
  input: UpdateProfileAddressDTO,
) {
  const result = await customFetcher<ProfileAddressDTO, unknown, UpdateProfileAddressDTO>({
    url: `/profile/addresses/${addressId}`,
    method: 'PATCH',
    body: input,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) {
    profileCache.invalidateDetail(`${userId}:address:${addressId}`);
    profileCache.invalidateList();
  }
  return result;
}

export async function deleteProfileAddress(userId: string, addressId: string) {
  const result = await customFetcher<void>({
    url: `/profile/addresses/${addressId}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) {
    profileCache.invalidateDetail(`${userId}:address:${addressId}`);
    profileCache.invalidateList();
  }
  return result;
}

async function fetchProfileOrders(userId: string, query: GetProfileOrdersQueryDTO) {
  'use cache: private';

  profileCache.cacheLife({ stale: 120 });
  profileCache.registerList(`orders:${userId}:${createProfileOrdersCacheKey(query)}`);

  return customFetcher<ProfileOrdersPageDTO>({
    url: '/profile/orders',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}

export async function getProfileOrders(userId: string, params: GetProfileOrdersParams = {}) {
  const query = await getProfileOrdersSchema.validate(params, { stripUnknown: true });
  return fetchProfileOrders(userId, query);
}

export async function getProfileOrderSummary(userId: string) {
  'use cache: private';

  profileCache.cacheLife({ stale: 120 });
  profileCache.registerDetail(`${userId}:orders-summary`);

  return customFetcher<ProfileOrderSummaryDTO>({
    url: '/profile/orders/summary',
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function getProfileOrder(userId: string, orderId: string) {
  'use cache: private';

  profileCache.cacheLife({ stale: 120 });
  profileCache.registerDetail(`${userId}:order:${orderId}`);

  return customFetcher<ProfileOrderDTO>({
    url: `/profile/orders/${orderId}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}
