import { array, boolean, mixed, object, string, type InferType } from 'yup';

import { yupMessage } from '@/configs/yup.config';

export const PET_TYPE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const PET_TYPE_IMAGE_ACCEPT_TYPES = [
  ...PET_TYPE_IMAGE_MIME_TYPES,
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
] as const;
export const PET_TYPE_IMAGE_MAX_SIZE_BYTES = 1024 * 1024;

const imageFileSchema = mixed<File>()
  .test('required', yupMessage('petTypeImageRequired'), (value) => value instanceof File)
  .test(
    'type',
    yupMessage('imageType'),
    (value) =>
      !value ||
      PET_TYPE_IMAGE_MIME_TYPES.includes(value.type as (typeof PET_TYPE_IMAGE_MIME_TYPES)[number]),
  )
  .test(
    'size',
    yupMessage('imageSize'),
    (value) => !value || value.size <= PET_TYPE_IMAGE_MAX_SIZE_BYTES,
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
