import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

import { CategoriesSectionEmptyState } from './categories-section-empty-state';
import { CategoriesSectionRenderer } from './categories-section-renderer';

type CategoriesSectionContentProps = Readonly<{
  petTypesPromise: Promise<LandingPetTypeDTO[]>;
}>;

export function CategoriesSectionContent({ petTypesPromise }: CategoriesSectionContentProps) {
  const petTypes = use(petTypesPromise);

  return (
    <EmptyStateBoundary data={petTypes} fallback={<CategoriesSectionEmptyState />}>
      <CategoriesSectionRenderer petTypes={petTypes} />
    </EmptyStateBoundary>
  );
}
