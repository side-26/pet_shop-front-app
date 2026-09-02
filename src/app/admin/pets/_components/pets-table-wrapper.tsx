import { Suspense } from 'react';

import { getManagementPetsAction } from '@/entities/pets/pets.actions';

import { PetsPaginateTable } from './pets-paginate-table';
import { petsTableSkeletonData } from './pets-table-skeleton-data';
import { PetsTableContainer } from './pets-table-container';

type Props = { page: number; query: Record<string, string> };

export function PetsTableWrapper({ page, query }: Props) {
  const petsPromise = getManagementPetsAction(query);
  return (
    <Suspense
      key={JSON.stringify(query)}
      fallback={
        <PetsPaginateTable
          pets={petsTableSkeletonData}
          page={page}
          pageCount={1}
          total={petsTableSkeletonData.length}
          query={query}
          isLoading
        />
      }
    >
      <PetsTableContainer petsPromise={petsPromise} query={query} />
    </Suspense>
  );
}
