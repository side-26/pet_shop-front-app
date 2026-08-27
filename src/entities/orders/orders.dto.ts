import type { AddressDTO, ShippingInfoDTO } from '@/entities/users/users.dto';

export interface OrderDTO {
  user: string;
  trackingCode: string | number;
  orderNumber: string | number;
  deliveryState: number;
  paymentTrackingId: string;
  totalPrice: number;
  items: unknown[];
  discountPrice: number;
  userAddress: AddressDTO;
  deliveringDateToShipping: string;
  shippingPrice: number;
  shippingInfo: ShippingInfoDTO;
  paymentType: number;
  instalmentCompany: string | null;
}
