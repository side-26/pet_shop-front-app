import { array, mixed, object, string, type InferType } from 'yup';

import '@/configs/yup.config';
import { isRichTextDocument, type RichTextFormValue } from '@/lib/rich-text';

const objectIdSchema = string()
  .trim()
  .matches(/^[a-f\d]{24}$/i)
  .required();

const tagSchema = object({
  title: string().trim().min(1).max(60).required(),
});

const richTextSchema = mixed<RichTextFormValue>()
  .test('structured-json', 'متن اصلی باید به صورت JSON ساخت‌یافته ارسال شود.', isRichTextDocument)
  .required();

const articleDetailsFields = {
  title: string().trim().min(2).max(180),
  subtitle: string().trim().min(1).max(240),
  mainImage: string().trim().url().max(2048),
  mainThumbnailImage: string().trim().min(1).max(10240),
  summary: string().trim().max(600),
  tags: array(tagSchema).max(20),
  petType: objectIdSchema.optional(),
};

export const articleIdSchema = object({ id: objectIdSchema });

export const articleSlugSchema = object({
  slug: string().trim().min(1).max(300).required(),
});

export const createArticleSchema = object({
  ...articleDetailsFields,
  title: articleDetailsFields.title.required(),
  subtitle: articleDetailsFields.subtitle.required(),
  mainImage: articleDetailsFields.mainImage.required(),
  mainThumbnailImage: articleDetailsFields.mainThumbnailImage.required(),
  tags: articleDetailsFields.tags.default([]).required(),
  mainText: richTextSchema,
});

export const updateArticleSchema = object(articleDetailsFields)
  .partial()
  .test('at-least-one-field', 'حداقل یک فیلد باید ارسال شود.', (value) =>
    Boolean(value && Object.keys(value).length > 0),
  );

export const updateArticleMainTextSchema = object({ mainText: richTextSchema });

export type ArticleIdInput = InferType<typeof articleIdSchema>;
export type ArticleSlugInput = InferType<typeof articleSlugSchema>;
export type CreateArticleInput = InferType<typeof createArticleSchema>;
export type UpdateArticleInput = InferType<typeof updateArticleSchema>;
export type UpdateArticleMainTextInput = InferType<typeof updateArticleMainTextSchema>;
