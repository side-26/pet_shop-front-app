import { boolean, mixed, object, string, type InferType } from 'yup';

import { yupMessage } from '@/configs/yup.config';
import {
  PET_TYPE_IMAGE_MAX_SIZE_BYTES,
  PET_TYPE_IMAGE_MIME_TYPES,
} from '@/entities/pet-types/pet-types.schema';

const objectIdSchema = string()
  .trim()
  .matches(/^[a-f\d]{24}$/i)
  .required();

export const categoryIdSchema = object({ id: objectIdSchema });

export const categoryQuerySchema = object({
  includeDisabled: boolean().default(false).required(),
  petType: string()
    .trim()
    .matches(/^[a-f\d]{24}$/i)
    .optional(),
});

const categoryMainImageSchema = mixed<File>()
  .test('required', yupMessage('imageRequired'), (value) => value instanceof File)
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

export const categorySchema = object({
  title: string().trim().min(2).max(50).required(),
  petType: objectIdSchema,
  mainImage: categoryMainImageSchema.required(),
  isEnable: boolean().default(true).required(),
});

export const updateCategorySchema = categorySchema;

export type CategoryIdInput = InferType<typeof categoryIdSchema>;
export type CategoryQueryInput = InferType<typeof categoryQuerySchema>;
export type CategoryInput = InferType<typeof categorySchema>;
export type UpdateCategoryInput = InferType<typeof updateCategorySchema>;
