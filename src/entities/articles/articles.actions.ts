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
import { unwrapResult } from '@/lib/utils';

async function requireAuthenticated(): Promise<void> {
  const session = await getSession();

  if (!session) {
    throw new Error('برای مدیریت مقاله وارد حساب شوید.');
  }
}
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

async function unwrapValidate<T extends object>(
  promise: Promise<T | FetcherError>,
  defaultErrorMessage = 'ورودی نامعتبر است.',
): Promise<T> {
  const result = await promise;

  if ('isSuccess' in result) {
    throw new Error(result.message ?? defaultErrorMessage);
  }

  return result;
}

export async function getArticlePreviewBySlugAction(input: unknown) {
  const value = await unwrapValidate(validate(articleSlugSchema, input));
  return unwrapResult(service.getArticlePreviewBySlug(value.slug));
}

export async function getArticlePreviewByIdAction(input: unknown) {
  await requireAuthenticated();

  const value = await unwrapValidate(validate(articleIdSchema, input), 'شناسه مقاله نامعتبر است.');

  return unwrapResult(service.getArticlePreviewById(value.id));
}

export async function getCurrentUserArticlesAction() {
  await requireAuthenticated();
  return unwrapResult(service.getCurrentUserArticles());
}
// no need this action
export async function retryCurrentUserArticlesAction() {
  const denied = await authorizeAuthenticated();
  if (denied) return;

  service.invalidateCurrentUserArticles();
  refresh();
}

export async function createArticleAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const value = await unwrapValidate(validate(createArticleSchema, input));
  return service.createArticle(value);
}

export async function updateArticleAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const id = await unwrapValidate(validate(articleIdSchema, input));
  const value = await unwrapValidate(validate(updateArticleSchema, input));
  return service.updateArticle(id.id, value);
}

export async function updateArticleMainTextAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const id = await unwrapValidate(validate(articleIdSchema, input));
  const value = await unwrapValidate(validate(updateArticleMainTextSchema, input));
  return service.updateArticleMainText(id.id, value);
}

export async function replaceArticleTagsAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const id = await unwrapValidate(validate(articleIdSchema, input));
  const value = await unwrapValidate(validate(replaceArticleTagsSchema, input));
  return service.replaceArticleTags(id.id, value);
}

export async function deleteArticleAction(input: unknown) {
  const denied = await authorizeAuthenticated();
  if (denied) return denied;

  const value = await unwrapValidate(validate(articleIdSchema, input));

  const result = await service.deleteArticle(value.id);
  if (result.isSuccess) service.invalidateCurrentUserArticles();
  return result;
}
