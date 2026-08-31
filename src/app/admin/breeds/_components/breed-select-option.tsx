import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

type PetTypeProps = { option: BreedPetTypeOption };

export function PetTypeSelectOption({ option }: PetTypeProps) {
  return (
    <span className="tw:flex tw:items-center tw:gap-2">
      <Avatar
        size="sm"
        style={
          option.thumbnail
            ? {
                backgroundImage: `url("${option.thumbnail}")`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }
            : undefined
        }
      >
        <AvatarImage src={option.mainImage || undefined} alt="" />
        <AvatarFallback className="tw:bg-transparent" />
      </Avatar>
      <span>{option.label}</span>
    </span>
  );
}

type CountryProps = { option: BreedCountryOption };

export function CountrySelectOption({ option }: CountryProps) {
  return (
    <span className="tw:flex tw:items-center tw:gap-2">
      <Avatar size="sm">
        <AvatarImage src={option.logo} alt="" />
        <AvatarFallback>{option.label.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <span>{option.label}</span>
    </span>
  );
}
