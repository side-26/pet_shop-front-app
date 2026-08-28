import type { PaginateDataDTO, PaginateResponseDTO } from '@/lib/api/pagination.dto';
import type { OrderDTO } from '@/entities/orders/orders.dto';
import type { UserRole } from '@/configs/user-role';

import type { CreateUserInput, GetAllPaginatedUsersInput } from './users.schema';

export type GetAllPaginatedUsersQueryDTO = GetAllPaginatedUsersInput;
export type GetAllPaginatedUsersParams = Partial<GetAllPaginatedUsersInput>;
export type CreateUserDTO = CreateUserInput;

export interface AddressDTO {
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
  item: unknown;
  itemType: string;
  quantity: number;
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

export type AllPaginatedUsersResponseDTO = PaginateResponseDTO<UserDTO>;
export type AllPaginatedUsersDTO = PaginateDataDTO<UserDTO>;
