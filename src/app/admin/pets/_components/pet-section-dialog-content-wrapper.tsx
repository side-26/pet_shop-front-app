'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { MultipleImageUploaderField } from '@/components/common/multiple-image-uploader-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { RichTextField } from '@/components/common/rich-text-field';
import { TextField } from '@/components/ui/fields/text-field';
import { PriceMaskField } from '@/components/ui/fields/price-mask-field';
import { Form } from '@/components/ui/form';
import {
  useUpdatePetBaseInfo,
  useUpdatePetImages,
  useUpdatePetPrice,
} from '@/entities/pets/pets.client';
import type {
  PetBaseInfoDTO,
  PetImagesDTO,
  PetPriceDTO,
  PetRelationDTO,
} from '@/entities/pets/pets.dto';
import {
  updatePetBaseInfoSchema,
  updatePetImagesSchema,
  updatePetPriceSchema,
  type UpdatePetBaseInfoInput,
  type UpdatePetImagesInput,
  type UpdatePetPriceInput,
} from '@/entities/pets/pets.schema';
import { cn } from '@/lib/utils';

import type { PetFormOptions } from './pet-form-options.types';
import { PetRelationFields } from './pet-relation-fields';
import type {
  PetFormOptionsRequest,
  PetSection,
  PetSectionData,
  PetSectionRequest,
} from './pet-section-dialog.types';

const AsyncContent = dynamic(() => import('./pet-section-dialog-content'));
const formId = (section: PetSection) => `pet-${section}-form`;
const relationId = (value: PetRelationDTO | string) =>
  typeof value === 'string' ? value : value.id;

type Common = {
  section: PetSection;
  isSkeleton?: boolean;
  data?: PetSectionData;
  formOptions?: PetFormOptions;
  baseFormRef: ReturnType<typeof useUpdatePetBaseInfo>['formRef'];
  baseSubmit: ReturnType<typeof useUpdatePetBaseInfo>['handleSubmit'];
  imagesFormRef: ReturnType<typeof useUpdatePetImages>['formRef'];
  imagesSubmit: ReturnType<typeof useUpdatePetImages>['handleSubmit'];
  priceFormRef: ReturnType<typeof useUpdatePetPrice>['formRef'];
  priceSubmit: ReturnType<typeof useUpdatePetPrice>['handleSubmit'];
};

