import { Expose, Transform } from 'class-transformer';

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

/** Presentation-ready projection for an address card. Created only by the client query selector. */
export class ProfileAddressCardDTO {
  @Expose({ name: '_id' })
  declare id?: string;

  @Expose()
  @Transform(({ obj }) => [obj.province, obj.city].filter(Boolean).join('، ') || 'نشانی تحویل', {
    toClassOnly: true,
  })
  declare title: string;

  @Expose()
  @Transform(
    ({ obj }) =>
      [
        obj.city,
        obj.detailAddress,
        obj.plate ? `پلاک ${obj.plate}` : null,
        obj.unit ? `واحد ${obj.unit}` : null,
      ]
        .filter(Boolean)
        .join('، '),
    { toClassOnly: true },
  )
  declare details: string;

  @Expose()
  declare firstName: string;

  @Expose()
  declare lastName: string;

  @Expose()
  declare phoneNumber: string;

  @Expose()
  declare postalCode: string;
}
export type ProfileOrderDTO = OrderDTO;
export type ProfileOrdersPageDTO = PaginateDataDTO<ProfileOrderDTO>;
export type ResetProfilePasswordDTO = ResetProfilePasswordInput;
export type CreateProfileAddressDTO = CreateProfileAddressInput;
export type UpdateProfileAddressDTO = UpdateProfileAddressInput;
export type GetProfileOrdersQueryDTO = GetProfileOrdersInput;
export type GetProfileOrdersParams = Partial<GetProfileOrdersInput>;
