'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { ImageFileField } from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { MAIN_IMAGE_UPLOAD_ACCEPT_TYPES } from '@/configs/main-image-upload';
import { useUpdateArticle } from '@/entities/articles/articles.client';
import { type ArticleDetailsDTO } from '@/entities/articles/articles.dto';
import { updateArticleSchema, type UpdateArticleInput } from '@/entities/articles/articles.schema';
import { cn } from '@/lib/utils';

import { useUpdateMainInfoDialogParams } from './context';
import { UpdateMainInfoDialogErrorBoundary } from './error-boundary';
import type { ArticlePetTypeOption } from '../create-new-article-dialog/types';

const AsyncUpdateMainInfoDialogContent = dynamic(() => import('./content-wrapper'));
const FORM_ID = 'update-article-main-info-form';

type ArticleMainInfoFormProps =
  | Readonly<{ isSkeleton: true }>
  | Readonly<{
      isSkeleton: false;
      article: ArticleDetailsDTO;
      formRef: ReturnType<typeof useUpdateArticle>['formRef'];
      handleSubmit: ReturnType<typeof useUpdateArticle>['handleSubmit'];
      petTypes: readonly ArticlePetTypeOption[];
    }>;

function ArticleMainInfoForm(props: ArticleMainInfoFormProps) {
  const { isSkeleton } = props;
  const article = isSkeleton ? undefined : props.article;
  const formRef = isSkeleton ? undefined : props.formRef;
  const handleSubmit = isSkeleton ? () => undefined : props.handleSubmit;
  const petTypes = isSkeleton ? [] : props.petTypes;

  return (
    <Form<UpdateArticleInput>
      key={article?.id ?? 'article-loading'}
      ref={formRef}
      id={FORM_ID}
      validationSchema={updateArticleSchema}
      options={{
        defaultValues: {
          title: article?.title ?? 'عنوان مقاله',
          subtitle: article?.subtitle ?? 'زیرعنوان مقاله',
          petType: article?.petTypeId ?? undefined,
          mainImage: undefined,
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش اطلاعات اصلی مقاله"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <fieldset disabled={isSkeleton} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <TextField<UpdateArticleInput> name="title" label="عنوان" required={!isSkeleton} />
          <SelectField<UpdateArticleInput>
            name="petType"
            label="نوع حیوان"
            emptyText="نوع حیوانی برای انتخاب وجود ندارد."
            disabled={isSkeleton}
            options={petTypes.map(({ id, image: _image, title }) => ({ value: id, label: title }))}
          />
        </div>
        <TextField<UpdateArticleInput> name="subtitle" label="زیرعنوان" required={!isSkeleton} />
        <ImageFileField<UpdateArticleInput>
          name="mainImage"
          acceptTypes={MAIN_IMAGE_UPLOAD_ACCEPT_TYPES}
          disabled={isSkeleton}
          aria-label="جایگزینی تصویر اصلی مقاله"
          hint="JPEG، JPG، PNG یا WebP تا حداکثر ۱ مگابایت"
        >
          <div className="tw:flex tw:min-h-32 tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-dashed tw:border-border-strong tw:bg-muted/35 tw:p-4">
            <ImageFilePreview
              alt="پیش‌نمایش تصویر اصلی مقاله"
              initialImageUrl={article?.mainImage}
              className="tw:size-24 tw:rounded-xl"
              fallback={
                <span className="tw:text-body-s tw:text-muted-foreground">تصویر اصلی مقاله</span>
              }
            />
            <span className="tw:text-body-s tw:text-muted-foreground">
              برای جایگزینی تصویر، این بخش را انتخاب کنید.
            </span>
          </div>
        </ImageFileField>
      </fieldset>
    </Form>
  );
}

export function UpdateMainInfoDialogContentWrapper({
  onClose,
  onUpdated,
  petTypes,
}: {
  onClose: () => void;
  onUpdated: () => void;
  petTypes: readonly ArticlePetTypeOption[];
}) {
  const { id } = useUpdateMainInfoDialogParams();
  const { formRef, handleSubmit, isPending } = useUpdateArticle(id, onUpdated);

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="ویرایش اطلاعات اصلی مقاله"
      size="xl"
      contentClassName="tw:max-h-[72dvh] tw:overflow-y-auto"
    >
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <UpdateMainInfoDialogErrorBoundary onQueryReset={reset}>
            <Suspense fallback={<ArticleMainInfoForm isSkeleton />}>
              <AsyncUpdateMainInfoDialogContent>
                {(article) => (
                  <ArticleMainInfoForm
                    isSkeleton={false}
                    article={article}
                    formRef={formRef}
                    handleSubmit={handleSubmit}
                    petTypes={petTypes}
                  />
                )}
              </AsyncUpdateMainInfoDialogContent>
            </Suspense>
          </UpdateMainInfoDialogErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </FormDialogContent>
  );
}
