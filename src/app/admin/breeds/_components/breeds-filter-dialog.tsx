'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { routePaths } from '@/configs/route.path';

import { CountrySelectOption, PetTypeSelectOption } from './breed-select-option';
import {
  createBreedsFilterValues,
  toBreedsSearchParams,
  type BreedsFilterValues,
} from './breeds-filter.helpers';
import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

const FORM_ID = 'breeds-filter-form';
const sortOptions = [
  { value: 'title', label: 'عنوان' },
  { value: 'createdAt', label: 'تاریخ ایجاد' },
  { value: 'updatedAt', label: 'تاریخ ویرایش' },
] as const;
const enabledOptions = [
  { value: true, label: 'همه وضعیت‌ها' },
  { value: false, label: 'فقط فعال' },
] as const;
const sizeOptions = [
  { value: '', label: 'همه اندازه‌ها' },
  { value: '0', label: 'بسیار کوچک' },
  { value: '1', label: 'کوچک' },
  { value: '2', label: 'متوسط' },
  { value: '3', label: 'بزرگ' },
  { value: '4', label: 'بسیار بزرگ' },
] as const;
const activityLevelOptions = [
  { value: '', label: 'همه سطوح فعالیت' },
  { value: '0', label: 'بسیار کم' },
  { value: '1', label: 'کم' },
  { value: '2', label: 'متوسط' },
  { value: '3', label: 'زیاد' },
  { value: '4', label: 'بسیار زیاد' },
] as const;

type Props = {
  initialValues?: Partial<BreedsFilterValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countries?: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
};

export function BreedsFilterDialog({
  initialValues,
  open,
  onOpenChange,
  countries = [],
  petTypes,
}: Props) {
  const router = useRouter();
  const defaultValues = createBreedsFilterValues(initialValues);

  function handleSubmit(values: BreedsFilterValues) {
    router.push(routePaths.adminBreedsQuery(toBreedsSearchParams(values)), { scroll: false });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FilterFormDialogContent
        formId={FORM_ID}
        onClose={() => onOpenChange(false)}
        title="فیلتر نژادها"
        size="lg"
        contentClassName="tw:grid tw:gap-4 tw:sm:grid-cols-2"
      >
        <Form<BreedsFilterValues>
          key={JSON.stringify({ open, defaultValues })}
          id={FORM_ID}
          options={{ defaultValues }}
          handleSubmit={handleSubmit}
          className="tw:contents"
          aria-label="فیلتر نژادها"
        >
          <TextField<BreedsFilterValues>
            name="search"
            label="جست‌وجو"
            placeholder="عنوان نژاد"
            prefixIcon={<SearchIcon />}
          />
          <TextField<BreedsFilterValues> name="title" label="عنوان" />
          <SelectField<BreedsFilterValues>
            name="petType"
            label="نوع حیوان"
            options={[
              { value: '', label: 'همه انواع حیوان' },
              ...petTypes.map((option) => ({
                value: option.value,
                label: <PetTypeSelectOption option={option} />,
              })),
            ]}
          />
          <SelectField<BreedsFilterValues>
            name="country"
            label="کشور مبدأ"
            options={[
              { value: '', label: 'همه کشورها' },
              ...countries.map((option) => ({
                value: option.value,
                label: <CountrySelectOption option={option} />,
              })),
            ]}
          />
          <SelectField<BreedsFilterValues> name="size" label="اندازه" options={sizeOptions} />
          <SelectField<BreedsFilterValues>
            name="activityLevel"
            label="سطح فعالیت"
            options={activityLevelOptions}
          />
          <SelectField<BreedsFilterValues> name="sort" label="مرتب‌سازی" options={sortOptions} />
          <SelectField<BreedsFilterValues>
            name="includeDisabled"
            label="وضعیت"
            options={enabledOptions}
          />
        </Form>
      </FilterFormDialogContent>
    </Dialog>
  );
}
