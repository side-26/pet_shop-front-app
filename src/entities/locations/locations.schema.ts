import { number, object, type InferType } from 'yup';

import { yupLabel } from '@/configs/yup.config';

export const provinceIdSchema = object({
  provinceId: number().label(yupLabel('provinceId')).integer().positive().required(),
});

export type ProvinceIdInput = InferType<typeof provinceIdSchema>;

export const reverseGeocodeSchema = object({
  lat: number().label(yupLabel('latitude')).min(-90).max(90).required(),
  lng: number().label(yupLabel('longitude')).min(-180).max(180).required(),
});

export type ReverseGeocodeInput = InferType<typeof reverseGeocodeSchema>;
