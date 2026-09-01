'use client';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useCreateCategory } from '@/entities/categories/categories.client';
import { categorySchema, type CategoryInput } from '@/entities/categories/categories.schema';

import type { CategoryPetTypeOption } from './categories-form.types';
import { CategoryFormFields } from './category-form-fields';

const FORM_ID = 'create-category-form';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  petTypes: readonly CategoryPetTypeOption[];
};

export function CreateCategoryDialog({ open, onOpenChange, onCreated, petTypes }: Props) {
  const { formRef, handleSubmit, isPending } = useCreateCategory(onCreated);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent
        formId={FORM_ID}
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        submitText="ایجاد دسته‌بندی"
        title="ایجاد دسته‌بندی جدید"
        size="lg"
        contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
      >
        <Form<CategoryInput>
          ref={formRef}
          id={FORM_ID}
          validationSchema={categorySchema}
          options={{
            defaultValues: { title: '', petType: '', isEnable: true, mainImage: undefined },
          }}
          handleSubmit={handleSubmit}
          aria-label="فرم ایجاد دسته‌بندی"
        >
          <CategoryFormFields petTypes={petTypes} showIsEnable={false} />
        </Form>
      </FormDialogContent>
    </Dialog>
  );
}
