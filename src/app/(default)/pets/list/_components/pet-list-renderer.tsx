import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetListInteractive } from './pet-list-interactive';

type PetListRendererProps = Readonly<{
  data: LandingPetListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function PetListRenderer({ data, isSkeleton = false, query }: PetListRendererProps) {
  return <PetListInteractive data={data} isSkeleton={isSkeleton} query={query} />;
}
