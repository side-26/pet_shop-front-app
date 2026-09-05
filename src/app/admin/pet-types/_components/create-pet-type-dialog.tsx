'use client';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/fields/text-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { RichTextField } from '@/components/common/rich-text-field';
import { Form } from '@/components/ui/form';
import { useCreatePetType } from '@/entities/pet-types/pet-types.client';
import { petTypeSchema, type PetTypeInput } from '@/entities/pet-types/pet-types.schema';
import { PetTypeMainImageField } from './pet-type-main-image-field';
const CREATE_PET_TYPE_FORM_ID = 'create-pet-type-form';
export function CreatePetTypeDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}) {
  const { formRef, handleSubmit, isPending } = useCreatePetType(onCreated);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent
        formId={CREATE_PET_TYPE_FORM_ID}
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        submitText="ایجاد نوع حیوان"
        title="ایجاد نوع حیوان جدید"
      >
        <Form<PetTypeInput>
          ref={formRef}
          id={CREATE_PET_TYPE_FORM_ID}
          validationSchema={petTypeSchema}
          options={{
            defaultValues: {
              title: '',
              description: { type: 'doc', content: [] },
              mainImage: undefined,
            },
          }}
          handleSubmit={handleSubmit}
          aria-label="فرم ایجاد نوع حیوان"
        >
          <TextField<PetTypeInput> name="title" label="عنوان" placeholder="مانند سگ" required />
          <RichTextField<PetTypeInput> name="description" label="توضیحات" required />
          <PetTypeMainImageField />
        </Form>
      </FormDialogContent>
    </Dialog>
  );
}
