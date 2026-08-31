import * as yup from 'yup';

const objectId = yup
  .string()
  .trim()
  .required('شناسه الزامی است.')
  .matches(/^[a-f\d]{24}$/i, 'شناسه معتبر نیست.');
const image = yup
  .mixed<File>()
  .required('تصویر اصلی الزامی است.')
  .test(
    'size',
    'حجم تصویر باید حداکثر ۱ مگابایت باشد.',
    (file) => !file || file.size <= 1024 * 1024,
  )
  .test(
    'type',
    'فرمت تصویر باید JPEG، PNG یا WebP باشد.',
    (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
  );

export const breedIdSchema = yup.object({ id: objectId });
export const breedSchema = yup.object({
  title: yup.string().trim().required('عنوان الزامی است.').min(2).max(100),
  petType: objectId,
  country: yup.string().trim().nullable().max(100),
  ageAverage: yup.string().trim().required('میانگین سن الزامی است.').max(50),
  size: yup.number().integer().required('اندازه الزامی است.').oneOf([1, 2, 3, 4, 5]),
  activityLevel: yup.number().integer().nullable().oneOf([1, 2, 3, 4, 5, null]),
  enable: yup.boolean().required(),
  mainImage: image,
});
export const updateBreedSchema = breedSchema;
const propertyDefinitionValueSchema = yup
  .mixed<string | number>()
  .transform((value, originalValue) =>
    typeof originalValue === 'string' ? originalValue.trim() : value,
  )
  .test(
    'valid-property-definition-value',
    'مقدار ویژگی باید متنِ غیرخالی یا عدد معتبر باشد.',
    (value) =>
      (typeof value === 'string' && value.length > 0) ||
      (typeof value === 'number' && Number.isFinite(value)),
  )
  .required('مقدار ویژگی الزامی است.');

export const breedPropertyDefinitionSchema = yup.object({
  label: yup.string().trim().min(1, 'عنوان ویژگی نمی‌تواند خالی باشد.').required(),
  value: propertyDefinitionValueSchema,
});

export const replaceBreedPropertyDefinitionsSchema = breedIdSchema.concat(
  yup.object({
    propertyDefinitions: yup.array(breedPropertyDefinitionSchema).max(50).required(),
  }),
);

export const breedPropertyDefinitionsFormSchema = yup.object({
  propertyDefinitions: yup.array(breedPropertyDefinitionSchema).max(50).required(),
});
export const breedQuerySchema = yup.object({
  petType: yup
    .string()
    .trim()
    .matches(/^[a-f\d]{24}$/i)
    .optional(),
  includeDisabled: yup.boolean().default(true),
  search: yup.string().trim().max(100).optional(),
  page: yup.number().integer().min(1).default(1).required(),
  limit: yup.number().integer().min(1).default(20).required(),
  sort: yup
    .mixed<'title' | 'createdAt' | 'updatedAt'>()
    .oneOf(['title', 'createdAt', 'updatedAt'])
    .default('title'),
});
export type BreedInput = yup.InferType<typeof breedSchema>;
export type BreedQueryInput = yup.InferType<typeof breedQuerySchema>;
export type BreedPropertyDefinitionsInput = yup.InferType<
  typeof replaceBreedPropertyDefinitionsSchema
>;
export type BreedPropertyDefinitionsFormInput = yup.InferType<
  typeof breedPropertyDefinitionsFormSchema
>;
