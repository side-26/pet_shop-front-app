'use client';

import { SelectField } from '@/components/ui/fields/select-field';
import { SwitchField } from '@/components/ui/fields/switch-field';
import { TextField } from '@/components/ui/fields/text-field';
import type { CategoryInput } from '@/entities/categories/categories.schema';

import type { CategoryPetTypeOption } from './categories-form.types';
import { CategoryMainImageField } from './category-main-image-field';

type Props = {
  disabled?: boolean;
  initialImageUrl?: string | null;
  imageRequired?: boolean;
  petTypes: readonly CategoryPetTypeOption[];
  showIsEnable?: boolean;
};

export function CategoryFormFields({
  disabled = false,
  initialImageUrl,
  imageRequired = true,
  petTypes,
  showIsEnable = true,
}: Props) {
  return (
    <fieldset disabled={disabled} className="tw:flex tw:flex-col tw:gap-5">
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
        <TextField<CategoryInput> name="title" label="عنوان" required />
        <SelectField<CategoryInput>
          name="petType"
          label="نوع حیوان"
          options={petTypes}
          required
          disabled={disabled}
        />
        {showIsEnable ? (
          <SwitchField<CategoryInput> name="isEnable" label="فعال" disabled={disabled} />
        ) : null}
      </div>
      <CategoryMainImageField initialImageUrl={initialImageUrl} required={imageRequired} />
    </fieldset>
  );
}
