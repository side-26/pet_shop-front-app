'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import RichTextField from '@/components/ui/fields/rich-text-field';
import { Form } from '@/components/ui/form';
import { useUpdateArticleMainText } from '@/entities/articles/articles.client';
import type { ArticleMainTextDTO } from '@/entities/articles/articles.dto';
import {
  updateArticleMainTextSchema,
  type UpdateArticleMainTextInput,
} from '@/entities/articles/articles.schema';
import { cn } from '@/lib/utils';

import { useUpdateMainTextDialogParams } from './context';
import { UpdateMainTextDialogErrorBoundary } from './error-boundary';

const AsyncUpdateMainTextDialogContent = dynamic(() => import('./content-wrapper'));
const FORM_ID = 'update-article-main-text-form';

type ArticleMainTextFormProps =
  | Readonly<{ isSkeleton: true; id: string }>
  | Readonly<{
      isSkeleton: false;
      id: string;
      article: ArticleMainTextDTO;
      formRef: ReturnType<typeof useUpdateArticleMainText>['formRef'];
      handleSubmit: ReturnType<typeof useUpdateArticleMainText>['handleSubmit'];
    }>;

function ArticleMainTextForm(props: ArticleMainTextFormProps) {
  const { id, isSkeleton } = props;
  const article = isSkeleton ? undefined : props.article;
  const formRef = isSkeleton ? undefined : props.formRef;
  const handleSubmit = isSkeleton ? () => undefined : props.handleSubmit;

  return (
    <Form<UpdateArticleMainTextInput>
      key={id}
      ref={formRef}
      id={FORM_ID}
      validationSchema={updateArticleMainTextSchema}
      options={{ defaultValues: { mainText: article?.mainText ?? { type: 'doc', content: [] } } }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش متن مقاله"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <fieldset disabled={isSkeleton} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
        <RichTextField<UpdateArticleMainTextInput> name="mainText" label="متن مقاله" required />
      </fieldset>
    </Form>
  );
}

export function UpdateMainTextDialogContentWrapper({
  onClose,
  onUpdated,
}: Readonly<{
  onClose: () => void;
  onUpdated: () => void;
}>) {
  const { id } = useUpdateMainTextDialogParams();
  const { formRef, handleSubmit, isPending } = useUpdateArticleMainText(id, onUpdated);

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="ویرایش متن مقاله"
      size="xl"
      contentClassName="tw:max-h-[72dvh] tw:overflow-y-auto"
    >
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <UpdateMainTextDialogErrorBoundary onQueryReset={reset}>
            <Suspense fallback={<ArticleMainTextForm isSkeleton id={id} />}>
              <AsyncUpdateMainTextDialogContent>
                {(article) => (
                  <ArticleMainTextForm
                    isSkeleton={false}
                    id={id}
                    article={article}
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                  />
                )}
              </AsyncUpdateMainTextDialogContent>
            </Suspense>
          </UpdateMainTextDialogErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </FormDialogContent>
  );
}
