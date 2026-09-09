'use client';

import { useWatch, type FieldPath, type FieldValues } from 'react-hook-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SelectField } from '@/components/ui/fields/select-field';

import type { ProductFormOptions } from './product-form-options.types';

type Props<T extends FieldValues> = {
  categoryName: FieldPath<T>;
  subCategoryName: FieldPath<T>;
  options: ProductFormOptions;
  disabled?: boolean;
  categoryClassName?: string;
  subCategoryClassName?: string;
};

type BrandProps<T extends FieldValues> = {
  name: FieldPath<T>;
  options: ProductFormOptions;
  disabled?: boolean;
  className?: string;
};

export function ProductBrandField<T extends FieldValues>({
  name,
  options,
  disabled = false,
  className,
}: BrandProps<T>) {
  return (
    <SelectField<T>
      name={name}
      label="برند"
      options={options.brands.map(({ id, title, logo, thumbnailLogo }) => ({
        value: id,
        label: (
          <span className="tw:flex tw:items-center tw:gap-2">
            <Avatar
              size="sm"
              aria-hidden="true"
              style={
                thumbnailLogo
                  ? {
                      backgroundImage: `url("${thumbnailLogo}")`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }
                  : undefined
              }
            >
              <AvatarImage src={logo ?? undefined} alt="" />
              <AvatarFallback className={thumbnailLogo ? 'tw:bg-transparent' : undefined}>
                {title.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span>{title}</span>
          </span>
        ),
      }))}
      disabled={disabled}
      required
      className={className}
    />
  );
}

export function ProductRelationFields<T extends FieldValues>({
  categoryName,
  subCategoryName,
  options,
  disabled = false,
  categoryClassName,
  subCategoryClassName,
}: Props<T>) {
  const category = useWatch<T>({ name: categoryName });
  return (
    <>
      <SelectField<T>
        name={categoryName}
        label="دسته‌بندی"
        options={options.categories.map(
          ({ id, title, petTypeTitle, mainImage, mainThumbnailImage }) => ({
            value: id,
            label: (
              <span className="tw:flex tw:items-center tw:gap-2">
                <Avatar
                  size="sm"
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url("${mainThumbnailImage}")`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                >
                  <AvatarImage src={mainImage} alt="" />
                  <AvatarFallback className="tw:bg-transparent" />
                </Avatar>
                <span>{`${title} - ${petTypeTitle}`}</span>
              </span>
            ),
          }),
        )}
        disabled={disabled}
        required
        className={categoryClassName}
      />
      <SelectField<T>
        name={subCategoryName}
        label="زیر دسته‌بندی"
        options={options.subCategories
          .filter(({ category: categoryId }) => !category || categoryId === category)
          .map(({ id, title }) => ({ value: id, label: title }))}
        disabled={disabled || !category}
        className={subCategoryClassName}
      />
    </>
  );
}
