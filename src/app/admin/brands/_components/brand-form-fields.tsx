'use client';

import { TextField } from '@/components/ui/fields/text-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import type { BrandInput } from '@/entities/brands/brands.schema';

import { BrandLogoField } from './brand-logo-field';

export function BrandFormFields({
  disabled = false,
  initialLogoUrl,
}: {
  disabled?: boolean;
  initialLogoUrl?: string | null;
}) {
  return (
    <fieldset disabled={disabled} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
        <TextField<BrandInput> name="title" label="عنوان" required dir="ltr" />
        <TextField<BrandInput> name="title_fa" label="عنوان فارسی" required />
      </div>
      <TextareaField<BrandInput> name="description" label="توضیحات" className="tw:min-h-28" />
      <BrandLogoField initialImageUrl={initialLogoUrl} />
    </fieldset>
  );
}
