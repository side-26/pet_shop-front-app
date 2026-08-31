import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';

import { mapPetTypesTableRows } from './pet-types-table.mapper';
import { PetTypesTable } from './pet-types-table';

type PetTypesTableContainerProps = {
  petTypesPromise: ReturnType<typeof getAllPetTypesAction>;
};

export async function PetTypesTableContainer({ petTypesPromise }: PetTypesTableContainerProps) {
  const result = await petTypesPromise;

  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت انواع حیوان انجام نشد</EmptyTitle>
          <EmptyDescription>
            {result.message ?? 'خطایی در دریافت انواع حیوان رخ داد.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <PetTypesTable petTypes={mapPetTypesTableRows(result.data)} />;
}
