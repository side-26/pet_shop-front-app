import type { PaginateDataDTO } from '@/entities/pagination/pagination.dto';
import type { DeliveryWindowDTO, ShippingInfoDTO } from '@/entities/users/users.dto';

import type {
  PrepareOrderInput,
  GetOrdersInput,
  UpdateOrderDeliveryStateInput,
  UpdateOrderShippingInfoInput,
} from './orders.schema';

export type PrepareOrderDTO = PrepareOrderInput;
export type GetOrdersQueryDTO = GetOrdersInput;
export type GetOrdersParams = Partial<GetOrdersInput>;
export type UpdateOrderDeliveryStateDTO = UpdateOrderDeliveryStateInput;
export type UpdateOrderShippingInfoDTO = UpdateOrderShippingInfoInput;

export interface OrderItemDTO {
  _id: string;
  item: string;
  itemType: 'product' | 'pet';
  quantity: number;
  weight?: { metric: string; value: number };
  price: number;
  discountPercentage: number;
  title: string;
  mainImage: string;
  mainImageThumbnail: string;
}
export interface OrderUserDTO {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

/** Historical delivery address snapshot; it intentionally has no live-address `_id`. */
export interface OrderAddressDTO {
  sourceId: string;
  province: string;
  city: string;
  detailAddress: string;
  latLng: [number, number];
  plate: string;
  unit: string | null;
  postalCode: string;
  receiverIsMe: boolean;
  firstName: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
}

export interface OrderDTO {
  _id: string;
  user: string | OrderUserDTO;
  trackingCode: string;
  orderNumber: string;
  deliveryState: number;
  paymentTrackingId: string | null;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentExpiresAt: string | null;
  inventoryReservationState: 'reserved' | 'released' | null;
  inventoryReleasedAt: string | null;
  totalPrice: number;
  items: OrderItemDTO[];
  discountPrice: number;
  userAddress: OrderAddressDTO;
  deliveryWindow: DeliveryWindowDTO;
  deliveringDateToShipping: string;
  shippingPrice: number;
  shippingInfo: ShippingInfoDTO;
  paymentType: number;
  instalmentCompany: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrdersPaginatedDTO = PaginateDataDTO<OrderDTO>;

export type PreparedOrderDTO = {
  orderId: string;
  expiresAt: string;
  payableAmount: number;
};
