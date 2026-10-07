import type { RichTextFormValue } from '@/lib/rich-text';

import type {
  ArticleIdInput,
  ArticleSlugInput,
  CreateArticleInput,
  UpdateArticleInput,
  UpdateArticleMainTextInput,
} from './articles.schema';

export type ArticleTagDTO = { title: string };

export type ArticleAuthorDTO = {
  avatar: string;
  placeholderImage: string;
  firstName: string;
  lastName: string;
};

export type ArticleDTO = {
  id: string;
  title: string;
  subtitle: string;
  mainImage: string;
  mainThumbnailImage: string;
  summary: string;
  tags: ArticleTagDTO[];
  petType: string | null;
  mainText: RichTextFormValue;
  author: ArticleAuthorDTO;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type ArticleIdDTO = ArticleIdInput;
export type ArticleSlugDTO = ArticleSlugInput;
export type CreateArticleDTO = CreateArticleInput;
export type UpdateArticleDTO = UpdateArticleInput;
export type UpdateArticleMainTextDTO = UpdateArticleMainTextInput;
