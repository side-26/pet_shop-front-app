'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form } from '@/components/ui/form';
import { getSubCategoryByIdAction } from '@/entities/sub-categories/sub-categories.actions';
import { useUpdateSubCategory } from '@/entities/sub-categories/sub-categories.client';
import {
  updateSubCategorySchema,
  type UpdateSubCategoryInput,
} from '@/entities/sub-categories/sub-categories.schema';
import { cn } from '@/lib/utils';

import type { SubCategoryOption } from './sub-categories-form.types';
import { SubCategoryFormFields } from './sub-category-form-fields';

const AsyncSubCategoryDetailDialogContent = dynamic(
  () => import('./sub-category-detail-dialog-content'),
);
const FORM_ID = 'sub-category-detail-form';

type FormBodyProps = {
  formRef: ReturnType<typeof useUpdateSubCategory>['formRef'];
  handleSubmit: ReturnType<typeof useUpdateSubCategory>['handleSubmit'];
  categories: readonly SubCategoryOption[];
  subCategory?: { id: string; title: string; category: string };
  isSkeleton?: boolean;
};

export function SubCategoryDetailFormBody({
  formRef,
  handleSubmit,
  categories,
  subCategory,
  isSkeleton = false,
}: FormBodyProps) {
  return (
    <Form<UpdateSubCategoryInput>
      key={subCategory?.id ?? 'sub-category-loading'}
      ref={formRef}
      id={FORM_ID}
      validationSchema={updateSubCategorySchema}
      options={{
        defaultValues: {
          title: subCategory?.title ?? 'عنوان زیر دسته‌بندی',
          category: subCategory?.category ?? '',
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش زیر دسته‌بندی"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <SubCategoryFormFields categories={categories} disabled={isSkeleton} />
    </Form>
  );
}

type Props = {
  subCategoryId: string;
  request: ReturnType<typeof getSubCategoryByIdAction>;
  categories: readonly SubCategoryOption[];
  onClose: () => void;
  onUpdated: () => void;
};

export function SubCategoryDetailDialogContentWrapper({
  subCategoryId,
  request,
  categories,
  onClose,
  onUpdated,
}: Props) {
  const { formRef, handleSubmit, isPending } = useUpdateSubCategory(subCategoryId, onUpdated);

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="مشاهده و ویرایش زیر دسته‌بندی"
      size="md"
    >
      <Suspense
        fallback={
          <SubCategoryDetailFormBody
            formRef={formRef}
            handleSubmit={handleSubmit}
            categories={categories}
            isSkeleton
          />
        }
      >
        <AsyncSubCategoryDetailDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <SubCategoryDetailFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                categories={categories}
                subCategory={result.data}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncSubCategoryDetailDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
