import { array, boolean, mixed, object, string, type InferType } from 'yup';

import {
  MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  MAIN_IMAGE_UPLOAD_MIME_TYPES,
} from '@/configs/main-image-upload';
import { yupMessage } from '@/configs/yup.config';

const imageFileSchema = mixed<File>()
  .test('required', yupMessage('petTypeImageRequired'), (value) => value instanceof File)
  .test(
    'type',
    yupMessage('imageType'),
    (value) =>
      !value ||
      MAIN_IMAGE_UPLOAD_MIME_TYPES.includes(
        value.type as (typeof MAIN_IMAGE_UPLOAD_MIME_TYPES)[number],
      ),
  )
  .test(
    'size',
    yupMessage('imageSize'),
    (value) => !value || value.size <= MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  );

export const petTypeIdSchema = object({
  id: string()
    .trim()
    .matches(/^[a-f\d]{24}$/i)
    .required(),
});

export const petTypeQuerySchema = object({
  includeDisabled: boolean().default(true).required(),
});

export const petTypeSchema = object({
  title: string().trim().min(2).max(20).required(),
  description: string().trim().max(150).default(''),
  mainImage: imageFileSchema.required(),
});

// The API replaces the main image on every update, so it is required in both dialogs.
export const updatePetTypeSchema = petTypeSchema;

const propertyDefinitionValueSchema = mixed<string | number>()
  .transform((value, originalValue) =>
    typeof originalValue === 'string' ? originalValue.trim() : value,
  )
  .test(
    'valid-property-definition-value',
    yupMessage('petTypePropertyValue'),
    (value) =>
      (typeof value === 'string' && value.length > 0) ||
      (typeof value === 'number' && Number.isFinite(value)),
  )
  .required();

export const petTypePropertyDefinitionSchema = object({
  label: string().trim().min(1).required(),
  value: propertyDefinitionValueSchema,
});

export const rangePetTypePropertyDefinitionsSchema = petTypeIdSchema.concat(
  object({
    propertyDefinitions: array(petTypePropertyDefinitionSchema).required(),
  }),
);

export const petTypePropertyDefinitionsFormSchema = object({
  propertyDefinitions: array(petTypePropertyDefinitionSchema).required(),
});

export type PetTypeIdInput = InferType<typeof petTypeIdSchema>;
export type PetTypeQueryInput = InferType<typeof petTypeQuerySchema>;
export type PetTypeInput = InferType<typeof petTypeSchema>;
export type UpdatePetTypeInput = InferType<typeof updatePetTypeSchema>;
export type PetTypePropertyDefinitionInput = InferType<typeof petTypePropertyDefinitionSchema>;
export type RangePetTypePropertyDefinitionsInput = InferType<
  typeof rangePetTypePropertyDefinitionsSchema
>;
export type PetTypePropertyDefinitionsFormInput = InferType<
  typeof petTypePropertyDefinitionsFormSchema
>;
