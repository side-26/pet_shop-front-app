import type { OrderDTO } from '@/entities/orders/orders.dto';
import type { PaginateDataDTO } from '@/entities/pagination/pagination.dto';
import type { AddressDTO } from '@/entities/users/users.dto';

import type {
  CreateProfileAddressInput,
  GetProfileOrdersInput,
  ResetProfilePasswordInput,
  UpdateProfileAddressInput,
} from './profile.schema';

export interface ProfileAccountDTO {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  avatar: string;
  nationalCode: string;
  age: number | null;
  birthDate: string | null;
}

export interface ProfileOrderSummaryDTO {
  orders: number;
  delivered: number;
  lastPurchase: string | null;
}

export type ProfileAddressDTO = AddressDTO;
export type ProfileOrderDTO = OrderDTO;
export type ProfileOrdersPageDTO = PaginateDataDTO<ProfileOrderDTO>;
export type ResetProfilePasswordDTO = ResetProfilePasswordInput;
export type CreateProfileAddressDTO = CreateProfileAddressInput;
export type UpdateProfileAddressDTO = UpdateProfileAddressInput;
export type GetProfileOrdersQueryDTO = GetProfileOrdersInput;
export type GetProfileOrdersParams = Partial<GetProfileOrdersInput>;
