'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form } from '@/components/ui/form';
import { useUpdateBrand } from '@/entities/brands/brands.client';
import { updateBrandSchema, type UpdateBrandInput } from '@/entities/brands/brands.schema';
import { cn } from '@/lib/utils';

import { BrandFormFields } from './brand-form-fields';
import type { BrandDetailData, BrandDetailRequest } from './brand-form-dialog.types';

const AsyncBrandDetailDialogContent = dynamic(() => import('./brand-detail-dialog-content'));
const FORM_ID = 'brand-detail-form';

type FormBodyProps = {
  formRef: ReturnType<typeof useUpdateBrand>['formRef'];
  handleSubmit: ReturnType<typeof useUpdateBrand>['handleSubmit'];
  brand?: BrandDetailData;
  isSkeleton?: boolean;
};

function descriptionToText(value: unknown) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return JSON.stringify(value);
  return '';
}

export function BrandDetailFormBody({
  formRef,
  handleSubmit,
  brand,
  isSkeleton = false,
}: FormBodyProps) {
  return (
    <Form<UpdateBrandInput>
      key={brand?.id ?? 'brand-loading'}
      ref={formRef}
      id={FORM_ID}
      validationSchema={updateBrandSchema}
      options={{
        defaultValues: {
          title: brand?.title ?? 'Brand title',
          title_fa: brand?.title_fa ?? 'عنوان برند',
          description: brand?.description ?? 'توضیحات برند',
          isEnable: brand?.isEnable ?? true,
          logo: null,
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش برند"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <BrandFormFields disabled={isSkeleton} initialLogoUrl={brand?.logo} />
    </Form>
  );
}

type Props = {
  brandId: string;
  request: BrandDetailRequest;
  onClose: () => void;
  onUpdated: () => void;
};

export function BrandDetailDialogContentWrapper({ brandId, request, onClose, onUpdated }: Props) {
  const { formRef, handleSubmit, isPending } = useUpdateBrand(brandId, onUpdated);

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="مشاهده و ویرایش برند"
      size="lg"
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      <Suspense
        fallback={<BrandDetailFormBody formRef={formRef} handleSubmit={handleSubmit} isSkeleton />}
      >
        <AsyncBrandDetailDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <BrandDetailFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                brand={{ ...result.data, description: descriptionToText(result.data.description) }}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncBrandDetailDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
