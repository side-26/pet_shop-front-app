import { array, boolean, mixed, number, object, string, type InferType } from 'yup';

import { yupMessage } from '@/configs/yup.config';

const objectId = string()
  .trim()
  .required()
  .matches(/^[a-f\d]{24}$/i);
const image = mixed<File>()
  .required(yupMessage('imageRequired'))
  .test('size', yupMessage('breedImageSize'), (file) => !file || file.size <= 1024 * 1024)
  .test(
    'type',
    yupMessage('imageType'),
    (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
  );

export const breedIdSchema = object({ id: objectId });
export const breedSchema = object({
  title: string().trim().required().min(2).max(100),
  petType: objectId,
  country: string().trim().nullable().max(100),
  ageAverage: string().trim().required().max(50),
  size: number().integer().required().oneOf([0, 1, 2, 3, 4]),
  activityLevel: number().integer().nullable().oneOf([0, 1, 2, 3, 4, null]),
  enable: boolean().required(),
  mainImage: image,
});
export const updateBreedSchema = breedSchema.shape({
  // Updating a breed may keep its stored image. Validate images on creation
  // only; the service appends this field exclusively for a newly selected File.
  mainImage: mixed<File>().nullable().optional(),
});
const propertyDefinitionValueSchema = mixed<string | number>()
  .transform((value, originalValue) =>
    typeof originalValue === 'string' ? originalValue.trim() : value,
  )
  .test(
    'valid-property-definition-value',
    yupMessage('propertyValue'),
    (value) =>
      (typeof value === 'string' && value.length > 0) ||
      (typeof value === 'number' && Number.isFinite(value)),
  )
  .required();

export const breedPropertyDefinitionSchema = object({
  label: string().trim().min(1).required(),
  value: propertyDefinitionValueSchema,
});

export const replaceBreedPropertyDefinitionsSchema = breedIdSchema.concat(
  object({
    propertyDefinitions: array(breedPropertyDefinitionSchema).max(50).required(),
  }),
);

export const breedPropertyDefinitionsFormSchema = object({
  propertyDefinitions: array(breedPropertyDefinitionSchema).max(50).required(),
});
export const breedQuerySchema = object({
  title: string().trim().min(1).max(100).optional(),
  petType: string()
    .trim()
    .matches(/^[a-f\d]{24}$/i)
    .optional(),
  country: string().trim().min(1).max(100).optional(),
  size: number().integer().min(0).max(4).optional(),
  activityLevel: number().integer().min(0).max(4).optional(),
  includeDisabled: boolean().default(true),
  search: string().trim().max(100).optional(),
  page: number().integer().min(1).default(1).required(),
  limit: number().integer().min(1).default(10).required(),
  sort: mixed<'title' | 'createdAt' | 'updatedAt'>()
    .oneOf(['title', 'createdAt', 'updatedAt'])
    .default('title'),
});
export type BreedInput = InferType<typeof breedSchema>;
export type UpdateBreedInput = InferType<typeof updateBreedSchema>;
export type BreedQueryInput = InferType<typeof breedQuerySchema>;
export type BreedPropertyDefinitionsInput = InferType<typeof replaceBreedPropertyDefinitionsSchema>;
export type BreedPropertyDefinitionsFormInput = InferType<
  typeof breedPropertyDefinitionsFormSchema
>;
