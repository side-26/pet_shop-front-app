import { boolean, mixed, object, string, type InferType } from 'yup';

import {
  MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  MAIN_IMAGE_UPLOAD_MIME_TYPES,
} from '@/configs/main-image-upload';
import { yupMessage } from '@/configs/yup.config';

const objectIdSchema = string()
  .trim()
  .matches(/^[a-f\d]{24}$/i)
  .required();

const logoSchema = mixed<File>()
  .nullable()
  .optional()
  .test(
    'type',
    yupMessage('imageType'),
    (file) =>
      !file ||
      MAIN_IMAGE_UPLOAD_MIME_TYPES.includes(
        file.type as (typeof MAIN_IMAGE_UPLOAD_MIME_TYPES)[number],
      ),
  )
  .test(
    'size',
    yupMessage('imageSize'),
    (file) => !file || file.size <= MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  );

type BrandDescription = string | Record<string, unknown>;

export const brandIdSchema = object({ id: objectIdSchema });
export const brandQuerySchema = object({ includeDisabled: boolean().default(false).required() });
export const brandSchema = object({
  title: string().trim().min(2).max(100).required(),
  title_fa: string().trim().min(2).max(100).required(),
  description: mixed<BrandDescription>().default(''),
  isEnable: boolean().default(true).required(),
  logo: logoSchema,
});

export type BrandIdInput = InferType<typeof brandIdSchema>;
export type BrandQueryInput = InferType<typeof brandQuerySchema>;
export type BrandInput = InferType<typeof brandSchema>;
