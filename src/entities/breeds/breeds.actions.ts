'use server';
import { ValidationError } from 'yup';
import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';
import {
  breedIdSchema,
  breedQuerySchema,
  breedSchema,
  replaceBreedPropertyDefinitionsSchema,
  updateBreedSchema,
} from './breeds.schema';
import * as service from './breeds.service';
const denied = (message: string): FetcherError => ({
  isSuccess: false,
  message,
  data: { messages: {}, details: {} },
});
async function admin() {
  return (await getSession())?.role === USER_ROLES.ADMIN
    ? null
    : denied('اجازه مدیریت نژادها را ندارید.');
}
async function management() {
  const role = (await getSession())?.role;
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER
    ? null
    : denied('اجازه مشاهده نژادها را ندارید.');
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
export async function getBreedsPageAction(input: unknown = {}) {
  const error = await management();
  if (error) return error;
  const value = await validate(breedQuerySchema, input);
  return 'isSuccess' in value ? value : service.getBreedsPage(value);
}
export async function getBreedsAction(input: unknown = {}) {
  const error = await management();
  if (error) return error;
  const value = await validate(breedQuerySchema, input);
  return 'isSuccess' in value ? value : service.getBreeds(value);
}
export async function getBreedAction(input: unknown) {
  const error = await admin();
  if (error) return error;
  const value = await validate(breedIdSchema, input);
  return 'isSuccess' in value ? value : service.getBreed(value.id);
}
export async function getBreedPropertyDefinitionsAction(input: unknown) {
  const error = await admin();
  if (error) return error;
  const value = await validate(breedIdSchema, input);
  return 'isSuccess' in value ? value : service.getBreedPropertyDefinitions(value.id);
}
export async function createBreedAction(input: unknown) {
  const error = await admin();
  if (error) return error;
  const value = await validate(breedSchema, input);
  return 'isSuccess' in value ? value : service.createBreed(value);
}
export async function updateBreedAction(input: unknown) {
  const error = await admin();
  if (error) return error;
  const id = await validate(breedIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(updateBreedSchema, input);
  return 'isSuccess' in value ? value : service.updateBreed(id.id, value);
}
export async function replaceBreedPropertyDefinitionsAction(input: unknown) {
  const error = await admin();
  if (error) return error;
  const value = await validate(replaceBreedPropertyDefinitionsSchema, input);
  return 'isSuccess' in value ? value : service.replaceBreedPropertyDefinitions(value);
}
async function byId(input: unknown, fn: (id: string) => ReturnType<typeof service.deleteBreed>) {
  const error = await admin();
  if (error) return error;
  const value = await validate(breedIdSchema, input);
  return 'isSuccess' in value ? value : fn(value.id);
}
export async function enableBreedAction(input: unknown) {
  return byId(input, service.enableBreed);
}
export async function disableBreedAction(input: unknown) {
  return byId(input, service.disableBreed);
}
export async function deleteBreedAction(input: unknown) {
  return byId(input, service.deleteBreed);
}
