'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { AdditionalPropertiesField } from '@/components/common/additional-properties-field';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form } from '@/components/ui/form';
import { getPetTypePropertyDefinitionsAction } from '@/entities/pet-types/pet-types.actions';
import { useRangePetTypePropertyDefinitions } from '@/entities/pet-types/pet-types.client';
import {
  petTypePropertyDefinitionsFormSchema,
  type PetTypePropertyDefinitionsFormInput,
} from '@/entities/pet-types/pet-types.schema';
import { cn } from '@/lib/utils';

const AsyncPetTypePropertyDefinitionsDialogContent = dynamic(
  () => import('./pet-type-property-definitions-dialog-content'),
);
const FORM_ID = 'pet-type-property-definitions-form';
const DIALOG_CLASS =
  'tw:h-[min(42rem,calc(100dvh-2rem))] tw:max-h-[calc(100dvh-2rem)] tw:overflow-hidden tw:[&>[data-slot=card]]:h-full tw:[&>[data-slot=card]]:min-h-0';
const DIALOG_CONTENT_CLASS = 'tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:overscroll-contain';
const LOADING_PROPERTY_DEFINITIONS = [
  { label: 'عنوان ویژگی', value: 'مقدار ویژگی' },
  { label: 'عنوان ویژگی', value: 'مقدار ویژگی' },
];

type FormBodyProps = {
  formRef: ReturnType<typeof useRangePetTypePropertyDefinitions>['formRef'];
  handleSubmit: ReturnType<typeof useRangePetTypePropertyDefinitions>['handleSubmit'];
  isLoading?: boolean;
  propertyDefinitions?: PetTypePropertyDefinitionsFormInput['propertyDefinitions'];
};

export function PetTypePropertyDefinitionsFormBody({
  formRef,
  handleSubmit,
  isLoading = false,
  propertyDefinitions = LOADING_PROPERTY_DEFINITIONS,
}: FormBodyProps) {
  return (
    <Form<PetTypePropertyDefinitionsFormInput>
      ref={formRef}
      id={FORM_ID}
      validationSchema={petTypePropertyDefinitionsFormSchema}
      options={{ defaultValues: { propertyDefinitions } }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش ویژگی‌های اضافی"
      aria-busy={isLoading || undefined}
      className={cn(isLoading && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <AdditionalPropertiesField<PetTypePropertyDefinitionsFormInput, 'propertyDefinitions'>
        name="propertyDefinitions"
        disabled={isLoading}
      />
    </Form>
  );
}

type Props = {
  petTypeId: string;
  request: ReturnType<typeof getPetTypePropertyDefinitionsAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function PetTypePropertyDefinitionsDialogContentWrapper({
  petTypeId,
  request,
  onClose,
  onUpdated,
}: Props) {
  const { formRef, handleSubmit, isPending } = useRangePetTypePropertyDefinitions(
    petTypeId,
    onUpdated,
  );
  const fallback = (
    <PetTypePropertyDefinitionsFormBody formRef={formRef} handleSubmit={handleSubmit} isLoading />
  );

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره ویژگی‌ها"
      title="ویرایش ویژگی‌های اضافی"
      size="lg"
      className={DIALOG_CLASS}
      contentClassName={DIALOG_CONTENT_CLASS}
    >
      <Suspense fallback={fallback}>
        <AsyncPetTypePropertyDefinitionsDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <PetTypePropertyDefinitionsFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                propertyDefinitions={result.data.result.map((item) => ({
                  label: item.label,
                  value: String(item.value),
                }))}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncPetTypePropertyDefinitionsDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
