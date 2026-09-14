import type { PaginateDataDTO } from '@/entities/pagination/pagination.dto';
import type { AddressDTO, ShippingInfoDTO } from '@/entities/users/users.dto';

import type {
  CreateOrderInput,
  GetOrdersInput,
  UpdateOrderDeliveryStateInput,
  UpdateOrderShippingInfoInput,
} from './orders.schema';

export type CreateOrderDTO = CreateOrderInput;
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

export interface OrderDTO {
  _id: string;
  user: string | OrderUserDTO;
  trackingCode: string;
  orderNumber: string;
  deliveryState: number;
  paymentTrackingId: string;
  totalPrice: number;
  items: OrderItemDTO[];
  discountPrice: number;
  userAddress: AddressDTO & { sourceId: string };
  deliveringDateToShipping: string;
  shippingPrice: number;
  shippingInfo: ShippingInfoDTO;
  paymentType: number;
  instalmentCompany: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrdersPaginatedDTO = PaginateDataDTO<OrderDTO>;
