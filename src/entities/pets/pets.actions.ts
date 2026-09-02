'use server';

import { ValidationError } from 'yup';

import { USER_ROLES } from '@/configs/user-role';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';
import { getAllPetTypes } from '@/entities/pet-types/pet-types.service';

import {
  customerPetQuerySchema,
  customerPetPaginateQuerySchema,
  managementPetQuerySchema,
  petIdSchema,
  petSchema,
  updatePetBaseInfoSchema,
  updatePetImagesSchema,
  updatePetPriceSchema,
} from './pets.schema';
import * as service from './pets.service';

const denied = (message: string): FetcherError => ({
  isSuccess: false,
  message,
  data: { messages: {}, details: {} },
});

async function authorizeManagement() {
  const role = (await getSession())?.role;
  return role === USER_ROLES.ADMIN || role === USER_ROLES.SELLER
    ? null
    : denied('شما اجازه مدیریت حیوانات را ندارید.');
}

async function authorizeAdmin() {
  return (await getSession())?.role === USER_ROLES.ADMIN
    ? null
    : denied('شما اجازه حذف حیوانات را ندارید.');
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

export async function getCustomerPetsAction(input: unknown = {}) {
  const value = await validate(customerPetQuerySchema, input);
  return 'isSuccess' in value ? value : service.getCustomerPets(value);
}

export async function getCustomerPetAction(input: unknown) {
  const value = await validate(petIdSchema, input);
  return 'isSuccess' in value ? value : service.getCustomerPet(value.id);
}

export async function getCustomerPetsPageAction(input: unknown = {}) {
  const value = await validate(customerPetPaginateQuerySchema, input);
  return 'isSuccess' in value ? value : service.getCustomerPetsPage(value);
}

export async function getManagementPetsAction(input: unknown = {}) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(managementPetQuerySchema, input);
  return 'isSuccess' in value ? value : service.getManagementPets(value);
}

export async function getManagementPetAction(input: unknown) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(petIdSchema, input);
  return 'isSuccess' in value ? value : service.getManagementPet(value.id);
}

export async function getPetFormOptionsAction() {
  const error = await authorizeManagement();
  if (error) return error;
  const petTypes = await getAllPetTypes({ includeDisabled: false });
  if (!petTypes.isSuccess) return petTypes;
  return {
    isSuccess: true as const,
    message: null,
    data: {
      petTypes: petTypes.data.map(({ id, title, mainImage }) => ({ id, title, image: mainImage })),
    },
  };
}

async function getManagementSection<T>(input: unknown, action: (id: string) => Promise<T>) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(petIdSchema, input);
  return 'isSuccess' in value ? value : action(value.id);
}

export async function getPetBaseInfoAction(input: unknown) {
  return getManagementSection(input, service.getPetBaseInfo);
}

export async function getPetImagesAction(input: unknown) {
  return getManagementSection(input, service.getPetImages);
}

export async function getPetPriceAction(input: unknown) {
  return getManagementSection(input, service.getPetPrice);
}

export async function createPetAction(input: unknown) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(petSchema, input);
  return 'isSuccess' in value ? value : service.createPet(value);
}

async function changePetAction<T extends object>(
  input: unknown,
  schema: { validate(input: unknown, options: object): Promise<T> },
  action: (id: string, value: T) => Promise<FetcherResult<unknown>>,
) {
  const error = await authorizeManagement();
  if (error) return error;
  const id = await validate(petIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(schema, input);
  return 'isSuccess' in value ? value : action(id.id, value);
}

export async function updatePetBaseInfoAction(input: unknown) {
  return changePetAction(input, updatePetBaseInfoSchema, service.updatePetBaseInfo);
}

export async function updatePetImagesAction(input: unknown) {
  return changePetAction(input, updatePetImagesSchema, service.updatePetImages);
}

export async function updatePetPriceAction(input: unknown) {
  return changePetAction(input, updatePetPriceSchema, service.updatePetPrice);
}

async function managementById<T>(input: unknown, action: (id: string) => Promise<T>) {
  const error = await authorizeManagement();
  if (error) return error;
  const value = await validate(petIdSchema, input);
  return 'isSuccess' in value ? value : action(value.id);
}

export async function enablePetAction(input: unknown) {
  return managementById(input, service.enablePet);
}

export async function disablePetAction(input: unknown) {
  return managementById(input, service.disablePet);
}

export async function deletePetAction(input: unknown) {
  const error = await authorizeAdmin();
  if (error) return error;
  const value = await validate(petIdSchema, input);
  return 'isSuccess' in value ? value : service.deletePet(value.id);
}
