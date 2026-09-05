'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { TextField } from '@/components/ui/fields/text-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { RichTextField } from '@/components/common/rich-text-field';
import { Form } from '@/components/ui/form';
import { getPetTypeByIdAction } from '@/entities/pet-types/pet-types.actions';
import { useUpdatePetType } from '@/entities/pet-types/pet-types.client';
import {
  updatePetTypeSchema,
  type UpdatePetTypeInput,
} from '@/entities/pet-types/pet-types.schema';
import { cn } from '@/lib/utils';
import type { RichTextFormValue } from '@/lib/rich-text';

import { PetTypeMainImageField } from './pet-type-main-image-field';

const AsyncPetTypeDetailDialogContent = dynamic(() => import('./pet-type-detail-dialog-content'));
const FORM_ID = 'pet-type-detail-form';

type PetTypeFormValue = {
  id: string;
  title: string;
  description: RichTextFormValue;
  mainImage?: unknown;
};

export function hasStoredMainImage(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

type FormBodyProps = {
  formRef: ReturnType<typeof useUpdatePetType>['formRef'];
  handleSubmit: ReturnType<typeof useUpdatePetType>['handleSubmit'];
  isLoading?: boolean;
  petType?: PetTypeFormValue;
};

export function PetTypeDetailFormBody({
  formRef,
  handleSubmit,
  isLoading = false,
  petType,
}: FormBodyProps) {
  const mainImage = petType?.mainImage;
  const mainImageUrl = hasStoredMainImage(mainImage) ? mainImage : null;

  return (
    <Form<UpdatePetTypeInput>
      key={petType?.id ?? 'pet-type-loading'}
      ref={formRef}
      id={FORM_ID}
      validationSchema={updatePetTypeSchema}
      options={{
        defaultValues: {
          title: petType?.title ?? 'عنوان نوع حیوان',
          description: petType?.description ?? { type: 'doc', content: [] },
          mainImage: undefined,
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش نوع حیوان"
      aria-busy={isLoading || undefined}
      className={cn(isLoading && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <fieldset disabled={isLoading} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
        <TextField<UpdatePetTypeInput> name="title" label="عنوان" required />
        <RichTextField<UpdatePetTypeInput> name="description" label="توضیحات" />
        <PetTypeMainImageField initialImageUrl={mainImageUrl} required={!mainImageUrl} />
      </fieldset>
    </Form>
  );
}

type Props = {
  petTypeId: string;
  request: ReturnType<typeof getPetTypeByIdAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function PetTypeDetailDialogContentWrapper({
  petTypeId,
  request,
  onClose,
  onUpdated,
}: Props) {
  const { formRef, handleSubmit, isPending } = useUpdatePetType(petTypeId, onUpdated);
  const fallback = (
    <PetTypeDetailFormBody formRef={formRef} handleSubmit={handleSubmit} isLoading />
  );

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="مشاهده و ویرایش نوع حیوان"
    >
      <Suspense fallback={fallback}>
        <AsyncPetTypeDetailDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <PetTypeDetailFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                petType={result.data}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncPetTypeDetailDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
