import { mixed, object, string, type InferType } from 'yup';

import { yupMessage } from '@/configs/yup.config';

// Mirrors the backend `imageUpload` middleware used by POST /images.
const IMAGE_UPLOAD_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const IMAGE_UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const uploadImageSchema = object({
  mainImage: mixed<File>()
    .test(
      'type',
      yupMessage('imageType'),
      (value) =>
        value instanceof File &&
        IMAGE_UPLOAD_MIME_TYPES.includes(value.type as (typeof IMAGE_UPLOAD_MIME_TYPES)[number]),
    )
    .test(
      'size',
      yupMessage('imageSize'),
      (value) => value instanceof File && value.size <= IMAGE_UPLOAD_MAX_SIZE_BYTES,
    )
    .required(),
});

export const deleteImageSchema = object({
  imageUrl: string().url().max(2048).required(),
}).noUnknown();

export type UploadImageInput = InferType<typeof uploadImageSchema>;
export type DeleteImageInput = InferType<typeof deleteImageSchema>;
