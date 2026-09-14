import { mixed, number, object, string, type InferType } from 'yup';

export const ORDER_DELIVERY_STATES = [0, 1, 2, 3] as const;
export const ORDER_SORT_FIELDS = ['createdAt', 'updatedAt', 'totalPrice', 'deliveryState'] as const;
const objectId = string()
  .trim()
  .required()
  .matches(/^[a-f\d]{24}$/i);

export const orderIdSchema = object({ id: objectId });
export const createOrderSchema = object({
  paymentTrackingId: string().trim().min(1).max(200).required(),
});
export const getOrdersSchema = object({
  page: number().integer().min(1).default(1).required(),
  limit: number().integer().min(1).max(100).default(10).required(),
  sort: mixed<(typeof ORDER_SORT_FIELDS)[number]>()
    .oneOf(ORDER_SORT_FIELDS)
    .default('createdAt')
    .required(),
  deliveryState: mixed<(typeof ORDER_DELIVERY_STATES)[number]>()
    .oneOf(ORDER_DELIVERY_STATES)
    .optional(),
});
export const updateOrderDeliveryStateSchema = object({
  id: objectId,
  deliveryState: mixed<(typeof ORDER_DELIVERY_STATES)[number]>()
    .oneOf(ORDER_DELIVERY_STATES)
    .required(),
});
export const updateOrderShippingInfoSchema = object({
  id: objectId,
  name: string().trim().min(1).max(150).optional(),
  trackingCode: string().trim().min(1).max(150).optional(),
  estimateDeliveryDate: string().trim().nullable().optional(),
}).test('has-update', 'حداقل یک فیلد اطلاعات ارسال باید ارائه شود.', (value) =>
  Boolean(
    value &&
    ['name', 'trackingCode', 'estimateDeliveryDate'].some(
      (key) => value[key as keyof typeof value] !== undefined,
    ),
  ),
);
export type CreateOrderInput = InferType<typeof createOrderSchema>;
export type GetOrdersInput = InferType<typeof getOrdersSchema>;
export type UpdateOrderDeliveryStateInput = InferType<typeof updateOrderDeliveryStateSchema>;
export type UpdateOrderShippingInfoInput = InferType<typeof updateOrderShippingInfoSchema>;
