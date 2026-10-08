'use client';

import dynamic from 'next/dynamic';
import { Suspense, type RefObject, useCallback, useRef, useTransition } from 'react';

import { ImageFileField } from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import RichTextField from '@/components/ui/fields/rich-text-field';
import { Form, type FormHandle } from '@/components/ui/form';
import { MAIN_IMAGE_UPLOAD_ACCEPT_TYPES } from '@/configs/main-image-upload';
import { submitCreateArticle } from '@/entities/articles/articles.client';
import { createArticleSchema, type CreateArticleInput } from '@/entities/articles/articles.schema';
import { cn } from '@/lib/utils';

const CreateArticleDialogContent = dynamic(() => import('./create-article-dialog-content'));

const FORM_ID = 'create-article-form';

type CreateArticleDialogContentWrapperProps = Readonly<{
  onClose: () => void;
  onCreated: () => void;
}>;

function ArticleFormBody({
  formRef,
  handleSubmit,
  isLoading = false,
}: Readonly<{
  formRef: RefObject<FormHandle<CreateArticleInput> | null>;
  handleSubmit: (input: CreateArticleInput) => void;
  isLoading?: boolean;
}>) {
  return (
    <Form<CreateArticleInput>
      ref={formRef}
      id={FORM_ID}
      validationSchema={createArticleSchema}
      options={{
        defaultValues: {
          title: '',
          subtitle: '',
          summary: '',
          mainText: { type: 'doc', content: [] },
          mainImage: undefined,
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ایجاد مقاله"
    >
      <fieldset
        disabled={isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          'tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5',
          isLoading && 'skeleton tw:pointer-events-none tw:select-none',
        )}
      >
        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <TextField<CreateArticleInput> name="title" label="عنوان" required />
          <TextField<CreateArticleInput> name="subtitle" label="زیرعنوان" required />
        </div>
        <TextareaField<CreateArticleInput> name="summary" label="خلاصه" maxLength={600} counter />
        <RichTextField<CreateArticleInput> name="mainText" label="متن مقاله" required />
        <ImageFileField<CreateArticleInput>
          name="mainImage"
          acceptTypes={MAIN_IMAGE_UPLOAD_ACCEPT_TYPES}
          required
          aria-label="انتخاب تصویر اصلی مقاله"
          hint="JPEG، JPG، PNG یا WebP تا حداکثر ۱ مگابایت"
        >
          <div className="tw:flex tw:min-h-32 tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-dashed tw:border-border-strong tw:bg-muted/35 tw:p-4">
            <ImageFilePreview
              alt="پیش‌نمایش تصویر اصلی مقاله"
              className="tw:size-24 tw:rounded-xl"
              fallback={
                <span className="tw:text-body-s tw:text-muted-foreground">تصویر اصلی مقاله</span>
              }
            />
            <span className="tw:text-body-s tw:text-muted-foreground">
              برای انتخاب تصویر، این بخش را انتخاب کنید.
            </span>
          </div>
        </ImageFileField>
      </fieldset>
    </Form>
  );
}

export function CreateArticleDialogContentWrapper({
  onClose,
  onCreated,
}: CreateArticleDialogContentWrapperProps) {
  const formRef = useRef<FormHandle<CreateArticleInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: CreateArticleInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitCreateArticle(input, form.setError)) onCreated();
      });
    },
    [isPending, onCreated],
  );

  return (
    <FormDialogContent
      formId={FORM_ID}
      title="ایجاد مقاله جدید"
      submitText="ایجاد مقاله"
      size="xl"
      className="tw:max-w-3xl"
      contentClassName="tw:max-h-[72dvh] tw:overflow-y-auto"
      isLoading={isPending}
      onClose={onClose}
    >
      <Suspense
        fallback={<ArticleFormBody formRef={formRef} handleSubmit={handleSubmit} isLoading />}
      >
        <CreateArticleDialogContent>
          <ArticleFormBody formRef={formRef} handleSubmit={handleSubmit} />
        </CreateArticleDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
