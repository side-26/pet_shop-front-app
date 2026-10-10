'use client';

import { type RefObject, useCallback } from 'react';

import { ImageFileField } from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/fields/text-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { SelectField } from '@/components/ui/fields/select-field';
import RichTextField from '@/components/ui/fields/rich-text-field';
import { Form, type FormHandle } from '@/components/ui/form';
import { MAIN_IMAGE_UPLOAD_ACCEPT_TYPES } from '@/configs/main-image-upload';
import { useCreateArticle } from '@/entities/articles/articles.client';
import { createArticleSchema, type CreateArticleInput } from '@/entities/articles/articles.schema';

import type { ArticlePetTypeOption } from './articles-header-actions';

const FORM_ID = 'create-article-form';

type CreateArticleDialogContentProps = Readonly<{
  onCreated: () => void;
  onExitComplete: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  petTypes: readonly ArticlePetTypeOption[];
}>;

function ArticleFormBody({
  formRef,
  handleSubmit,
  petTypes,
}: Readonly<{
  formRef: RefObject<FormHandle<CreateArticleInput> | null>;
  handleSubmit: (input: CreateArticleInput) => void;
  petTypes: readonly ArticlePetTypeOption[];
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
      <div className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <TextField<CreateArticleInput> name="title" label="عنوان" required />
          <SelectField<CreateArticleInput>
            name="petType"
            label="نوع حیوان"
            emptyText="نوع حیوانی برای انتخاب وجود ندارد."
            options={petTypes.map(({ id, image, title }) => ({
              value: id,
              label: (
                <span className="tw:flex tw:items-center tw:gap-2">
                  <Avatar size="sm">
                    <AvatarImage src={image} alt="" />
                    <AvatarFallback>{title.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span>{title}</span>
                </span>
              ),
            }))}
          />
        </div>
        <TextField<CreateArticleInput> name="subtitle" label="زیرعنوان" required />
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
      </div>
    </Form>
  );
}

export default function CreateArticleDialogContent({
  onCreated,
  onExitComplete,
  onOpenChange,
  open,
  petTypes,
}: CreateArticleDialogContentProps) {
  const { formRef, handleSubmit, isPending } = useCreateArticle(onCreated);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen || !isPending) onOpenChange(nextOpen);
    },
    [isPending, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <FormDialogContent
        formId={FORM_ID}
        title="ایجاد مقاله جدید"
        submitText="ایجاد مقاله"
        size="xl"
        className="tw:max-w-3xl"
        contentClassName="tw:max-h-[72dvh] tw:overflow-y-auto"
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !open) onExitComplete();
        }}
      >
        <ArticleFormBody formRef={formRef} handleSubmit={handleSubmit} petTypes={petTypes} />
      </FormDialogContent>
    </Dialog>
  );
}
