'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import type { SubCategoryInput } from '@/entities/sub-categories/sub-categories.schema';

import type { SubCategoryOption } from './sub-categories-form.types';

type Props = {
  categories: readonly SubCategoryOption[];
  disabled?: boolean;
};

export function SubCategoryFormFields({ categories, disabled = false }: Props) {
  const options = categories.map((category) => ({
    value: category.value,
    label: (
      <span className="tw:flex tw:items-center tw:gap-2">
        <Avatar
          size="sm"
          aria-hidden="true"
          style={{
            backgroundImage: `url("${category.mainThumbnailImage}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <AvatarImage src={category.mainImage} alt="" />
          <AvatarFallback className="tw:bg-transparent" />
        </Avatar>
        <span>{category.title}</span>
      </span>
    ),
  }));

  return (
    <fieldset disabled={disabled} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
      <TextField<SubCategoryInput> name="title" label="عنوان" required />
      <SelectField<SubCategoryInput>
        name="category"
        label="دسته‌بندی"
        options={options}
        required
        disabled={disabled}
      />
    </fieldset>
  );
}
