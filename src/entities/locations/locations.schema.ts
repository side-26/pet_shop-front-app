import { number, object, type InferType } from 'yup';

import { yupLabel } from '@/configs/yup.config';

export const provinceIdSchema = object({
  provinceId: number().label(yupLabel('provinceId')).integer().positive().required(),
});

export type ProvinceIdInput = InferType<typeof provinceIdSchema>;
