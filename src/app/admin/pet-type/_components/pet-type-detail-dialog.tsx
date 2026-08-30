'use client';

import { Suspense, use } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form } from '@/components/ui/form';
import { TextField } from '@/components/ui/fields/text-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { getPetTypeByIdAction } from '@/entities/pet-types/pet-types.actions';
import { useUpdatePetType } from '@/entities/pet-types/pet-types.client';
import { petTypeSchema, type PetTypeInput } from '@/entities/pet-types/pet-types.schema';

const PET_TYPE_DETAIL_FORM_ID = 'pet-type-detail-form';
type Props = {
  request: ReturnType<typeof getPetTypeByIdAction>;
  onClose: () => void;
  onUpdated: () => void;
};

type EditFormProps = Omit<Props, 'request'> & {
  petType: {
    id: string;
    title: string;
    description: string;
  };
};

function EditForm({ petType, onClose, onUpdated }: EditFormProps) {
  const { formRef, handleSubmit, isPending } = useUpdatePetType(petType.id, onUpdated);

  return (
    <FormDialogContent
      formId={PET_TYPE_DETAIL_FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title="مشاهده و ویرایش نوع حیوان"
    >
      <Form<PetTypeInput>
        key={petType.id}
        ref={formRef}
        id={PET_TYPE_DETAIL_FORM_ID}
        validationSchema={petTypeSchema}
        options={{
          defaultValues: { title: petType.title, description: petType.description },
        }}
        handleSubmit={handleSubmit}
        aria-label="فرم ویرایش نوع حیوان"
      >
        <TextField<PetTypeInput> name="title" label="عنوان" required />
        <TextareaField<PetTypeInput> name="description" label="توضیحات" counter maxLength={150} />
      </Form>
    </FormDialogContent>
  );
}

function Content({ request, onClose, onUpdated }: Props) {
  const result = use(request);

  if (!result.isSuccess) return <p role="alert">{result.message}</p>;

  return <EditForm petType={result.data} onClose={onClose} onUpdated={onUpdated} />;
}
export function PetTypeDetailDialog({ request, onClose, onUpdated }: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Suspense
        fallback={
          <FormDialogContent
            formId={PET_TYPE_DETAIL_FORM_ID}
            isLoading
            onClose={onClose}
            submitText="ذخیره تغییرات"
            title="مشاهده و ویرایش نوع حیوان"
          >
            <div />
          </FormDialogContent>
        }
      >
        <Content request={request} onClose={onClose} onUpdated={onUpdated} />
      </Suspense>
    </Dialog>
  );
}
