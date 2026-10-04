import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';
import { profileCache } from '@/entities/profile/profile.cache';

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
  DeleteCartItemDTO,
  EmptyCartDTO,
  AddWishlistItemDTO,
  CreateUserAddressDTO,
  UpdateUserAddressDTO,
  AddressDTO,
  CartDTO,
  CartItemDetailsDTO,
  WishlistItemDTO,
  CreateDeliveryQuoteDTO,
  DeliveryQuoteDTO,
  SelectDeliveryWindowDTO,
  CartCheckoutDTO,
  CartCheckoutQueryDTO,
} from './users.dto';
import { createUsersListCacheKey, omitNullQueryValues } from './users.helpers';
import { getAllPaginatedUsersSchema } from './users.schema';
import { usersCache } from './users.cache';
import { cartCache } from './cart.cache';
import { usersApiPaths } from './users.api-paths';

export async function getCurrentUser() {
  'use cache: private';

  const session = await getSession();
  usersCache.cacheLife({ stale: 360 });
  if (session) usersCache.registerDetail(session.userId);

  return customFetcher<CurrentUserDTO>({
    url: usersApiPaths.currentUser,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

/** Server-only BFF read for the browser-facing current-user route. */
export function getCurrentUserForSessionSync() {
  return customFetcher<CurrentUserDTO>({
    url: usersApiPaths.currentUser,
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
    url: usersApiPaths.userById(id),
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
    url: usersApiPaths.usersPaginate,
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
    url: usersApiPaths.usersList,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

export async function createUser(input: CreateUserDTO) {
  const result = await customFetcher<void, unknown, CreateUserDTO>({
    url: usersApiPaths.users,
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
  body.set('email', input.email);
  body.set('nationalCode', input.nationalCode);
  body.set('age', String(input.age));
  if (input.birthDate) body.set('birthDate', input.birthDate.slice(0, 10));
  if (input.avatar instanceof File) body.set('avatar', input.avatar);

  const result = await customFetcher<CurrentUserDTO, unknown, FormData>({
    url: usersApiPaths.userProfile,
    method: 'PUT',
    body,
    auth: true,
    cache: 'no-store',
  });

  if (result.isSuccess) {
    usersCache.invalidateDetail(userId);
    profileCache.invalidateDetail(userId);
  }
  return result;
}

export async function changeCurrentUserPassword(
  userId: string,
  input: ChangeCurrentUserPasswordDTO,
) {
  return customFetcher<void, unknown, ChangeCurrentUserPasswordDTO & { userId: string }>({
    url: usersApiPaths.userPassword,
    method: 'PUT',
    body: { ...input, userId },
    auth: true,
    cache: 'no-store',
  });
}

export async function deleteUserById(id: DeleteUserByIdDTO['id']) {
  const result = await customFetcher<void>({
    url: usersApiPaths.userById(id),
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
    url: usersApiPaths.userStatus(status, id),
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
  return customFetcher<AddressDTO[]>({
    url: usersApiPaths.addresses,
    auth: true,
    cache: 'no-store',
  });
}

export async function addUserAddress(userId: string, input: CreateUserAddressDTO) {
  const result = await customFetcher<AddressDTO, unknown, CreateUserAddressDTO>({
    url: usersApiPaths.addresses,
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
    url: usersApiPaths.addressById(addressId),
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
  cartCache.cacheLife({ stale: 120 });
  cartCache.registerDetail(userId);
  return customFetcher<CartDTO>({ url: usersApiPaths.cart.all, auth: true, cache: 'no-store' });
}

/** Expires the current user's populated cart read before an explicit retry. */
export function invalidateCart(userId: string) {
  cartCache.invalidateDetail(userId);
}

/** Gets populated cart lines, including the current catalog price and stock. */
export async function getCartItemDetails(userId: string) {
  'use cache: private';
  cartCache.cacheLife({ stale: 120 });
  cartCache.registerDetail(userId);
  return customFetcher<CartItemDetailsDTO[]>({
    url: usersApiPaths.cart.items,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}

/** Gets backend-calculated item, discount, delivery, packing, and payable totals. */
export function getCartCheckout(input: CartCheckoutQueryDTO) {
  return customFetcher<CartCheckoutDTO>({
    url: usersApiPaths.cart.checkout,
    method: 'GET',
    query: input,
    auth: true,
    cache: 'no-store',
  });
}

export async function addCartItem(userId: string, input: AddCartItemDTO) {
  const result = await customFetcher<CartDTO, unknown, AddCartItemDTO>({
    url: usersApiPaths.cart.add,
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) cartCache.invalidateDetail(userId);
  return result;
}

export async function deleteCartItem(userId: string, input: DeleteCartItemDTO) {
  const result = await customFetcher<CartDTO, unknown, Pick<DeleteCartItemDTO, 'idempotencyKey'>>({
    url: usersApiPaths.cart.deleteById(input.id),
    method: 'DELETE',
    body: { idempotencyKey: input.idempotencyKey },
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) cartCache.invalidateDetail(userId);
  return result;
}

export async function emptyCart(userId: string, input: EmptyCartDTO) {
  const result = await customFetcher<CartDTO, unknown, EmptyCartDTO>({
    url: usersApiPaths.cart.empty,
    method: 'DELETE',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) cartCache.invalidateDetail(userId);
  return result;
}

export async function createDeliveryQuote(userId: string, input: CreateDeliveryQuoteDTO) {
  const result = await customFetcher<DeliveryQuoteDTO, unknown, CreateDeliveryQuoteDTO>({
    url: usersApiPaths.cart.deliveryWindows,
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) cartCache.invalidateDetail(userId);
  return result;
}

export async function selectDeliveryWindow(userId: string, input: SelectDeliveryWindowDTO) {
  const result = await customFetcher<CartDTO, unknown, SelectDeliveryWindowDTO>({
    url: usersApiPaths.cart.deliveryWindow,
    method: 'PATCH',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) cartCache.invalidateDetail(userId);
  return result;
}

export async function getWishlist(userId: string) {
  'use cache: private';
  usersCache.cacheLife({ stale: 360 });
  usersCache.registerDetail(userId);
  return customFetcher<WishlistItemDTO[]>({
    url: usersApiPaths.wishlist.all,
    auth: true,
    cache: 'no-store',
  });
}

export async function addWishlistItem(userId: string, input: AddWishlistItemDTO) {
  const result = await customFetcher<WishlistItemDTO, unknown, AddWishlistItemDTO>({
    url: usersApiPaths.wishlist.add,
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
    url: usersApiPaths.wishlist.deleteById(id),
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) usersCache.invalidateDetail(userId);
  return result;
}
