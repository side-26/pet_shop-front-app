'use client';

import { useRouter } from 'next/navigation';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { routePaths } from '@/configs/route.path';

import type { PetsFilterValues } from './pets-filter.helpers';
import type { PetFormOptions } from './pet-form-options.types';
import { PetRelationFields } from './pet-relation-fields';

const FORM_ID = 'pets-filter-form';
const enabledOptions = [
  { label: 'هر دو', value: null },
  { label: 'فعال', value: true },
  { label: 'غیرفعال', value: false },
] as const;
const sortOptions = [
  { label: 'پیش‌فرض', value: '' },
  { label: 'عنوان', value: 'title' },
  { label: 'تاریخ ایجاد', value: 'createdAt' },
  { label: 'تاریخ ویرایش', value: 'updatedAt' },
  { label: 'قیمت', value: 'price' },
  { label: 'موجودی', value: 'quantity' },
] as const;
type Props = {
  formOptions?: PetFormOptions;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<PetsFilterValues>;
};

export function PetsFilterDialog({ formOptions, open, onOpenChange, initialValues }: Props) {
  const router = useRouter();
  const defaults: PetsFilterValues = {
    title: initialValues?.title ?? '',
    petType: initialValues?.petType ?? '',
    breed: initialValues?.breed ?? '',
    quantity: initialValues?.quantity,
    isEnable: initialValues?.isEnable ?? null,
    page: initialValues?.page ?? 1,
    limit: initialValues?.limit ?? 10,
    sort: initialValues?.sort ?? '',
  };
  function submit(values: PetsFilterValues) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (key === 'page' || value === '' || value == null) continue;
      params.set(key, String(value));
    }
    params.set('page', '1');
    router.push(routePaths.adminPetsQuery(params), { scroll: false });
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FilterFormDialogContent
        formId={FORM_ID}
        title="فیلتر حیوانات"
        size="lg"
        onClose={() => onOpenChange(false)}
        contentClassName="tw:grid tw:gap-4 tw:sm:grid-cols-2"
      >
        <Form<PetsFilterValues>
          key={JSON.stringify({ open, defaults })}
          id={FORM_ID}
          options={{ defaultValues: defaults }}
          handleSubmit={submit}
          className="tw:contents"
          aria-label="فیلتر حیوانات"
        >
          <TextField<PetsFilterValues> name="title" label="عنوان" />
          <PetRelationFields<PetsFilterValues>
            petTypeName="petType"
            breedName="breed"
            petTypes={formOptions?.petTypes ?? []}
          />
          <TextField<PetsFilterValues> name="quantity" label="موجودی" type="number" min={0} />
          <SelectField<PetsFilterValues> name="isEnable" label="وضعیت" options={enabledOptions} />
          <SelectField<PetsFilterValues> name="sort" label="مرتب‌سازی" options={sortOptions} />
        </Form>
      </FilterFormDialogContent>
    </Dialog>
  );
}