function SectionForm({
  section,
  isSkeleton = false,
  data,
  formOptions,
  baseFormRef,
  baseSubmit,
  imagesFormRef,
  imagesSubmit,
  priceFormRef,
  priceSubmit,
}: Common) {
  const className = cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none');

  if (section === 'price') {
    const value = data as PetPriceDTO | undefined;
    return (
      <Form<UpdatePetPriceInput>
        ref={priceFormRef}
        id={formId(section)}
        validationSchema={updatePetPriceSchema}
        options={{
          defaultValues: { price: value?.price, discountPercentage: value?.discountPercentage },
        }}
        handleSubmit={priceSubmit}
        aria-label="فرم قیمت حیوان"
        aria-busy={isSkeleton || undefined}
        className={className}
      >
        <fieldset
          disabled={isSkeleton}
          className="tw:grid tw:w-full tw:min-w-0 tw:gap-4 tw:sm:grid-cols-2"
        >
          <PriceMaskField<UpdatePetPriceInput> name="price" label="قیمت" min={0} />
          <TextField<UpdatePetPriceInput>
            name="discountPercentage"
            label="درصد تخفیف"
            type="number"
            min={0}
            max={100}
          />
        </fieldset>
      </Form>
    );
  }
  if (section === 'images') {
    const value = data as PetImagesDTO | undefined;
    return (
      <Form<UpdatePetImagesInput>
        ref={imagesFormRef}
        id={formId(section)}
        validationSchema={updatePetImagesSchema}
        options={{
          defaultValues: {
            images: { images: [] },
          },
        }}
        handleSubmit={imagesSubmit}
        aria-label="فرم تصاویر حیوان"
        aria-busy={isSkeleton || undefined}
        className={className}
      >
        <fieldset
          className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-4"
          disabled={isSkeleton}
        >
          <MultipleImageUploaderField<UpdatePetImagesInput>
            name="images"
            label="تصاویر جایگزین"
            hint="حداکثر ۵ تصویر JPEG، PNG یا WebP برای جایگزینی بارگذاری کنید."
            defaultImages={value?.imagesList}
            mainImageUrl={value?.mainImage}
            disabled={isSkeleton}
          />
        </fieldset>
      </Form>
    );
  }
  const value = data as PetBaseInfoDTO | undefined;
  return (
    <Form<UpdatePetBaseInfoInput>
      ref={baseFormRef}
      id={formId(section)}
      validationSchema={updatePetBaseInfoSchema}
      options={{
        defaultValues: {
          title: value?.title,
          summary: value?.summary,
          description: value?.description,
          petType: value ? relationId(value.petType) : '',
          breed: value ? relationId(value.breed) : '',
          quantity: value?.quantity,
        },
      }}
      handleSubmit={baseSubmit}
      aria-label="فرم اطلاعات اصلی حیوان"
      aria-busy={isSkeleton || undefined}
      className={className}
    >
      <fieldset disabled={isSkeleton} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-4">
        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <TextField<UpdatePetBaseInfoInput> name="title" label="عنوان" />
          <TextField<UpdatePetBaseInfoInput> name="quantity" label="موجودی" type="number" min={0} />
          <PetRelationFields<UpdatePetBaseInfoInput>
            petTypeName="petType"
            breedName="breed"
            petTypes={formOptions?.petTypes ?? []}
            disabled={isSkeleton}
          />
        </div>
        <TextareaField<UpdatePetBaseInfoInput>
          name="summary"
          label="خلاصه"
          maxLength={500}
          counter
        />
        <RichTextField<UpdatePetBaseInfoInput> name="description" label="توضیحات" />
      </fieldset>
    </Form>
  );
}

type Props = {
  petId: string;
  petTitle: string;
  section: PetSection;
  request: PetSectionRequest;
  optionsRequest: PetFormOptionsRequest;
  onClose: () => void;
  onUpdated: () => void;
};
const titles: Record<PetSection, string> = {
  'base-info': 'اطلاعات اصلی',
  price: 'قیمت',
  images: 'تصاویر',
};

export function PetSectionDialogContentWrapper({
  petId,
  petTitle,
  section,
  request,
  optionsRequest,
  onClose,
  onUpdated,
}: Props) {
  const {
    formRef: baseFormRef,
    handleSubmit: baseSubmit,
    isPending: basePending,
  } = useUpdatePetBaseInfo(petId, onUpdated);
  const {
    formRef: imagesFormRef,
    handleSubmit: imagesSubmit,
    isPending: imagesPending,
  } = useUpdatePetImages(petId, onUpdated);
  const {
    formRef: priceFormRef,
    handleSubmit: priceSubmit,
    isPending: pricePending,
  } = useUpdatePetPrice(petId, onUpdated);
  const pending =
    section === 'base-info' ? basePending : section === 'images' ? imagesPending : pricePending;
  const sectionFormProps = {
    baseFormRef,
    baseSubmit,
    imagesFormRef,
    imagesSubmit,
    priceFormRef,
    priceSubmit,
  };
  return (
    <FormDialogContent
      formId={formId(section)}
      isLoading={pending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title={`${titles[section]} ${petTitle}`}
      size="lg"
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      <Suspense fallback={<SectionForm section={section} {...sectionFormProps} isSkeleton />}>
        <AsyncContent request={request} optionsRequest={optionsRequest}>
          {(result, options) =>
            result.isSuccess ? (
              <SectionForm
                section={section}
                data={result.data}
                formOptions={options.isSuccess ? options.data : undefined}
                {...sectionFormProps}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncContent>
      </Suspense>
    </FormDialogContent>
  );
}
