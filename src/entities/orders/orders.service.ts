import 'server-only';

import { invalidateProfileOrderData } from '@/entities/profile/profile.service';
import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';
import type {
  CreateOrderDTO,
  GetOrdersParams,
  GetOrdersQueryDTO,
  OrderDTO,
  OrdersPaginatedDTO,
  UpdateOrderDeliveryStateDTO,
  UpdateOrderShippingInfoDTO,
} from './orders.dto';
import { getOrdersSchema } from './orders.schema';

const ordersCache = new EntityTag('orders');
const cacheKey = (query: GetOrdersQueryDTO) =>
  new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value != null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, String(value)]),
  ).toString();
async function fetchOrders(url: '/orders' | '/orders/all', query: GetOrdersQueryDTO) {
  'use cache: private';
  ordersCache.cacheLife({ stale: 120 });
  ordersCache.registerList(`${url}:${cacheKey(query)}`);
  return customFetcher<OrdersPaginatedDTO>({ url, query, auth: true, cache: 'no-store' });
}
export async function getUserOrders(params: GetOrdersParams = {}) {
  return fetchOrders('/orders', await getOrdersSchema.validate(params, { stripUnknown: true }));
}
export async function getAllOrders(params: GetOrdersParams = {}) {
  return fetchOrders('/orders/all', await getOrdersSchema.validate(params, { stripUnknown: true }));
}
export async function getUserOrder(id: string) {
  'use cache: private';
  ordersCache.cacheLife({ stale: 120 });
  ordersCache.registerDetail(id);
  return customFetcher<OrderDTO>({ url: `/orders/${id}`, auth: true, cache: 'no-store' });
}
export async function createOrder(input: CreateOrderDTO, userId: string) {
  const result = await customFetcher<OrderDTO, unknown, CreateOrderDTO>({
    url: '/orders',
    method: 'POST',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) {
    ordersCache.invalidateList();
    invalidateProfileOrderData(userId);
  }
  return result;
}
export async function updateOrderDeliveryState(input: UpdateOrderDeliveryStateDTO) {
  const { id, deliveryState } = input;
  const result = await customFetcher<OrderDTO, unknown, { deliveryState: number }>({
    url: `/orders/${id}/delivery-state`,
    method: 'PATCH',
    body: { deliveryState },
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) {
    ordersCache.invalidateDetail(id);
    ordersCache.invalidateList();

    const userId = getOrderUserId(result.data);
    if (userId) invalidateProfileOrderData(userId, id);
  }
  return result;
}

function getOrderUserId(order: OrderDTO | undefined) {
  if (!order?.user) return undefined;
  return typeof order.user === 'string' ? order.user : order.user._id;
}
export async function updateOrderShippingInfo(input: UpdateOrderShippingInfoDTO) {
  const { id, ...body } = input;
  const result = await customFetcher<OrderDTO, unknown, typeof body>({
    url: `/orders/${id}/shipping-info`,
    method: 'PATCH',
    body,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) {
    ordersCache.invalidateDetail(id);
    ordersCache.invalidateList();
  }
  return result;
}
