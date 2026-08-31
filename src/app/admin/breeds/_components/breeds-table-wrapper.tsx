import { Suspense } from 'react';

import { getBreedsPageAction } from '@/entities/breeds/breeds.actions';
import type { BreedQueryInput } from '@/entities/breeds/breeds.schema';
import { getCountriesAction } from '@/entities/countries/countries.actions';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { BreedsPaginateTable } from './breeds-paginate-table';
import { BreedsTableContainer } from './breeds-table-container';
import { breedsTableSkeletonData } from './breeds-table-skeleton-data';

type Props = { page: number; query: BreedQueryInput };

export function BreedsTableWrapper({ page, query }: Props) {
  const breedsPromise = getBreedsPageAction(query);
  const countriesPromise = getCountriesAction();
  const petTypesPromise = getAllPetTypesAction({ includeDisabled: true });
  const rendererQuery = Object.fromEntries(
    Object.entries(query).flatMap(([name, value]) =>
      value == null || value === '' ? [] : [[name, String(value)]],
    ),
  );

  return (
    <Suspense
      key={JSON.stringify(rendererQuery)}
      fallback={
        <BreedsPaginateTable
          breeds={breedsTableSkeletonData}
          page={page}
          pageCount={1}
          total={breedsTableSkeletonData.length}
          query={rendererQuery}
          isLoading
        />
      }
    >
      <BreedsTableContainer
        breedsPromise={breedsPromise}
        countriesPromise={countriesPromise}
        petTypesPromise={petTypesPromise}
        query={rendererQuery}
      />
    </Suspense>
  );
}
