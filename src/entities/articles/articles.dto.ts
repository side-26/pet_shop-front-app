import { Expose, Type } from 'class-transformer';

import type { RichTextFormValue } from '@/lib/rich-text';
import { transform, transformMany } from '@/lib/transform';

import type {
  ArticleIdInput,
  ArticleSlugInput,
  CreateArticleInput,
  UpdateArticleInput,
  UpdateArticleMainTextInput,
  ReplaceArticleTagsInput,
} from './articles.schema';

export class ArticleTagDTO {
  @Expose()
  declare title: string;
}

export class ArticleAuthorDTO {
  @Expose()
  declare avatar: string;

  @Expose()
  declare placeholderImage: string;

  @Expose()
  declare firstName: string;

  @Expose()
  declare lastName: string;
}

export class ArticleDTO {
  @Expose()
  declare id: string;

  @Expose()
  declare title: string;

  @Expose()
  declare subtitle: string;

  @Expose()
  declare mainImage: string;

  @Expose()
  declare mainThumbnailImage: string;

  @Expose()
  declare summary: string;

  @Expose()
  @Type(() => ArticleTagDTO)
  declare tags: ArticleTagDTO[];

  @Expose()
  declare petType: string | null;

  @Expose()
  declare petTypeTitle: string | null;

  @Expose()
  declare mainText: RichTextFormValue;

  @Expose()
  @Type(() => ArticleAuthorDTO)
  declare author: ArticleAuthorDTO;

  @Expose()
  declare slug: string;

  @Expose()
  declare createdAt: string;

  @Expose()
  declare updatedAt: string;
}

export class ArticleDetailsDTO {
  @Expose()
  declare id: string;

  @Expose()
  declare title: string;

  @Expose()
  declare subtitle: string;

  @Expose()
  declare mainImage: string;

  @Expose()
  declare mainThumbnailImage: string;

  @Expose()
  declare summary: string;

  @Expose()
  @Type(() => ArticleTagDTO)
  declare tags: ArticleTagDTO[];

  @Expose()
  declare petType: string | null;

  @Expose()
  @Type(() => ArticleAuthorDTO)
  declare author: ArticleAuthorDTO;

  @Expose()
  declare slug: string;

  @Expose()
  declare createdAt: string;

  @Expose()
  declare updatedAt: string;
}

export class ArticleMainTextDTO {
  @Expose()
  declare mainText: RichTextFormValue;
}

export function toArticleDTO(value: unknown) {
  return transform(ArticleDTO, value);
}

export function toArticleDTOs(value: unknown) {
  if (!Array.isArray(value)) throw new TypeError('Expected an article array.');
  return transformMany(ArticleDTO, value);
}

export function toArticleDetailsDTO(value: unknown) {
  return transform(ArticleDetailsDTO, value);
}

export function toArticleMainTextDTO(value: unknown) {
  return transform(ArticleMainTextDTO, value);
}

export function toArticleTagsDTO(value: unknown) {
  if (!Array.isArray(value)) throw new TypeError('Expected an article tag array.');
  return transformMany(ArticleTagDTO, value);
}

export type ArticleIdDTO = ArticleIdInput;
export type ArticleSlugDTO = ArticleSlugInput;
export type CreateArticleDTO = CreateArticleInput;
export type UpdateArticleDTO = UpdateArticleInput;
export type UpdateArticleMainTextDTO = UpdateArticleMainTextInput;
export type ReplaceArticleTagsDTO = ReplaceArticleTagsInput;
