import type { OrderDetailDialogViewModel } from './orders-detail-dialog-content';

export const orderDetailDialogSkeletonData: OrderDetailDialogViewModel = {
  orderNumber: 'ORD-000000',
  trackingCode: 'TRACK-000000',
  totalPrice: 0,
  paymentStatus: 'pending',
  items: [
    {
      _id: 'order-detail-skeleton-item',
      title: 'محصول نمونه',
      quantity: 1,
    },
  ],
};
