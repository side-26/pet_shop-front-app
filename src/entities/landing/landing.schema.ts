import { number, object, string, type InferType } from 'yup';

import '@/configs/yup.config';

export const landingSlugSchema = object({
  slug: string()
    .trim()
    .min(2)
    .max(160)
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
});

export const landingDiscountLimitSchema = object({
  limit: number().integer().min(1).max(100).default(4).required(),
});

export type LandingSlugInput = InferType<typeof landingSlugSchema>;
export type LandingDiscountLimitInput = InferType<typeof landingDiscountLimitSchema>;
