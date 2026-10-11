'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { BadgeGroupField } from '@/components/ui/fields/badge-group-field';
import { Form } from '@/components/ui/form';
import { useUpdateArticleTags } from '@/entities/articles/articles.client';
import type { ArticleTagDTO } from '@/entities/articles/articles.dto';
import {
  replaceArticleTagsSchema,
  type ReplaceArticleTagsInput,
} from '@/entities/articles/articles.schema';
import { cn } from '@/lib/utils';

import { useUpdateTagsDialogParams } from './context';
import { UpdateTagsDialogErrorBoundary } from './error-boundary';

const AsyncUpdateTagsDialogContent = dynamic(() => import('./content-wrapper'));
const FORM_ID = 'update-article-tags-form';

type ArticleTagsFormProps =
  | Readonly<{ isSkeleton: true }>
  | Readonly<{
      isSkeleton: false;
      id: string;
      tags: ArticleTagDTO[];
      formRef: ReturnType<typeof useUpdateArticleTags>['formRef'];
      handleSubmit: ReturnType<typeof useUpdateArticleTags>['handleSubmit'];
    }>;

function ArticleTagsForm(props: ArticleTagsFormProps) {
  const { isSkeleton } = props;
  const id = isSkeleton ? 'article-tags-loading' : props.id;
  const tags = isSkeleton ? [{ title: 'برچسب' }, { title: 'مقاله' }] : props.tags;
  const formRef = isSkeleton ? undefined : props.formRef;
  const handleSubmit = isSkeleton ? () => undefined : props.handleSubmit;
  return (
    <Form<ReplaceArticleTagsInput>
      key={id}
      ref={formRef}
      id={FORM_ID}
      validationSchema={replaceArticleTagsSchema}
      options={{ defaultValues: { tags } }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش برچسب‌های مقاله"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <fieldset disabled={isSkeleton} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
        <BadgeGroupField<ReplaceArticleTagsInput>
          name="tags"
          label="برچسب‌ها"
          hint="حداکثر ۲۰ برچسب مرتبط وارد کنید."
          maxItems={20}
        />
      </fieldset>
    </Form>
  );
}

export function UpdateTagsDialogContentWrapper({
  onClose,
  onUpdated,
}: Readonly<{ onClose: () => void; onUpdated: () => void }>) {
  const { id } = useUpdateTagsDialogParams();
  const { formRef, handleSubmit, isPending } = useUpdateArticleTags(id, onUpdated);
  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="ویرایش برچسب‌های مقاله"
      size="lg"
    >
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <UpdateTagsDialogErrorBoundary onQueryReset={reset}>
            <Suspense fallback={<ArticleTagsForm isSkeleton />}>
              <AsyncUpdateTagsDialogContent>
                {(tags) => (
                  <ArticleTagsForm
                    isSkeleton={false}
                    id={id}
                    tags={tags}
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                  />
                )}
              </AsyncUpdateTagsDialogContent>
            </Suspense>
          </UpdateTagsDialogErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </FormDialogContent>
  );
}
