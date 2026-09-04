'use client';

import { useWatch, type FieldPath, type FieldValues } from 'react-hook-form';

import { SelectField } from '@/components/ui/fields/select-field';

import type { ProductFormOptions } from './product-form-options.types';

type Props<T extends FieldValues> = {
  categoryName: FieldPath<T>;
  subCategoryName: FieldPath<T>;
  options: ProductFormOptions;
  disabled?: boolean;
};

export function ProductRelationFields<T extends FieldValues>({
  categoryName,
  subCategoryName,
  options,
  disabled = false,
}: Props<T>) {
  const category = useWatch<T>({ name: categoryName });
  return (
    <>
      <SelectField<T>
        name={categoryName}
        label="دسته‌بندی"
        options={options.categories.map(({ id, title }) => ({ value: id, label: title }))}
        disabled={disabled}
        required
      />
      <SelectField<T>
        name={subCategoryName}
        label="زیر دسته‌بندی"
        options={options.subCategories
          .filter(({ category: categoryId }) => !category || categoryId === category)
          .map(({ id, title }) => ({ value: id, label: title }))}
        disabled={disabled || !category}
      />
    </>
  );
}
