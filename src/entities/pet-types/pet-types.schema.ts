import * as yup from 'yup';

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
});

export const updatePetTypeSchema = petTypeSchema.partial();

export type PetTypeIdInput = yup.InferType<typeof petTypeIdSchema>;
export type PetTypeQueryInput = yup.InferType<typeof petTypeQuerySchema>;
export type PetTypeInput = yup.InferType<typeof petTypeSchema>;
export type UpdatePetTypeInput = yup.InferType<typeof updatePetTypeSchema>;
