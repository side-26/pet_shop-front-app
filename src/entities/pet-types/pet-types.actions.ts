'use server';

import { ValidationError } from 'yup';
import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import { deleteImage } from '@/entities/images/images.service';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getRichTextImageUrls } from '@/lib/rich-text';
import { getSession } from '@/utils/session';
import {
  petTypeIdSchema,
  petTypeQuerySchema,
  petTypeSchema,
  rangePetTypePropertyDefinitionsSchema,
  updatePetTypeSchema,
} from './pet-types.schema';
import * as service from './pet-types.service';

const accessError = (message: string): FetcherError => ({
  isSuccess: false,
  message,
  data: { messages: {}, details: {} },
});
async function authorize() {
  const session = await getSession();
  return session?.role === USER_ROLES.ADMIN
    ? null
    : accessError('شما اجازه مدیریت نوع حیوان را ندارید.');
}
async function validate<T>(
  schema: { validate: (input: unknown, options: object) => Promise<T> },
  input: unknown,
) {
  try {
    return await schema.validate(input, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}
export async function getAllPetTypesAction(input: unknown = {}) {
  const denied = await authorize();
  if (denied) return denied;
  const query = await validate(petTypeQuerySchema, input);
  return 'isSuccess' in query ? query : service.getAllPetTypes(query);
}
export async function getAllPetTypesForBreedAction() {
  return service.getAllPetTypesForBreed();
}
export async function getPetTypeByIdAction(input: unknown) {
  const denied = await authorize();
  if (denied) return denied;
  const value = await validate(petTypeIdSchema, input);
  return 'isSuccess' in value ? value : service.getPetTypeById(value.id);
}
export async function getPetTypePropertyDefinitionsAction(input: unknown) {
  const denied = await authorize();
  if (denied) return denied;
  const value = await validate(petTypeIdSchema, input);
  return 'isSuccess' in value ? value : service.getPetTypePropertyDefinitions(value.id);
}
export async function createPetTypeAction(input: unknown) {
  const denied = await authorize();
  if (denied) return denied;
  const value = await validate(petTypeSchema, input);
  return 'isSuccess' in value ? value : service.createPetType(value);
}
export async function updatePetTypeAction(input: unknown) {
  const denied = await authorize();
  if (denied) return denied;
  const id = await validate(petTypeIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(updatePetTypeSchema, input);
  return 'isSuccess' in value ? value : service.updatePetType(id.id, value);
}
export async function rangePetTypePropertyDefinitionsAction(input: unknown) {
  const denied = await authorize();
  if (denied) return denied;
  const value = await validate(rangePetTypePropertyDefinitionsSchema, input);
  return 'isSuccess' in value ? value : service.rangePetTypePropertyDefinitions(value);
}
export async function enablePetTypeAction(input: unknown) {
  return status(input, service.enablePetType);
}
export async function disablePetTypeAction(input: unknown) {
  return status(input, service.disablePetType);
}
export async function deletePetTypeAction(input: unknown) {
  const denied = await authorize();
  if (denied) return denied;
  const value = await validate(petTypeIdSchema, input);
  if ('isSuccess' in value) return value;

  const petType = await service.getPetTypeById(value.id);
  const result = await service.deletePetType(value.id);
  if (result.isSuccess && petType.isSuccess) {
    await Promise.allSettled(
      getRichTextImageUrls(petType.data.description).map((imageUrl) => deleteImage({ imageUrl })),
    );
  }
  return result;
}
async function status<T>(input: unknown, action: (id: string) => Promise<T>) {
  const denied = await authorize();
  if (denied) return denied;
  const value = await validate(petTypeIdSchema, input);
  return 'isSuccess' in value ? value : action(value.id);
}
