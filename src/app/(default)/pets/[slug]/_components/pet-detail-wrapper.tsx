import { Suspense } from 'react';

import { getLandingPetBySlug } from '@/entities/landing/landing.service';

import { PetDetailContainer } from './pet-detail-container';
import { PetDetailContent } from './pet-detail-content';
import { petDetailSkeleton } from './pet-detail-data';

type PetDetailWrapperProps = Readonly<{ paramsPromise: Promise<{ slug: string }> }>;

export function PetDetailWrapper({ paramsPromise }: PetDetailWrapperProps) {
  const slugPromise = paramsPromise.then(({ slug }) => slug);
  const petPromise = slugPromise.then(getLandingPetBySlug);
  return (
    <Suspense fallback={<PetDetailContent pet={petDetailSkeleton} isSkeleton />}>
      <PetDetailContainer petPromise={petPromise} slugPromise={slugPromise} />
    </Suspense>
  );
}
