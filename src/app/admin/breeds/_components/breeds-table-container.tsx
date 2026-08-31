import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getBreedsPageAction } from '@/entities/breeds/breeds.actions';
import type { getCountriesAction } from '@/entities/countries/countries.actions';
import type { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { BreedsPaginateTable } from './breeds-paginate-table';
import { mapBreedsPageViewModel } from './breeds-table.mapper';

type Props = {
  breedsPromise: ReturnType<typeof getBreedsPageAction>;
  countriesPromise?: ReturnType<typeof getCountriesAction>;
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
  query: Record<string, string>;
};

export async function BreedsTableContainer({
  breedsPromise,
  countriesPromise,
  petTypesPromise,
  query,
}: Props) {
  const [result, countriesResult, petTypesResult] = await Promise.all([
    breedsPromise,
    countriesPromise ?? Promise.resolve(null),
    petTypesPromise,
  ]);

  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت نژادها انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'خطایی در دریافت نژادها رخ داد.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const countries = countriesResult?.isSuccess
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
  const petTypeTitles = new Map(petTypes.map(({ value, label }) => [value, label]));
  return (
    <BreedsPaginateTable
      {...mapBreedsPageViewModel(result.data, petTypeTitles)}
      query={query}
      countries={countries}
      petTypes={petTypes}
    />
  );
}
