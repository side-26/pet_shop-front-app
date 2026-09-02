import { Suspense } from 'react';

import { getPetFormOptionsAction } from '@/entities/pets/pets.actions';

import { parsePetsFilterSearchParams, type SearchParams } from './pets-filter.helpers';
import { PetsHeaderActions } from './pets-header-actions';

type Props = { searchParams: Promise<SearchParams> };
async function Content({ searchParams }: Props) {
  const [params, options] = await Promise.all([searchParams, getPetFormOptionsAction()]);
  return (
    <PetsHeaderActions
      initialValues={parsePetsFilterSearchParams(params)}
      formOptions={options.isSuccess ? options.data : undefined}
    />
  );
}
export function PetsHeaderActionsWrapper({ searchParams }: Props) {
  return (
    <Suspense fallback={<PetsHeaderActions />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
