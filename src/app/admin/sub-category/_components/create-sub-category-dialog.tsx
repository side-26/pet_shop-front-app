'use client';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useCreateSubCategory } from '@/entities/sub-categories/sub-categories.client';
import {
  subCategorySchema,
  type SubCategoryInput,
} from '@/entities/sub-categories/sub-categories.schema';

import type { SubCategoryOption } from './sub-categories-form.types';
import { SubCategoryFormFields } from './sub-category-form-fields';

const FORM_ID = 'create-sub-category-form';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  categories: readonly SubCategoryOption[];
};

export function CreateSubCategoryDialog({ open, onOpenChange, onCreated, categories }: Props) {
  const { formRef, handleSubmit, isPending } = useCreateSubCategory(onCreated);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent
        formId={FORM_ID}
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        submitText="ایجاد زیر دسته‌بندی"
        title="ایجاد زیر دسته‌بندی جدید"
        size="md"
      >
        <Form<SubCategoryInput>
          ref={formRef}
          id={FORM_ID}
          validationSchema={subCategorySchema}
          options={{ defaultValues: { title: '', category: '' } }}
          handleSubmit={handleSubmit}
          aria-label="فرم ایجاد زیر دسته‌بندی"
        >
          <SubCategoryFormFields categories={categories} />
        </Form>
      </FormDialogContent>
    </Dialog>
  );
}
