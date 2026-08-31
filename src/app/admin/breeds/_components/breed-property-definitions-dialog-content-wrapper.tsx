'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { AdditionalPropertiesField } from '@/components/common/additional-properties-field';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form } from '@/components/ui/form';
import { getBreedPropertyDefinitionsAction } from '@/entities/breeds/breeds.actions';
import { useReplaceBreedPropertyDefinitions } from '@/entities/breeds/breeds.client';
import {
  breedPropertyDefinitionsFormSchema,
  type BreedPropertyDefinitionsFormInput,
} from '@/entities/breeds/breeds.schema';
import { cn } from '@/lib/utils';

const AsyncBreedPropertyDefinitionsDialogContent = dynamic(
  () => import('./breed-property-definitions-dialog-content'),
);
const FORM_ID = 'breed-property-definitions-form';
const LOADING_VALUES = [
  { label: 'عنوان ویژگی', value: 'مقدار ویژگی' },
  { label: 'عنوان ویژگی', value: 'مقدار ویژگی' },
];

type FormBodyProps = {
  formRef: ReturnType<typeof useReplaceBreedPropertyDefinitions>['formRef'];
  handleSubmit: ReturnType<typeof useReplaceBreedPropertyDefinitions>['handleSubmit'];
  propertyDefinitions?: BreedPropertyDefinitionsFormInput['propertyDefinitions'];
  isLoading?: boolean;
};

export function BreedPropertyDefinitionsFormBody({
  formRef,
  handleSubmit,
  propertyDefinitions = LOADING_VALUES,
  isLoading = false,
}: FormBodyProps) {
  return (
    <Form<BreedPropertyDefinitionsFormInput>
      ref={formRef}
      id={FORM_ID}
      validationSchema={breedPropertyDefinitionsFormSchema}
      options={{ defaultValues: { propertyDefinitions } }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش ویژگی‌های اضافی نژاد"
      aria-busy={isLoading || undefined}
      className={cn(isLoading && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <AdditionalPropertiesField<BreedPropertyDefinitionsFormInput, 'propertyDefinitions'>
        name="propertyDefinitions"
        disabled={isLoading}
      />
    </Form>
  );
}

type Props = {
  breedId: string;
  request: ReturnType<typeof getBreedPropertyDefinitionsAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function BreedPropertyDefinitionsDialogContentWrapper({
  breedId,
  request,
  onClose,
  onUpdated,
}: Props) {
  const { formRef, handleSubmit, isPending } = useReplaceBreedPropertyDefinitions(
    breedId,
    onUpdated,
  );

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره ویژگی‌ها"
      title="ویرایش ویژگی‌های اضافی نژاد"
      size="lg"
      className="tw:h-[min(42rem,calc(100dvh-2rem))] tw:max-h-[calc(100dvh-2rem)] tw:overflow-hidden tw:[&>[data-slot=card]]:h-full tw:[&>[data-slot=card]]:min-h-0"
      contentClassName="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:overscroll-contain"
    >
      <Suspense
        fallback={
          <BreedPropertyDefinitionsFormBody
            formRef={formRef}
            handleSubmit={handleSubmit}
            isLoading
          />
        }
      >
        <AsyncBreedPropertyDefinitionsDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <BreedPropertyDefinitionsFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                propertyDefinitions={result.data.result.map(({ label, value }) => ({
                  label,
                  value: String(value),
                }))}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncBreedPropertyDefinitionsDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
