import * as yup from 'yup';

const objectIdSchema = yup
  .string()
  .trim()
  .matches(/^[a-f\d]{24}$/i, 'شناسه معتبر نیست.')
  .required('شناسه الزامی است.');

export const categoryIdSchema = yup.object({ id: objectIdSchema });

export const categoryQuerySchema = yup.object({
  includeDisabled: yup.boolean().default(false).required(),
  petType: yup
    .string()
    .trim()
    .matches(/^[a-f\d]{24}$/i, 'شناسه نوع حیوان معتبر نیست.')
    .optional(),
});

export const categorySchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, 'عنوان دسته‌بندی باید حداقل ۲ نویسه باشد.')
    .max(50, 'عنوان دسته‌بندی نمی‌تواند بیشتر از ۵۰ نویسه باشد.')
    .required('عنوان دسته‌بندی الزامی است.'),
  petType: objectIdSchema.label('نوع حیوان'),
  enable: yup.boolean().default(true).required(),
});

export const updateCategorySchema = categorySchema.shape({
  enable: yup.boolean().optional(),
});

export type CategoryIdInput = yup.InferType<typeof categoryIdSchema>;
export type CategoryQueryInput = yup.InferType<typeof categoryQuerySchema>;
export type CategoryInput = yup.InferType<typeof categorySchema>;
export type UpdateCategoryInput = yup.InferType<typeof updateCategorySchema>;
