'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  subCategoryIdSchema,
  subCategoryQuerySchema,
  subCategorySchema,
  updateSubCategorySchema,
} from './sub-categories.schema';
import * as service from './sub-categories.service';

function accessError(message: string): FetcherError {
  return { isSuccess: false, message, data: { messages: {}, details: {} } };
}

async function authorizeAuthenticated() {
  return (await getSession()) ? null : accessError('برای مشاهده زیر دسته‌بندی‌ها وارد حساب شوید.');
}

async function authorizeAdmin() {
  return (await getSession())?.role === USER_ROLES.ADMIN
    ? null
    : accessError('شما اجازه مدیریت زیر دسته‌بندی‌ها را ندارید.');
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

export async function getAllSubCategoriesAction(input: unknown = {}) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const query = await validate(subCategoryQuerySchema, input);
  return 'isSuccess' in query ? query : service.getAllSubCategories(query);
}

export async function getSubCategoryByIdAction(input: unknown) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const value = await validate(subCategoryIdSchema, input);
  return 'isSuccess' in value ? value : service.getSubCategoryById(value.id);
}

export async function createSubCategoryAction(input: unknown) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const value = await validate(subCategorySchema, input);
  return 'isSuccess' in value ? value : service.createSubCategory(value);
}

export async function updateSubCategoryAction(input: unknown) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const id = await validate(subCategoryIdSchema, input);
  if ('isSuccess' in id) return id;

  const value = await validate(updateSubCategorySchema, input);
  return 'isSuccess' in value ? value : service.updateSubCategory(id.id, value);
}

export async function deleteSubCategoryAction(input: unknown) {
  const denied = await authorizeAdmin();
  if (denied) return denied;

  const value = await validate(subCategoryIdSchema, input);
  return 'isSuccess' in value ? value : service.deleteSubCategory(value.id);
}
