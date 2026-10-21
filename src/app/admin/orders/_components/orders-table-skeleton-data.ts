import type { OrderTableRow } from './orders-table.types';

export const ordersTableSkeletonData: OrderTableRow[] = Array.from({ length: 5 }, (_, index) => ({
  id: `skeleton-order-${index + 1}`,
  orderNumber: `ORD-${1000 + index}`,
  trackingCode: `TRACK-${1000 + index}`,
  userFullName: 'نام مشتری',
  totalPrice: 0,
  paymentStatus: 'pending',
  deliveryState: 0,
}));
