import { Suspense } from 'react';

import { PetDetailContainer } from './pet-detail-container';
import { PetDetailContent } from './pet-detail-content';
import { petDetailSkeleton } from './pet-detail-data';

type PetDetailWrapperProps = Readonly<{
  paramsPromise: Promise<{ slug: string }>;
}>;

export function PetDetailWrapper({ paramsPromise }: PetDetailWrapperProps) {
  return (
    <Suspense fallback={<PetDetailContent pet={petDetailSkeleton} isSkeleton />}>
      <PetDetailContainer paramsPromise={paramsPromise} />
    </Suspense>
  );
}
