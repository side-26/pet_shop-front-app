'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form } from '@/components/ui/form';
import { getBreedAction } from '@/entities/breeds/breeds.actions';
import { useUpdateBreed } from '@/entities/breeds/breeds.client';
import { updateBreedSchema, type UpdateBreedInput } from '@/entities/breeds/breeds.schema';
import { cn } from '@/lib/utils';

import { BreedFormFields } from './breed-form-fields';
import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

const AsyncBreedDetailDialogContent = dynamic(() => import('./breed-detail-dialog-content'));
const FORM_ID = 'breed-detail-form';

type BreedFormValue = Omit<UpdateBreedInput, 'mainImage'> & {
  id: string;
  mainImage: string;
};

type FormBodyProps = {
  formRef: ReturnType<typeof useUpdateBreed>['formRef'];
  handleSubmit: ReturnType<typeof useUpdateBreed>['handleSubmit'];
  countries: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
  breed?: BreedFormValue;
  isLoading?: boolean;
};

export function BreedDetailFormBody({
  formRef,
  handleSubmit,
  countries,
  petTypes,
  breed,
  isLoading = false,
}: FormBodyProps) {
  const petType =
    petTypes.find((option) => option.value === breed?.petType || option.label === breed?.petType)
      ?.value ??
    breed?.petType ??
    '';

  return (
    <Form<UpdateBreedInput>
      key={breed?.id ?? 'breed-loading'}
      ref={formRef}
      id={FORM_ID}
      validationSchema={updateBreedSchema}
      options={{
        defaultValues: {
          title: breed?.title ?? 'عنوان نژاد',
          petType,
          country: breed?.country ?? 'کشور مبدأ',
          ageAverage: breed?.ageAverage ?? '۱۰ تا ۱۲ سال',
          size: breed?.size ?? 3,
          activityLevel: breed?.activityLevel ?? 3,
          enable: true,
          mainImage: undefined,
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش نژاد"
      aria-busy={isLoading || undefined}
      className={cn(isLoading && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <BreedFormFields
        countries={countries}
        disabled={isLoading}
        initialImageUrl={breed?.mainImage}
        petTypes={petTypes}
      />
    </Form>
  );
}

type Props = {
  breedId: string;
  request: ReturnType<typeof getBreedAction>;
  countries: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
  onClose: () => void;
  onUpdated: () => void;
};

export function BreedDetailDialogContentWrapper({
  breedId,
  request,
  countries,
  petTypes,
  onClose,
  onUpdated,
}: Props) {
  const { formRef, handleSubmit, isPending } = useUpdateBreed(breedId, onUpdated);

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="مشاهده و ویرایش نژاد"
      size="lg"
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      <Suspense
        fallback={
          <BreedDetailFormBody
            formRef={formRef}
            handleSubmit={handleSubmit}
            countries={countries}
            petTypes={petTypes}
            isLoading
          />
        }
      >
        <AsyncBreedDetailDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <BreedDetailFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                countries={countries}
                petTypes={petTypes}
                breed={result.data}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncBreedDetailDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
