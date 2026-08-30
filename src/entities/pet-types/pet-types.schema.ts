import * as yup from 'yup';

export const PET_TYPE_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const PET_TYPE_IMAGE_ACCEPT_TYPES = [
  ...PET_TYPE_IMAGE_MIME_TYPES,
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
] as const;
export const PET_TYPE_IMAGE_MAX_SIZE_BYTES = 1024 * 1024;

const imageFileSchema = yup
  .mixed<File>()
  .test('required', 'تصویر اصلی نوع حیوان الزامی است.', (value) => value instanceof File)
  .test(
    'type',
    'فرمت تصویر باید JPEG، PNG یا WebP باشد.',
    (value) =>
      !value ||
      PET_TYPE_IMAGE_MIME_TYPES.includes(value.type as (typeof PET_TYPE_IMAGE_MIME_TYPES)[number]),
  )
  .test(
    'size',
    'حجم تصویر نمی‌تواند بیشتر از ۱ مگابایت باشد.',
    (value) => !value || value.size <= PET_TYPE_IMAGE_MAX_SIZE_BYTES,
  );

export const petTypeIdSchema = yup.object({
  id: yup
    .string()
    .trim()
    .matches(/^[a-f\d]{24}$/i, 'شناسه نوع حیوان معتبر نیست.')
    .required(),
});

export const petTypeQuerySchema = yup.object({
  includeDisabled: yup.boolean().default(true).required(),
});

export const petTypeSchema = yup.object({
  title: yup.string().trim().min(2).max(20).required('عنوان نوع حیوان الزامی است.'),
  description: yup.string().trim().max(150).default(''),
  mainImage: imageFileSchema.required(),
});

// The API replaces the main image on every update, so it is required in both dialogs.
export const updatePetTypeSchema = petTypeSchema;

const propertyDefinitionValueSchema = yup
  .mixed<string | number>()
  .transform((value, originalValue) =>
    typeof originalValue === 'string' ? originalValue.trim() : value,
  )
  .test(
    'valid-property-definition-value',
    'مقدار مشخصات باید متنِ غیرخالی یا عدد معتبر باشد.',
    (value) =>
      (typeof value === 'string' && value.length > 0) ||
      (typeof value === 'number' && Number.isFinite(value)),
  )
  .required('مقدار مشخصات الزامی است.');

export const petTypePropertyDefinitionSchema = yup.object({
  label: yup.string().trim().min(1, 'عنوان مشخصات نمی‌تواند خالی باشد.').required(),
  value: propertyDefinitionValueSchema,
});

export const rangePetTypePropertyDefinitionsSchema = petTypeIdSchema.concat(
  yup.object({
    propertyDefinitions: yup.array(petTypePropertyDefinitionSchema).required(),
  }),
);

export const petTypePropertyDefinitionsFormSchema = yup.object({
  propertyDefinitions: yup.array(petTypePropertyDefinitionSchema).required(),
});

export type PetTypeIdInput = yup.InferType<typeof petTypeIdSchema>;
export type PetTypeQueryInput = yup.InferType<typeof petTypeQuerySchema>;
export type PetTypeInput = yup.InferType<typeof petTypeSchema>;
export type UpdatePetTypeInput = yup.InferType<typeof updatePetTypeSchema>;
export type PetTypePropertyDefinitionInput = yup.InferType<typeof petTypePropertyDefinitionSchema>;
export type RangePetTypePropertyDefinitionsInput = yup.InferType<
  typeof rangePetTypePropertyDefinitionsSchema
>;
export type PetTypePropertyDefinitionsFormInput = yup.InferType<
  typeof petTypePropertyDefinitionsFormSchema
>;
