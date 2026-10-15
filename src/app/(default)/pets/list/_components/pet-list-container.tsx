import { use } from 'react';

import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetListRenderer } from './pet-list-renderer';

type PetListContainerProps = Readonly<{
  petsPromise: Promise<LandingPetListPageDTO>;
  query: Readonly<Record<string, string>>;
}>;

export function PetListContainer({ petsPromise, query }: PetListContainerProps) {
  const data = use(petsPromise);
  return <PetListRenderer data={data} query={query} />;
}
