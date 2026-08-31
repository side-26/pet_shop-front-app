import { Suspense } from 'react';

import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';
import { getCountriesAction } from '@/entities/countries/countries.actions';

import type { BreedsSearchParams } from '../page';
import { parseBreedsFilterSearchParams } from './breeds-filter.helpers';
import { BreedsHeaderActions } from './breeds-header-actions';

type Props = { searchParams: Promise<BreedsSearchParams> };

async function BreedsHeaderActionsContainer({ searchParams }: Props) {
  const [query, countriesResult, petTypesResult] = await Promise.all([
    searchParams,
    getCountriesAction(),
    getAllPetTypesAction({ includeDisabled: false }),
  ]);
  const countries = countriesResult.isSuccess
    ? countriesResult.data.map(({ title, titleFa, logo }) => ({
        value: titleFa || title,
        label: titleFa || title,
        logo,
      }))
    : [];
  const petTypes = petTypesResult.isSuccess
    ? petTypesResult.data.map(({ id, title, mainImage, thumbnail }) => ({
        value: id,
        label: title,
        mainImage,
        thumbnail,
      }))
    : [];

  return (
    <BreedsHeaderActions
      initialValues={parseBreedsFilterSearchParams(query)}
      countries={countries}
      petTypes={petTypes}
    />
  );
}

export function BreedsHeaderActionsWrapper(props: Props) {
  return (
    <Suspense fallback={<BreedsHeaderActions petTypes={[]} />}>
      <BreedsHeaderActionsContainer {...props} />
    </Suspense>
  );
}
