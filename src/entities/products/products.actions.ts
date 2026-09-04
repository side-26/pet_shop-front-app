'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import { getAllCategories } from '@/entities/categories/categories.service';
import { getAllSubCategories } from '@/entities/sub-categories/sub-categories.service';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  customerProductQuerySchema,
  managementProductQuerySchema,
  productIdSchema,
  productSchema,
  updateProductBaseInfoSchema,
  updateProductImagesSchema,
  updateProductPriceSchema,
} from './products.schema';
import * as service from './products.service';

const denied = (message: string): FetcherError => ({
  isSuccess: false,
  message,
  data: { messages: {}, details: {} },
});
async function authorizeManagement() {
  const role = (await getSession())?.role;
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER
    ? null
    : denied('شما اجازه مدیریت محصولات را ندارید.');
}
async function authorizeAdmin() {
  return (await getSession())?.role === USER_ROLES.ADMIN
    ? null
    : denied('شما اجازه حذف محصولات را ندارید.');
}
async function validate<T>(
  schema: { validate(input: unknown, options: object): Promise<T> },
  input: unknown,
) {
  try {
    return await schema.validate(input, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function getCustomerProductsAction(input: unknown = {}) {
  const value = await validate(customerProductQuerySchema, input);
  return 'isSuccess' in value ? value : service.getCustomerProducts(value);
}
export async function getCustomerProductAction(input: unknown) {
  const value = await validate(productIdSchema, input);
  return 'isSuccess' in value ? value : service.getCustomerProduct(value.id);
}
export async function getManagementProductsAction(input: unknown = {}) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(managementProductQuerySchema, input);
  return 'isSuccess' in value ? value : service.getManagementProducts(value);
}
export async function getManagementProductAction(input: unknown) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(productIdSchema, input);
  return 'isSuccess' in value ? value : service.getManagementProduct(value.id);
}
export async function getProductFormOptionsAction() {
  const error = await authorizeManagement();
  if (error) return error;

  const [categories, subCategories] = await Promise.all([
    getAllCategories({ includeDisabled: false }),
    getAllSubCategories(),
  ]);
  if (!categories.isSuccess) return categories;
  if (!subCategories.isSuccess) return subCategories;

  return {
    isSuccess: true as const,
    message: null,
    data: {
      categories: categories.data.map(({ id, title }) => ({ id, title })),
      subCategories: subCategories.data.map(({ id, title, category }) => ({ id, title, category })),
    },
  };
}
async function managementSection<T>(input: unknown, action: (id: string) => Promise<T>) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(productIdSchema, input);
  return 'isSuccess' in value ? value : action(value.id);
}
export async function getProductImagesAction(input: unknown) {
  return managementSection(input, service.getProductImages);
}
export async function getProductPriceAction(input: unknown) {
  return managementSection(input, service.getProductPrice);
}
export async function getProductMainInfoAction(input: unknown) {
  return managementSection(input, service.getProductMainInfo);
}
export async function createProductAction(input: unknown) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(productSchema, input);
  return 'isSuccess' in value ? value : service.createProduct(value);
}
async function update<T extends object>(
  input: unknown,
  schema: { validate(input: unknown, options: object): Promise<T> },
  action: (id: string, value: T) => Promise<FetcherResult<unknown>>,
) {
  const error = await authorizeManagement();
  if (error) return error;
  const id = await validate(productIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(schema, input);
  return 'isSuccess' in value ? value : action(id.id, value);
}
export async function updateProductBaseInfoAction(input: unknown) {
  return update(input, updateProductBaseInfoSchema, service.updateProductBaseInfo);
}
export async function updateProductImagesAction(input: unknown) {
  return update(input, updateProductImagesSchema, service.updateProductImages);
}
export async function updateProductPriceAction(input: unknown) {
  return update(input, updateProductPriceSchema, service.updateProductPrice);
}
export async function enableProductAction(input: unknown) {
  return managementSection(input, service.enableProduct);
}
export async function disableProductAction(input: unknown) {
  return managementSection(input, service.disableProduct);
}
export async function deleteProductAction(input: unknown) {
  const error = await authorizeAdmin();
  if (error) return error;
  const value = await validate(productIdSchema, input);
  return 'isSuccess' in value ? value : service.deleteProduct(value.id);
}
