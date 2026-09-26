'use server';
import { ValidationError } from 'yup';
import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import { getSession } from '@/utils/session';
import {
  createOrderSchema,
  getOrdersSchema,
  orderIdSchema,
  updateOrderDeliveryStateSchema,
  updateOrderShippingInfoSchema,
} from './orders.schema';
import {
  createOrder,
  getAllOrders,
  getUserOrder,
  getUserOrders,
  updateOrderDeliveryState,
  updateOrderShippingInfo,
} from './orders.service';
const accessError = (message: string) => ({
  isSuccess: false as const,
  message,
  data: { messages: {}, details: {} },
});
async function customerAction<T>(
  input: unknown,
  schema: { validate: (value: unknown, options: object) => Promise<T> },
  message: string,
  callback: (value: T, userId: string) => Promise<unknown>,
) {
  const session = await getSession();
  if (!session) return accessError(message);
  try {
    return callback(
      await schema.validate(input, { abortEarly: false, stripUnknown: true }),
      session.userId,
    );
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}
async function adminAction<T>(
  input: unknown,
  schema: { validate: (value: unknown, options: object) => Promise<T> },
  message: string,
  callback: (value: T) => Promise<unknown>,
) {
  const session = await getSession();
  if (!session) return accessError(message);
  if (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.SELLER)
    return accessError('شما اجازه انجام این عملیات را ندارید.');
  try {
    return callback(await schema.validate(input, { abortEarly: false, stripUnknown: true }));
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}
export const createOrderAction = (input: unknown) =>
  customerAction(input, createOrderSchema, 'برای ثبت سفارش وارد حساب کاربری شوید.', createOrder);
export const getUserOrdersAction = (input: unknown = {}) =>
  customerAction(
    input,
    getOrdersSchema,
    'برای مشاهده سفارش‌ها وارد حساب کاربری شوید.',
    getUserOrders,
  );
export const getUserOrderAction = (input: unknown) =>
  customerAction(input, orderIdSchema, 'برای مشاهده سفارش وارد حساب کاربری شوید.', ({ id }) =>
    getUserOrder(id),
  );
export const getAllOrdersAction = (input: unknown = {}) =>
  adminAction(input, getOrdersSchema, 'برای مشاهده سفارش‌ها وارد حساب مدیریتی شوید.', getAllOrders);
export const updateOrderDeliveryStateAction = (input: unknown) =>
  adminAction(
    input,
    updateOrderDeliveryStateSchema,
    'برای ویرایش سفارش وارد حساب مدیریتی شوید.',
    updateOrderDeliveryState,
  );
export const updateOrderShippingInfoAction = (input: unknown) =>
  adminAction(
    input,
    updateOrderShippingInfoSchema,
    'برای ویرایش سفارش وارد حساب مدیریتی شوید.',
    updateOrderShippingInfo,
  );
