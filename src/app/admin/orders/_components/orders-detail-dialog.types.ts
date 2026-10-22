import type { DialogHandle } from '@/_types';

export type OrdersDetailDialogParams = Readonly<{ orderId: string }>;
export type OrdersDetailDialogHandle = DialogHandle<OrdersDetailDialogParams>;
