import type { CustomerPetDetailsPageDTO } from '@/entities/pets/pets.dto';
import type { FetcherResult } from '@/lib/api/customFetcher';

import { PetListFetchError } from './pet-list-fetch-error';
import { PetListRenderer } from './pet-list-renderer';

type PetListContainerProps = Readonly<{
  petsPromise: Promise<FetcherResult<CustomerPetDetailsPageDTO>>;
  query: Readonly<Record<string, string>>;
}>;

export async function PetListContainer({ petsPromise, query }: PetListContainerProps) {
  const result = await petsPromise;
  if (!result.isSuccess) return <PetListFetchError description={result.message} />;
  return <PetListRenderer data={result.data} query={query} />;
}
