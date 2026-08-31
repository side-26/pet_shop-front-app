'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  categoryIdSchema,
  categoryQuerySchema,
  categorySchema,
  updateCategorySchema,
} from './categories.schema';
import * as service from './categories.service';

function accessError(message: string): FetcherError {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
}

async function authorizeAuthenticated() {
  return (await getSession()) ? null : accessError('برای مشاهده دسته‌بندی‌ها وارد حساب شوید.');
}

async function authorizeAdmin() {
  return (await getSession())?.role === USER_ROLES.ADMIN
    ? null
    : accessError('شما اجازه مدیریت دسته‌بندی‌ها را ندارید.');
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

export async function getAllCategoriesAction(input: unknown = {}) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const query = await validate(categoryQuerySchema, input);
  return 'isSuccess' in query ? query : service.getAllCategories(query);
}

export async function getCategoryByIdAction(input: unknown) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const value = await validate(categoryIdSchema, input);
  return 'isSuccess' in value ? value : service.getCategoryById(value.id);
}

export async function createCategoryAction(input: unknown) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const value = await validate(categorySchema, input);
  return 'isSuccess' in value ? value : service.createCategory(value);
}

export async function updateCategoryAction(input: unknown) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const id = await validate(categoryIdSchema, input);
  if ('isSuccess' in id) return id;

  const value = await validate(updateCategorySchema, input);
  return 'isSuccess' in value ? value : service.updateCategory(id.id, value);
}

async function runById<T>(input: unknown, action: (id: string) => Promise<T>) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const value = await validate(categoryIdSchema, input);
  return 'isSuccess' in value ? value : action(value.id);
}

export async function enableCategoryAction(input: unknown) {
  return runById(input, service.enableCategory);
}

export async function disableCategoryAction(input: unknown) {
  return runById(input, service.disableCategory);
}

export async function deleteCategoryAction(input: unknown) {
  return runById(input, service.deleteCategory);
}
