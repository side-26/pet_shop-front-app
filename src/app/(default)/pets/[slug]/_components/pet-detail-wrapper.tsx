import { Suspense } from 'react';

import { getLandingPetBySlugAction } from '@/entities/landing/landing.actions';

import { PetDetailContainer } from './pet-detail-container';
import { PetDetailContent } from './pet-detail-content';
import { petDetailSkeleton } from './pet-detail-data';

type PetDetailWrapperProps = Readonly<{ paramsPromise: Promise<{ slug: string }> }>;

export function PetDetailWrapper({ paramsPromise }: PetDetailWrapperProps) {
  const slugPromise = paramsPromise.then(({ slug }) => slug);
  const petPromise = slugPromise.then(getLandingPetBySlugAction);
  return (
    <Suspense fallback={<PetDetailContent pet={petDetailSkeleton} isSkeleton />}>
      <PetDetailContainer petPromise={petPromise} slugPromise={slugPromise} />
    </Suspense>
  );
}
