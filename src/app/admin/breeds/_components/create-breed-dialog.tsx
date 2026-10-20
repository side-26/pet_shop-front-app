'use client';

import { adminDialogScrollableContentClassName } from '@/app/admin/_components/admin-dialog.styles';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useCreateBreed } from '@/entities/breeds/breeds.client';
import { breedSchema, type UpdateBreedInput } from '@/entities/breeds/breeds.schema';

import { BreedFormFields } from './breed-form-fields';
import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

const FORM_ID = 'create-breed-form';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  countries: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
};

export function CreateBreedDialog({ open, onOpenChange, onCreated, countries, petTypes }: Props) {
  const { formRef, handleSubmit, isPending } = useCreateBreed(onCreated);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent
        formId={FORM_ID}
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        submitText="ایجاد نژاد"
        title="ایجاد نژاد جدید"
        size="lg"
        contentClassName={adminDialogScrollableContentClassName}
      >
        <Form<UpdateBreedInput>
          ref={formRef}
          id={FORM_ID}
          validationSchema={breedSchema}
          options={{
            defaultValues: {
              title: '',
              petType: '',
              country: null,
              ageAverage: '',
              size: 2,
              activityLevel: null,
              enable: true,
              mainImage: undefined,
            },
          }}
          handleSubmit={handleSubmit}
          aria-label="فرم ایجاد نژاد"
        >
          <BreedFormFields countries={countries} petTypes={petTypes} imageRequired />
        </Form>
      </FormDialogContent>
    </Dialog>
  );
}
