'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form } from '@/components/ui/form';
import { getCategoryByIdAction } from '@/entities/categories/categories.actions';
import { useUpdateCategory } from '@/entities/categories/categories.client';
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from '@/entities/categories/categories.schema';
import { cn } from '@/lib/utils';

import type { CategoryPetTypeOption } from './categories-form.types';
import { CategoryFormFields } from './category-form-fields';

const AsyncCategoryDetailDialogContent = dynamic(() => import('./category-detail-dialog-content'));
const FORM_ID = 'category-detail-form';

type CategoryFormValue = Omit<UpdateCategoryInput, 'mainImage'> & {
  id: string;
  mainImage: string;
};

type FormBodyProps = {
  formRef: ReturnType<typeof useUpdateCategory>['formRef'];
  handleSubmit: ReturnType<typeof useUpdateCategory>['handleSubmit'];
  petTypes: readonly CategoryPetTypeOption[];
  category?: CategoryFormValue;
  isSkeleton?: boolean;
};

export function CategoryDetailFormBody({
  formRef,
  handleSubmit,
  petTypes,
  category,
  isSkeleton = false,
}: FormBodyProps) {
  return (
    <Form<UpdateCategoryInput>
      key={category?.id ?? 'category-loading'}
      ref={formRef}
      id={FORM_ID}
      validationSchema={updateCategorySchema}
      options={{
        defaultValues: {
          title: category?.title ?? 'عنوان دسته‌بندی',
          petType: category?.petType ?? '',
          mainImage: undefined,
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش دسته‌بندی"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <CategoryFormFields
        disabled={isSkeleton}
        initialImageUrl={category?.mainImage}
        imageRequired={!category?.mainImage}
        petTypes={petTypes}
        showIsEnable={false}
      />
    </Form>
  );
}

type Props = {
  categoryId: string;
  request: ReturnType<typeof getCategoryByIdAction>;
  petTypes: readonly CategoryPetTypeOption[];
  onClose: () => void;
  onUpdated: () => void;
};

export function CategoryDetailDialogContentWrapper({
  categoryId,
  request,
  petTypes,
  onClose,
  onUpdated,
}: Props) {
  const { formRef, handleSubmit, isPending } = useUpdateCategory(categoryId, onUpdated);

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="مشاهده و ویرایش دسته‌بندی"
      size="lg"
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      <Suspense
        fallback={
          <CategoryDetailFormBody
            formRef={formRef}
            handleSubmit={handleSubmit}
            petTypes={petTypes}
            isSkeleton
          />
        }
      >
        <AsyncCategoryDetailDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <CategoryDetailFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                petTypes={petTypes}
                category={result.data}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncCategoryDetailDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
