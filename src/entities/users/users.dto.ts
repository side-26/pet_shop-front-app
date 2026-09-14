import type { OrderDTO } from '@/entities/orders/orders.dto';
import type { PaginateDataDTO, PaginateResponseDTO } from '@/entities/pagination/pagination.dto';
import type { UserRole } from '@/configs/user-role';

import type {
  CreateUserInput,
  ChangeCurrentUserPasswordInput,
  DeleteUserByIdInput,
  GetAllPaginatedUsersInput,
  UpdateUserStatusByIdInput,
  UpdateCurrentUserProfileInput,
  UserGetDetailByIdInput,
  AddCartItemInput,
  AddWishlistItemInput,
  CreateUserAddressInput,
  UpdateUserAddressInput,
} from './users.schema';

export type GetAllPaginatedUsersQueryDTO = GetAllPaginatedUsersInput;
export type GetAllPaginatedUsersParams = Partial<GetAllPaginatedUsersInput>;
export type CreateUserDTO = CreateUserInput;
export type DeleteUserByIdDTO = DeleteUserByIdInput;
export type UpdateUserStatusByIdDTO = UpdateUserStatusByIdInput;
export type UserGetDetailByIdDTO = UserGetDetailByIdInput;
export type UpdateCurrentUserProfileDTO = UpdateCurrentUserProfileInput;
export type ChangeCurrentUserPasswordDTO = ChangeCurrentUserPasswordInput;
export type AddCartItemDTO = AddCartItemInput;
export type AddWishlistItemDTO = AddWishlistItemInput;
export type CreateUserAddressDTO = CreateUserAddressInput;
export type UpdateUserAddressDTO = UpdateUserAddressInput;

export interface AddressDTO {
  _id?: string;
  province: string;
  city: string;
  detailAddress: string;
  plate: string;
  unit: string | null;
  postalCode: string;
  receiverIsMe: boolean;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
}

export interface CartItemDTO {
  _id?: string;
  item: unknown;
  itemType: string;
  quantity: number;
  weight?: string | null;
}

export interface ShippingInfoDTO {
  name: string;
  trackingCode: string;
  estimateDeliveryDate: string | null;
}

export interface CartDTO {
  totalPrice: number;
  items: CartItemDTO[];
  discountPrice: number;
  userAddress: string | null;
  deliveringDateToShipping: string | null;
  shippingPrice: number;
  shippingInfo: ShippingInfoDTO;
  paymentType: number;
  instalmentCompany: string | null;
}

export interface UserDTO {
  _id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  cart: CartDTO[];
  isEnable: boolean;
  phoneNumber: string;
  email: string;
  role: UserRole;
  orders: OrderDTO[];
  wishlist: OrderDTO[];
  age: number;
  addresses: AddressDTO[];
}

export interface WishlistItemDTO {
  _id: string;
  item?: unknown;
  itemType?: string;
}

export interface UserDetailDTO {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isEnable: boolean;
  avatar: string;
  nationalCode: string;
  addresses: AddressDTO[];
  age: number | null;
  role: UserRole;
  orders: unknown[];
  cart: CartDTO;
  wishlist: WishlistItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUserDTO {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  avatar: string;
}

export type AllPaginatedUsersResponseDTO = PaginateResponseDTO<UserDTO>;
export type AllPaginatedUsersDTO = PaginateDataDTO<UserDTO>;
