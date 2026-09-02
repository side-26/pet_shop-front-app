'use client';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { MultipleImageUploaderField } from '@/components/common/multiple-image-uploader-field';
import { Dialog } from '@/components/ui/dialog';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { useCreatePet } from '@/entities/pets/pets.client';
import { petSchema, type PetInput } from '@/entities/pets/pets.schema';

import { PetRelationFields } from './pet-relation-fields';
import type { PetFormOptions } from './pet-form-options.types';

const FORM_ID = 'create-pet-form';
type Props = {
  open: boolean;
  formOptions?: PetFormOptions;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
};

export function CreatePetDialog({ open, formOptions, onOpenChange, onCreated }: Props) {
  const { formRef, handleSubmit, isPending } = useCreatePet(onCreated);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent
        formId={FORM_ID}
        title="افزودن حیوان جدید"
        submitText="ایجاد حیوان"
        size="xl"
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        contentClassName="tw:max-h-[72dvh] tw:overflow-y-auto"
      >
        <Form<PetInput>
          ref={formRef}
          id={FORM_ID}
          validationSchema={petSchema}
          options={{
            defaultValues: {
              title: '',
              description: '',
              summary: '',
              petType: '',
              breed: '',
              images: { images: [] },
              quantity: 0,
              price: 1000,
              discountPercentage: 0,
              inEnable: true,
            },
          }}
          handleSubmit={handleSubmit}
          aria-label="فرم ایجاد حیوان"
        >
          <fieldset className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
            <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
              <TextField<PetInput> name="title" label="عنوان" required />
              <PetRelationFields<PetInput>
                petTypeName="petType"
                breedName="breed"
                petTypes={formOptions?.petTypes ?? []}
              />
              <TextField<PetInput> name="quantity" label="موجودی" type="number" min={0} required />
            </div>
            <TextareaField<PetInput> name="summary" label="خلاصه" maxLength={500} counter />
            <TextareaField<PetInput>
              name="description"
              label="توضیحات"
              maxLength={5000}
              counter
              required
            />
            <MultipleImageUploaderField<PetInput>
              name="images"
              label="تصاویر حیوان"
              hint="حداکثر ۵ تصویر JPEG، PNG یا WebP انتخاب و تصویر اصلی را مشخص کنید."
            />
          </fieldset>
        </Form>
      </FormDialogContent>
    </Dialog>
  );
}
