import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getManagementPetsAction } from '@/entities/pets/pets.actions';

import { PetsPaginateTable } from './pets-paginate-table';
import { mapPetsPageViewModel } from './pets-table.mapper';

type Props = {
  petsPromise: ReturnType<typeof getManagementPetsAction>;
  query: Record<string, string>;
};

export async function PetsTableContainer({ petsPromise, query }: Props) {
  const result = await petsPromise;
  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت حیوانات انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'خطایی در دریافت حیوانات رخ داد.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return <PetsPaginateTable {...mapPetsPageViewModel(result.data)} query={query} />;
}
