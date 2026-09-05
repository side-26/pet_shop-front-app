import { array, boolean, mixed, number, object, string, type InferType } from 'yup';

import '@/configs/yup.config';
import {
  MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  MAIN_IMAGE_UPLOAD_MIME_TYPES,
} from '@/configs/main-image-upload';
import { yupMessage } from '@/configs/yup.config';
import {
  isOptionalRichTextDocument,
  isRichTextDocument,
  type RichTextFormValue,
} from '@/lib/rich-text';

const objectId = string()
  .trim()
  .matches(/^[a-f\d]{24}$/i)
  .required();
const productImage = mixed<File>()
  .test(
    'type',
    yupMessage('imageType'),
    (value) =>
      !value ||
      MAIN_IMAGE_UPLOAD_MIME_TYPES.includes(
        value.type as (typeof MAIN_IMAGE_UPLOAD_MIME_TYPES)[number],
      ),
  )
  .test(
    'size',
    yupMessage('imageSize'),
    (value) => !value || value.size <= MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES,
  );
const productImagesUpload = object({
  images: array(productImage.required()).min(1).max(5).required(),
  mainImageIndex: number().integer().min(0).required(),
}).test('main-image-index', 'تصویر اصلی باید از میان تصاویر انتخاب‌شده باشد.', (value) =>
  Boolean(value && value.mainImageIndex >= 0 && value.mainImageIndex < value.images.length),
);

const productFields = {
  title: string().trim().min(2).max(150).required(),
  summary: string().trim().max(500).optional(),
  description: mixed<RichTextFormValue>()
    .test('structured-json', 'توضیحات باید به صورت JSON ساخت‌یافته ارسال شود.', isRichTextDocument)
    .required(),
  category: objectId,
  subCategory: objectId.nullable().optional(),
  quantity: number().integer().min(0).default(0).required(),
};

export const productIdSchema = object({ id: objectId });
export const productSchema = object({ ...productFields, images: productImagesUpload.required() });
export const updateProductBaseInfoSchema = object({
  title: string().trim().min(2).max(150).optional(),
  summary: string().trim().max(500).optional(),
  description: mixed<RichTextFormValue>()
    .test(
      'structured-json',
      'توضیحات باید به صورت JSON ساخت‌یافته ارسال شود.',
      isOptionalRichTextDocument,
    )
    .optional(),
  category: objectId.optional(),
  subCategory: objectId.nullable().optional(),
  quantity: number().integer().min(0).optional(),
}).test('has-update', 'حداقل یک مقدار برای ویرایش لازم است.', (value) =>
  Boolean(value && Object.values(value).some((item) => item !== undefined)),
);
export const updateProductImagesSchema = object({ images: productImagesUpload.required() });
export const updateProductPriceSchema = object({
  price: number().min(0).optional(),
  discountPercentage: number().min(0).max(100).optional(),
}).test('has-update', 'حداقل یک مقدار برای ویرایش لازم است.', (value) =>
  Boolean(value && Object.values(value).some((item) => item !== undefined)),
);

const queryFields = {
  title: string().trim().max(150).optional(),
  search: string().trim().max(150).optional(),
  category: objectId.optional(),
  subCategory: objectId.optional(),
  quantity: number().integer().min(0).optional(),
  price: number().min(0).optional(),
  isEnable: boolean().optional(),
  page: number().integer().min(1).default(1).required(),
  limit: number().integer().min(1).max(100).default(10).required(),
  sort: mixed<'title' | 'createdAt' | 'updatedAt' | 'price' | 'quantity'>()
    .oneOf(['title', 'createdAt', 'updatedAt', 'price', 'quantity'])
    .default('createdAt')
    .required(),
};
export const customerProductQuerySchema = object(queryFields);
export const managementProductQuerySchema = object({
  ...queryFields,
  includeDisabled: boolean().default(false).required(),
});

export type ProductIdInput = InferType<typeof productIdSchema>;
export type ProductInput = InferType<typeof productSchema>;
export type UpdateProductBaseInfoInput = InferType<typeof updateProductBaseInfoSchema>;
export type UpdateProductImagesInput = InferType<typeof updateProductImagesSchema>;
export type UpdateProductPriceInput = InferType<typeof updateProductPriceSchema>;
export type CustomerProductQueryInput = InferType<typeof customerProductQuerySchema>;
export type ManagementProductQueryInput = InferType<typeof managementProductQuerySchema>;
