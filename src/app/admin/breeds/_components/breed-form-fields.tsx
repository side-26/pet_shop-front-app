'use client';

import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import type { UpdateBreedInput } from '@/entities/breeds/breeds.schema';

import { BreedMainImageField } from './breed-main-image-field';
import { CountrySelectOption, PetTypeSelectOption } from './breed-select-option';
import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

const levelOptions = [0, 1, 2, 3, 4].map((level) => ({
  value: String(level),
  label: String(level),
}));

type Props = {
  disabled?: boolean;
  initialImageUrl?: string | null;
  imageRequired?: boolean;
  countries: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
};

export function BreedFormFields({
  disabled = false,
  initialImageUrl,
  imageRequired = false,
  countries,
  petTypes,
}: Props) {
  return (
    <fieldset disabled={disabled} className="tw:flex tw:flex-col tw:gap-5">
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
        <TextField<UpdateBreedInput> name="title" label="عنوان" required />
        <SelectField<UpdateBreedInput>
          name="petType"
          label="نوع حیوان"
          options={petTypes.map((option) => ({
            value: option.value,
            label: <PetTypeSelectOption option={option} />,
          }))}
          required
          disabled={disabled}
        />
        <SelectField<UpdateBreedInput>
          name="country"
          label="کشور مبدأ"
          options={countries.map((option) => ({
            value: option.value,
            label: <CountrySelectOption option={option} />,
          }))}
          disabled={disabled}
        />
        <TextField<UpdateBreedInput> name="ageAverage" label="میانگین سن" required />
        <SelectField<UpdateBreedInput>
          name="size"
          label="اندازه (۰ تا ۴)"
          options={levelOptions}
          required
          disabled={disabled}
        />
        <SelectField<UpdateBreedInput>
          name="activityLevel"
          label="سطح فعالیت (۰ تا ۴)"
          options={levelOptions}
          disabled={disabled}
        />
      </div>
      <BreedMainImageField initialImageUrl={initialImageUrl} required={imageRequired} />
    </fieldset>
  );
}
