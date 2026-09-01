import { object, string, type InferType } from 'yup';

import '@/configs/yup.config';

const objectIdSchema = string()
  .trim()
  .matches(/^[a-f\d]{24}$/i)
  .required();

export const subCategoryIdSchema = object({ id: objectIdSchema });

export const subCategoryQuerySchema = object({
  category: string()
    .trim()
    .matches(/^[a-f\d]{24}$/i)
    .optional(),
});

export const subCategorySchema = object({
  title: string().trim().min(2).max(50).required(),
  category: objectIdSchema,
});

export const updateSubCategorySchema = subCategorySchema.clone();

export type SubCategoryIdInput = InferType<typeof subCategoryIdSchema>;
export type SubCategoryQueryInput = InferType<typeof subCategoryQuerySchema>;
export type SubCategoryInput = InferType<typeof subCategorySchema>;
export type UpdateSubCategoryInput = InferType<typeof updateSubCategorySchema>;
