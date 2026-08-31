import { Suspense } from 'react';

import type { BreedQueryInput } from '@/entities/breeds/breeds.schema';

import type { BreedsSearchParams } from '../page';
import { parseBreedsFilterSearchParams } from './breeds-filter.helpers';
import { BreedsPaginateTable } from './breeds-paginate-table';
import { breedsTableSkeletonData } from './breeds-table-skeleton-data';
import { BreedsTableWrapper } from './breeds-table-wrapper';

type Props = { searchParams: Promise<BreedsSearchParams> };

async function BreedsPageContent({ searchParams }: Props) {
  const values = parseBreedsFilterSearchParams(await searchParams);
  const query: BreedQueryInput = {
    ...values,
    title: values.title || undefined,
    petType: values.petType || undefined,
    country: values.country || undefined,
    size: values.size === '' ? undefined : Number(values.size),
    activityLevel: values.activityLevel === '' ? undefined : Number(values.activityLevel),
    search: values.search || undefined,
  };

  return <BreedsTableWrapper page={values.page} query={query} />;
}

export function BreedsPageContentWrapper(props: Props) {
  return (
    <Suspense
      fallback={
        <BreedsPaginateTable
          breeds={breedsTableSkeletonData}
          page={1}
          pageCount={1}
          total={breedsTableSkeletonData.length}
          query={{}}
          isLoading
        />
      }
    >
      <BreedsPageContent {...props} />
    </Suspense>
  );
}
