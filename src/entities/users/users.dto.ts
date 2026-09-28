import type { OrderDTO } from '@/entities/orders/orders.dto';
import type { PaginateDataDTO, PaginateResponseDTO } from '@/entities/pagination/pagination.dto';
import type { ProductWeightDTO } from '@/entities/products/products.dto';
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
  DeleteCartItemInput,
  EmptyCartInput,
  AddWishlistItemInput,
  CreateUserAddressInput,
  UpdateUserAddressInput,
  CreateDeliveryQuoteInput,
  SelectDeliveryWindowInput,
} from './users.schema';

export type GetAllPaginatedUsersQueryDTO = GetAllPaginatedUsersInput;
export type GetAllPaginatedUsersParams = Partial<GetAllPaginatedUsersInput>;
/** The backend accepts account fields only; password confirmation is UI-only. */
export type CreateUserDTO = Omit<CreateUserInput, 'confirmPassword'>;
export type DeleteUserByIdDTO = DeleteUserByIdInput;
export type UpdateUserStatusByIdDTO = UpdateUserStatusByIdInput;
export type UserGetDetailByIdDTO = UserGetDetailByIdInput;
export type UpdateCurrentUserProfileDTO = UpdateCurrentUserProfileInput;
export type ChangeCurrentUserPasswordDTO = ChangeCurrentUserPasswordInput;
export type AddCartItemDTO = AddCartItemInput;
export type DeleteCartItemDTO = DeleteCartItemInput;
export type EmptyCartDTO = EmptyCartInput;
export type AddWishlistItemDTO = AddWishlistItemInput;
export type CreateUserAddressDTO = CreateUserAddressInput;
export type UpdateUserAddressDTO = UpdateUserAddressInput;
export type CreateDeliveryQuoteDTO = CreateDeliveryQuoteInput;
export type SelectDeliveryWindowDTO = SelectDeliveryWindowInput;

export interface AddressDTO {
  _id?: string;
  province: string;
  city: string;
  detailAddress: string;
  latLng: [latitude: number, longitude: number];
  plate: string;
  unit: string | null;
  postalCode: string;
  receiverIsMe: boolean;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
}

export interface CartCatalogItemDTO {
  _id: string;
  title: string;
  mainImage: string;
  mainImageThumbnail?: string;
  price: number;
  discountPercentage: number;
  quantity?: number;
  weights?: ProductWeightDTO[];
}

export interface CartItemDTO {
  _id?: string;
  /** `GET /cart/all` returns this catalog item populated by the backend. */
  item: unknown;
  itemType: string;
  quantity: number;
  weight?: string | null;
}

/** A populated cart line returned by `GET /cart/items`. */
export interface CartItemDetailsDTO {
  /** Embedded cart-entry identifier, used by `DELETE /cart/delete/:id`. */
  id: string;
  /** Referenced product or pet identifier, used when adjusting quantity. */
  itemId: string;
  itemType: 'product' | 'pet';
  title: string;
  mainImage: string;
  mainThumbnailImage: string;
  weight: { id: string; value: number; metric: string } | null;
  cartQuantity: number;
  discountPrice: number;
  price: number;
  productAllowQuantity: number;
}

export interface ShippingInfoDTO {
  name: string;
  trackingCode: string;
  estimateDeliveryDate: string | null;
}

export interface DeliveryWindowDTO {
  id: string;
  provider: string;
  countryCode: 'IR';
  timezone: 'Asia/Tehran';
  startsAt: string;
  endsAt: string;
  shippingPrice: number;
}

export interface DeliveryQuoteDTO {
  id: string;
  addressId: string;
  countryCode: 'IR';
  timezone: 'Asia/Tehran';
  expiresAt: string;
  options: DeliveryWindowDTO[];
}

export interface CartDTO {
  totalPrice: number;
  items: CartItemDTO[];
  discountPrice: number;
  userAddress: string | null;
  deliveryQuote?: DeliveryQuoteDTO | null;
  deliveryWindow?: DeliveryWindowDTO | null;
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
  cart: CartDTO | CartDTO[];
  isEnable: boolean;
  phoneNumber: string;
  email: string;
  role: UserRole;
  orders: OrderDTO[];
  wishlist: OrderDTO[];
  age: number | null;
  birthDate: string | null;
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
  email: string;
  nationalCode: string;
  age: number | null;
  birthDate: string | null;
}

export type AllPaginatedUsersResponseDTO = PaginateResponseDTO<UserDTO>;
export type AllPaginatedUsersDTO = PaginateDataDTO<UserDTO>;
