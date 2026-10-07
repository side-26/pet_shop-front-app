'use server';

import { ValidationError } from 'yup';
import { refresh } from 'next/cache';

import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import type { FetcherError } from '@/lib/api/customFetcher';
import { getSession } from '@/utils/session';

import {
  articleIdSchema,
  articleSlugSchema,
  createArticleSchema,
  replaceArticleTagsSchema,
  updateArticleMainTextSchema,
  updateArticleSchema,
} from './articles.schema';
import * as service from './articles.service';

function accessError(): FetcherError {
  return {
    isSuccess: false,
    message: 'برای مدیریت مقاله وارد حساب شوید.',
    data: { messages: {}, details: {} },
  };
}

async function authorizeAuthenticated() {
  return (await getSession()) ? null : accessError();
}

async function validate<T>(
  schema: { validate(input: unknown, options: object): Promise<T> },
  input: unknown,
) {
  try {
    return await schema.validate(input, { abortEarly: false, stripUnknown: true });
  } catch (error) {
    if (error instanceof ValidationError) return validationErrorToFetcherError(error);
    throw error;
  }
}

export async function getArticlePreviewBySlugAction(input: unknown) {
  const value = await validate(articleSlugSchema, input);
  return 'isSuccess' in value ? value : service.getArticlePreviewBySlug(value.slug);
}

export async function getCurrentUserArticlesAction() {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  return service.getCurrentUserArticles();
}

export async function getArticleByIdAction(input: unknown) {
  const value = await validate(articleIdSchema, input);
  return 'isSuccess' in value ? value : service.getArticleById(value.id);
}

export async function getArticleMainTextByIdAction(input: unknown) {
  const value = await validate(articleIdSchema, input);
  return 'isSuccess' in value ? value : service.getArticleMainTextById(value.id);
}

export async function getArticleTagsAction(input: unknown) {
  const value = await validate(articleIdSchema, input);
  return 'isSuccess' in value ? value : service.getArticleTags(value.id);
}

export async function retryCurrentUserArticlesAction() {
  const denied = await authorizeAuthenticated();
  if (denied) return;

  service.invalidateCurrentUserArticles();
  refresh();
}

export async function createArticleAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const value = await validate(createArticleSchema, input);
  return 'isSuccess' in value ? value : service.createArticle(value);
}

export async function updateArticleAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const id = await validate(articleIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(updateArticleSchema, input);
  return 'isSuccess' in value ? value : service.updateArticle(id.id, value);
}

export async function updateArticleMainTextAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const id = await validate(articleIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(updateArticleMainTextSchema, input);
  return 'isSuccess' in value ? value : service.updateArticleMainText(id.id, value);
}

export async function replaceArticleTagsAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const id = await validate(articleIdSchema, input);
  if ('isSuccess' in id) return id;
  const value = await validate(replaceArticleTagsSchema, input);
  return 'isSuccess' in value ? value : service.replaceArticleTags(id.id, value);
}

export async function deleteArticleAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const value = await validate(articleIdSchema, input);
  return 'isSuccess' in value ? value : service.deleteArticle(value.id);
}
