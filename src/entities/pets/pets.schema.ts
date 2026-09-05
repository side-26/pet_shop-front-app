import { array, boolean, mixed, number, object, string, type InferType } from 'yup';

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

const petImage = mixed<File>()
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

const petImagesUpload = object({
  images: array(petImage.required()).min(1).max(5).required(),
  mainImageIndex: number().integer().min(0).required(),
}).test('main-image-index', 'تصویر اصلی باید از میان تصاویر انتخاب‌شده باشد.', (value) =>
  Boolean(
    value &&
    value.images.length > 0 &&
    value.mainImageIndex >= 0 &&
    value.mainImageIndex < value.images.length,
  ),
);

const petFields = {
  title: string().trim().min(2).max(150).required(),
  images: petImagesUpload.required(),
  summary: string().trim().max(500).optional(),
  description: mixed<RichTextFormValue>()
    .test('structured-json', 'توضیحات باید به صورت JSON ساخت‌یافته ارسال شود.', isRichTextDocument)
    .required(),
  petType: objectId,
  breed: objectId,
  quantity: number().integer().min(0).default(0).required(),
  price: number().min(0).default(1000).required(),
  discountPercentage: number().min(0).max(100).default(0).required(),
  inEnable: boolean().default(true).required(),
  slug: string()
    .trim()
    .min(2)
    .max(160)
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
};

export function createPetSlug(title: string) {
  const normalized = title
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (normalized.length >= 2) return normalized.slice(0, 160).replace(/-+$/g, '');

  let hash = 2166136261;
  for (const character of title.trim()) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return `pet-${(hash >>> 0).toString(36)}`;
}

export const petIdSchema = object({ id: objectId });

export const petSchema = object({
  ...petFields,
}).transform((value) => ({
  ...value,
  slug: value.slug || createPetSlug(value.title ?? ''),
}));

export const updatePetBaseInfoSchema = object({
  title: string().trim().min(2).max(150).optional(),
  summary: string().trim().max(500).optional(),
  description: mixed<RichTextFormValue>()
    .test(
      'structured-json',
      'توضیحات باید به صورت JSON ساخت‌یافته ارسال شود.',
      isOptionalRichTextDocument,
    )
    .optional(),
  petType: objectId.optional(),
  breed: objectId.optional(),
  quantity: number().integer().min(0).optional(),
}).test('has-update', 'حداقل یک مقدار برای ویرایش لازم است.', (value) =>
  Boolean(value && Object.values(value).some((item) => item !== undefined)),
);

export const updatePetImagesSchema = object({
  images: petImagesUpload.required(),
});

export const updatePetPriceSchema = object({
  price: number().min(0).optional(),
  discountPercentage: number().min(0).max(100).optional(),
}).test('has-update', 'حداقل یک مقدار برای ویرایش لازم است.', (value) =>
  Boolean(value && Object.values(value).some((item) => item !== undefined)),
);

const petQueryFields = {
  title: string().trim().max(150).optional(),
  petType: objectId.optional(),
  breed: objectId.optional(),
  page: number().integer().min(1).default(1).required(),
  limit: number().integer().min(1).max(100).default(10).required(),
  sort: mixed<'title' | 'createdAt' | 'updatedAt' | 'price' | 'quantity'>()
    .oneOf(['title', 'createdAt', 'updatedAt', 'price', 'quantity'])
    .default('createdAt')
    .required(),
};

export const customerPetQuerySchema = object(petQueryFields);
export const managementPetQuerySchema = object({
  ...petQueryFields,
  quantity: number().integer().min(0).optional(),
  isEnable: boolean().optional(),
});

export const customerPetPaginateQuerySchema = object({
  ...petQueryFields,
  priceRange: string()
    .trim()
    .matches(/^\d+(?:\.\d+)?-\d+(?:\.\d+)?$/)
    .test('ordered-price-range', 'حداقل قیمت نباید بیشتر از حداکثر قیمت باشد.', (value) => {
      if (!value) return true;
      const [minimum, maximum] = value.split('-').map(Number);
      return minimum <= maximum;
    })
    .optional(),
});

export type PetIdInput = InferType<typeof petIdSchema>;
export type PetInput = InferType<typeof petSchema>;
export type UpdatePetBaseInfoInput = InferType<typeof updatePetBaseInfoSchema>;
export type UpdatePetImagesInput = InferType<typeof updatePetImagesSchema>;
export type UpdatePetPriceInput = InferType<typeof updatePetPriceSchema>;
export type CustomerPetQueryInput = InferType<typeof customerPetQuerySchema>;
export type CustomerPetPaginateQueryInput = InferType<typeof customerPetPaginateQuerySchema>;
export type ManagementPetQueryInput = InferType<typeof managementPetQuerySchema>;
