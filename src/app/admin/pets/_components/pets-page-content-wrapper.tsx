import { Suspense } from 'react';

import { PetsPaginateTable } from './pets-paginate-table';
import { petsTableSkeletonData } from './pets-table-skeleton-data';
import { PetsTableWrapper } from './pets-table-wrapper';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const KEYS = [
  'title',
  'petType',
  'breed',
  'quantity',
  'isEnable',
  'page',
  'limit',
  'sort',
] as const;

async function PetsPageContent({ searchParams }: Props) {
  const params = await searchParams;
  const query = Object.fromEntries(
    KEYS.flatMap((key) => {
      const value = Array.isArray(params[key]) ? params[key][0] : params[key];
      return value === undefined ? [] : [[key, value]];
    }),
  );
  const requestedPage = Number(query.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  return <PetsTableWrapper page={page} query={query} />;
}

export function PetsPageContentWrapper({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <PetsPaginateTable
          pets={petsTableSkeletonData}
          page={1}
          pageCount={1}
          total={petsTableSkeletonData.length}
          query={{}}
          isLoading
        />
      }
    >
      <PetsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
