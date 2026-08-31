import { boolean, object, string, type InferType } from 'yup';

import '@/configs/yup.config';

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

export const categorySchema = object({
  title: string().trim().min(2).max(50).required(),
  petType: objectIdSchema,
  enable: boolean().default(true).required(),
});

export const updateCategorySchema = categorySchema.shape({
  enable: boolean().optional(),
});

export type CategoryIdInput = InferType<typeof categoryIdSchema>;
export type CategoryQueryInput = InferType<typeof categoryQuerySchema>;
export type CategoryInput = InferType<typeof categorySchema>;
export type UpdateCategoryInput = InferType<typeof updateCategorySchema>;
