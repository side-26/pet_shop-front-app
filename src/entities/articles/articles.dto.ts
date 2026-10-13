import { Exclude, Expose, Transform, Type, instanceToPlain } from 'class-transformer';

import type { RichTextFormValue } from '@/lib/rich-text';
import { transform, transformMany } from '@/lib/transform';
import type { PaginationDTO } from '@/entities/pagination/pagination.dto';

import type {
  ArticleIdInput,
  ArticlePaginationInput,
  ArticleListSort,
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

export type ArticleTagResponse = Readonly<{
  title: string;
}>;

function formatArticleJalaliIsoDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tehran',
  }).format(date);
}

export type ArticleAuthorDTO = Readonly<{
  image: string;
  thumbnailImage: string;
  fullName: string;
}>;

class ArticleAuthorTransformer {
  @Exclude({ toPlainOnly: true })
  @Expose({ name: 'avatar', toClassOnly: true })
  declare private sourceImage: string;

  @Exclude({ toPlainOnly: true })
  @Expose({ name: 'placeholderImage', toClassOnly: true })
  declare private sourceThumbnailImage: string;

  @Exclude({ toPlainOnly: true })
  @Expose({ name: 'firstName', toClassOnly: true })
  declare private sourceFirstName: string;

  @Exclude({ toPlainOnly: true })
  @Expose({ name: 'lastName', toClassOnly: true })
  declare private sourceLastName: string;

  @Expose()
  get image() {
    return this.sourceImage;
  }

  @Expose()
  get thumbnailImage() {
    return this.sourceThumbnailImage;
  }

  @Expose()
  get fullName() {
    return [this.sourceFirstName, this.sourceLastName].filter(Boolean).join(' ').trim();
  }
}

export class ArticlePetTypeDTO {
  @Expose()
  declare title: string;
}

export class ArticleCatalogPetTypeDTO {
  @Expose()
  declare _id: string;

  @Expose()
  declare title: string;
}

export class ArticleListSortOptionDTO {
  @Expose()
  declare value: ArticleListSort;

  @Expose()
  declare label: string;
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
  declare mainText: RichTextFormValue;

  @Expose()
  @Type(() => ArticleAuthorTransformer)
  declare author: ArticleAuthorDTO;

  @Expose()
  declare slug: string;

  @Expose()
  declare createdAt: string;

  @Expose()
  declare updatedAt: string;
}

export class ArticleListDTO {
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
  @Type(() => ArticlePetTypeDTO)
  declare petType: ArticlePetTypeDTO | null;

  @Expose()
  @Type(() => ArticleAuthorTransformer)
  declare author: ArticleAuthorDTO;

  @Expose()
  declare slug: string;

  @Expose()
  @Transform(({ value }) => formatArticleJalaliIsoDateTime(value), { toClassOnly: true })
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
  declare petType: string | null;

  @Expose()
  declare summary: string;

  @Expose()
  @Type(() => ArticleTagDTO)
  declare tags: ArticleTagDTO[];

  @Expose()
  @Type(() => ArticleAuthorTransformer)
  declare author: ArticleAuthorDTO;

  @Expose()
  declare slug: string;

  @Expose()
  declare createdAt: string;

  @Expose()
  declare updatedAt: string;
}

export type ArticleDetailsResponse = Readonly<{
  id: string;
  title: string;
  subtitle: string;
  mainImage: string;
  mainThumbnailImage: string;
  petType: string | null;
  summary: string;
  tags: ArticleTagResponse[];
  author: ArticleAuthorDTO;
  slug: string;
  createdAt: string;
  updatedAt: string;
}>;

export class ArticleMainTextDTO {
  @Expose()
  declare mainText: RichTextFormValue;
}

export type ArticleMainTextResponse = Readonly<{
  mainText: RichTextFormValue;
}>;

export type ArticleRelatedResponse = Readonly<{
  tags: ArticleTagResponse[];
  articles: ArticleDetailsDTO[];
}>;

export type ArticlePaginatedResponse = Readonly<{
  result: ArticleListDTO[];
  pagination: PaginationDTO;
  metadata: Readonly<{
    tags: ArticleTagResponse[];
    petTypes: ArticleCatalogPetTypeDTO[];
    sort: Readonly<{
      current: ArticleListSort;
      options: ArticleListSortOptionDTO[];
    }>;
  }>;
}>;

export function toArticleDTO(value: unknown) {
  return transform(ArticleDTO, value);
}

function toPlain<T>(value: T): T {
  return instanceToPlain(value) as T;
}

export function toArticleResponse(value: unknown): ArticleDTO {
  return toPlain(toArticleDTO(value));
}

export function toArticleListDTOs(value: unknown) {
  if (!Array.isArray(value)) throw new TypeError('Expected an article array.');
  return transformMany(ArticleListDTO, value);
}

export function toArticleListResponses(value: unknown): ArticleListDTO[] {
  return toArticleListDTOs(value).map(toPlain);
}

export function toArticleDetailsDTO(value: unknown) {
  return transform(ArticleDetailsDTO, value);
}

export function toArticleDetailsResponse(value: unknown): ArticleDetailsResponse {
  return toPlain(toArticleDetailsDTO(value));
}

export function toArticlePaginatedResponse(value: unknown): ArticlePaginatedResponse {
  if (
    !value ||
    typeof value !== 'object' ||
    !Array.isArray((value as { result?: unknown }).result)
  ) {
    throw new TypeError('Expected a paginated article response.');
  }

  return {
    ...(value as Omit<ArticlePaginatedResponse, 'result'>),
    result: toArticleListResponses((value as ArticlePaginatedResponse).result),
  };
}

export function toArticleRelatedResponse(value: unknown): ArticleRelatedResponse {
  if (
    !value ||
    typeof value !== 'object' ||
    !Array.isArray((value as { articles?: unknown }).articles)
  ) {
    throw new TypeError('Expected related article response.');
  }

  const related = value as ArticleRelatedResponse;
  return { ...related, articles: related.articles.map(toArticleDetailsResponse) };
}

export function toArticleMainTextDTO(value: unknown) {
  return transform(ArticleMainTextDTO, value);
}

export type ArticleIdDTO = ArticleIdInput;
export type ArticleSlugDTO = ArticleSlugInput;
export type ArticlePaginationDTO = ArticlePaginationInput;
export type CreateArticleDTO = CreateArticleInput;
export type UpdateArticleDTO = UpdateArticleInput;
export type UpdateArticleMainTextDTO = UpdateArticleMainTextInput;
export type ReplaceArticleTagsDTO = ReplaceArticleTagsInput;
