import { Suspense } from 'react';

import { getLandingPetBySlugAction } from '@/entities/landing/landing.actions';

import { PetDetailContainer } from './pet-detail-container';
import { PetDetailRenderer } from './pet-detail-renderer';
import { PetDetailErrorBoundary } from './pet-detail-error-boundary';
import { petDetailSkeleton } from './pet-detail-skeleton-data';

type PetDetailSectionProps = Readonly<{ params: Promise<{ slug: string }> }>;

export function PetDetailSection({ params }: PetDetailSectionProps) {
  const petPromise = params.then(({ slug }) => getLandingPetBySlugAction(slug));

  return (
    <PetDetailErrorBoundary>
      <Suspense fallback={<PetDetailRenderer pet={petDetailSkeleton} isSkeleton />}>
        <PetDetailContainer petPromise={petPromise} />
      </Suspense>
    </PetDetailErrorBoundary>
  );
}
