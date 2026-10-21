import type { DialogHandle } from '@/_types';

export type OrdersFilterDialogParams = Readonly<{ query: Record<string, string> }>;
export type OrdersFilterDialogHandle = DialogHandle<OrdersFilterDialogParams>;
