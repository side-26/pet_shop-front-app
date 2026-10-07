'use client';

import type { UseFormSetError } from 'react-hook-form';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createArticleAction,
  deleteArticleAction,
  updateArticleAction,
  updateArticleMainTextAction,
  replaceArticleTagsAction,
} from './articles.actions';
import type {
  CreateArticleInput,
  UpdateArticleInput,
  UpdateArticleMainTextInput,
  ReplaceArticleTagsInput,
} from './articles.schema';

export async function submitCreateArticle(
  input: CreateArticleInput,
  showErrorFields: UseFormSetError<CreateArticleInput>,
) {
  const result = await createArticleAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitUpdateArticle(
  id: string,
  input: UpdateArticleInput,
  showErrorFields: UseFormSetError<UpdateArticleInput>,
) {
  const result = await updateArticleAction({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitArticleMainTextUpdate(
  id: string,
  input: UpdateArticleMainTextInput,
  showErrorFields: UseFormSetError<UpdateArticleMainTextInput>,
) {
  const result = await updateArticleMainTextAction({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitArticleTagsReplacement(
  id: string,
  input: ReplaceArticleTagsInput,
  showErrorFields: UseFormSetError<ReplaceArticleTagsInput>,
) {
  const result = await replaceArticleTagsAction({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitDeleteArticle(id: string) {
  const result = await deleteArticleAction({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}
