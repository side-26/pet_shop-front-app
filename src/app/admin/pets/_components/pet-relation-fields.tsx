'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { type FieldPath, type FieldValues, useFormContext } from 'react-hook-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SelectField } from '@/components/ui/fields/select-field';
import { getBreedsAction } from '@/entities/breeds/breeds.actions';

import type { PetRelationOption } from './pet-form-options.types';

type Props<T extends FieldValues> = {
  breedName: FieldPath<T>;
  disabled?: boolean;
  petTypeName: FieldPath<T>;
  petTypes: readonly PetRelationOption[];
};

const options = (items: readonly PetRelationOption[]) =>
  items.map((item) => ({
    value: item.id,
    label: (
      <span className="tw:flex tw:items-center tw:gap-2">
        <Avatar size="sm">
          <AvatarImage src={item.image} alt="" />
          <AvatarFallback>{item.title.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span>{item.title}</span>
      </span>
    ),
  }));

export function PetRelationFields<T extends FieldValues>({
  breedName,
  disabled = false,
  petTypeName,
  petTypes,
}: Props<T>) {
  const { getValues, setValue } = useFormContext<T>();
  const [breeds, setBreeds] = useState<PetRelationOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const requestId = useRef(0);
  const loadBreeds = (petType: string | boolean | null, resetBreed: boolean) => {
    if (resetBreed) setValue(breedName, '' as never, { shouldDirty: true });
    setBreeds([]);
    if (typeof petType !== 'string' || !petType) return;
    const currentRequest = ++requestId.current;
    startTransition(async () => {
      const result = await getBreedsAction({ petType, includeDisabled: false });
      if (currentRequest !== requestId.current || !result.isSuccess) return;
      setBreeds(result.data.map(({ id, title, mainImage }) => ({ id, title, image: mainImage })));
    });
  };

  useEffect(() => {
    const petType = getValues(petTypeName);
    if (typeof petType !== 'string' || !petType) return;

    const currentRequest = ++requestId.current;
    startTransition(async () => {
      const result = await getBreedsAction({ petType, includeDisabled: false });
      if (currentRequest !== requestId.current || !result.isSuccess) return;
      setBreeds(result.data.map(({ id, title, mainImage }) => ({ id, title, image: mainImage })));
    });
    // Load the persisted breed list once when editing an existing pet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SelectField<T>
        name={petTypeName}
        label="نوع حیوان"
        options={options(petTypes)}
        emptyText="نوع حیوانی برای انتخاب وجود ندارد."
        disabled={disabled}
        onValueChange={(value) => loadBreeds(value, true)}
      />
      <SelectField<T>
        name={breedName}
        label="نژاد"
        options={options(breeds)}
        emptyText={
          getValues(petTypeName)
            ? 'نژادی برای انتخاب وجود ندارد.'
            : 'ابتدا نوع حیوان را انتخاب کنید.'
        }
        disabled={disabled || isPending || !getValues(petTypeName)}
      />
    </>
  );
}
