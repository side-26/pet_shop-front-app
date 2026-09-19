import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';
import { getSession } from '@/utils/session';

import type {
  AllPaginatedUsersDTO,
  CurrentUserDTO,
  ChangeCurrentUserPasswordDTO,
  CreateUserDTO,
  DeleteUserByIdDTO,
  GetAllPaginatedUsersParams,
  GetAllPaginatedUsersQueryDTO,
  UpdateUserStatusByIdDTO,
  UpdateCurrentUserProfileDTO,
  UserDetailDTO,
  UserGetDetailByIdDTO,
  UserDTO,
  AddCartItemDTO,
  AddWishlistItemDTO,
  CreateUserAddressDTO,
  UpdateUserAddressDTO,
  AddressDTO,
  CartDTO,
  WishlistItemDTO,
  CreateDeliveryQuoteDTO,
  DeliveryQuoteDTO,
  SelectDeliveryWindowDTO,
} from './users.dto';
import { createUsersListCacheKey, omitNullQueryValues } from './users.helpers';
import { getAllPaginatedUsersSchema } from './users.schema';

const usersCache = new EntityTag('users');

export async function getCurrentUser() {
  'use cache: private';

  const session = await getSession();
  usersCache.cacheLife({ stale: 360 });
  if (session) usersCache.registerDetail(session.userId);

  return customFetcher<CurrentUserDTO>({
    url: '/users/current',
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

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

  const requestQuery = omitNullQueryValues(query);
  usersCache.cacheLife({ stale: 600 });
  usersCache.registerList(createUsersListCacheKey(requestQuery));

  const res = await customFetcher<AllPaginatedUsersDTO>({
    url: '/users/paginate',
    method: 'GET',
    query: requestQuery,
    auth: true,
    cache: 'no-store',
  });
  return res;
}

export async function getAllPaginatedUsers(params: GetAllPaginatedUsersParams = {}) {
  const query = await getAllPaginatedUsersSchema.validate(params, { stripUnknown: true });
  return fetchAllPaginatedUsers(query);
}

export async function getAllUsers() {
  'use cache: private';
  usersCache.cacheLife({ stale: 600 });
  usersCache.registerList('all');
  return customFetcher<UserDTO[]>({
    url: '/users/all',
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
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

export async function updateCurrentUserProfile(userId: string, input: UpdateCurrentUserProfileDTO) {
  const body = new FormData();
  body.set('firstName', input.firstName);
  body.set('lastName', input.lastName);
  if (input.avatar instanceof File) body.set('avatar', input.avatar);

  const result = await customFetcher<CurrentUserDTO, unknown, FormData>({
    url: '/users/edit-info',
    method: 'PUT',
    body,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function changeCurrentUserPassword(
  userId: string,
  input: ChangeCurrentUserPasswordDTO,
) {
  return customFetcher<void, unknown, ChangeCurrentUserPasswordDTO & { userId: string }>({
    url: '/users/change-password',
    method: 'PUT',
    body: { ...input, userId },
    auth: true,
    cache: 'no-store',
  });
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

async function updateUserStatus(id: UpdateUserStatusByIdDTO['id'], status: 'enable' | 'disable') {
  const result = await customFetcher<void, unknown, undefined>({
    url: `/users/${status}/${id}`,
    method: 'PUT',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) {
    usersCache.invalidateDetail(id);
    usersCache.invalidateList();
  }

  return result;
}

export function enableUserById(id: UpdateUserStatusByIdDTO['id']) {
  return updateUserStatus(id, 'enable');
}

export function disableUserById(id: UpdateUserStatusByIdDTO['id']) {
  return updateUserStatus(id, 'disable');
}

export async function getUserAddresses(userId: string) {
  'use cache: private';
  usersCache.cacheLife({ stale: 360 });
  usersCache.registerDetail(userId);
  return customFetcher<AddressDTO[]>({ url: '/users/addresses', auth: true, cache: 'no-store' });
}

export async function addUserAddress(userId: string, input: CreateUserAddressDTO) {
  const result = await customFetcher<AddressDTO, unknown, CreateUserAddressDTO>({
    url: '/users/addresses',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  input: UpdateUserAddressDTO,
) {
  const result = await customFetcher<AddressDTO, unknown, UpdateUserAddressDTO>({
    url: `/users/addresses/${addressId}`,
    method: 'PATCH',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function getCart(userId: string) {
  'use cache: private';
  usersCache.cacheLife({ stale: 120 });
  usersCache.registerDetail(userId);
  return customFetcher<CartDTO>({ url: '/cart/all', auth: true, cache: 'no-store' });
}

export async function addCartItem(userId: string, input: AddCartItemDTO) {
  const result = await customFetcher<CartDTO, unknown, AddCartItemDTO>({
    url: '/cart/add',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function deleteCartItem(userId: string, id: string) {
  const result = await customFetcher<CartDTO>({
    url: `/cart/delete/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function emptyCart(userId: string) {
  const result = await customFetcher<CartDTO>({
    url: '/cart/empty',
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function createDeliveryQuote(userId: string, input: CreateDeliveryQuoteDTO) {
  const result = await customFetcher<DeliveryQuoteDTO, unknown, CreateDeliveryQuoteDTO>({
    url: '/cart/delivery-windows',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function selectDeliveryWindow(userId: string, input: SelectDeliveryWindowDTO) {
  const result = await customFetcher<CartDTO, unknown, SelectDeliveryWindowDTO>({
    url: '/cart/delivery-window',
    method: 'PATCH',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function getWishlist(userId: string) {
  'use cache: private';
  usersCache.cacheLife({ stale: 360 });
  usersCache.registerDetail(userId);
  return customFetcher<WishlistItemDTO[]>({ url: '/wishlist/all', auth: true, cache: 'no-store' });
}

export async function addWishlistItem(userId: string, input: AddWishlistItemDTO) {
  const result = await customFetcher<WishlistItemDTO, unknown, AddWishlistItemDTO>({
    url: '/wishlist/add',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}

export async function deleteWishlistItem(userId: string, id: string) {
  const result = await customFetcher<WishlistItemDTO[]>({
    url: `/wishlist/delete/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}
