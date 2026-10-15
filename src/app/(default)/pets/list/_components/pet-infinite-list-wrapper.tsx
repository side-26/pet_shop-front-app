'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetGrid } from './pet-grid';
import { petGridSkeletonData } from './pet-grid-skeleton-data';
import { PetInfiniteList } from './pet-infinite-list';
import { PetListErrorBoundary } from './pet-list-error-boundary';

type PetInfiniteListWrapperProps = Readonly<{
  data: LandingPetListPageDTO;
  query: Readonly<Record<string, string>>;
}>;

export function PetInfiniteListWrapper({ data, query }: PetInfiniteListWrapperProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <PetListErrorBoundary onQueryReset={reset}>
          <Suspense fallback={<PetGrid pets={petGridSkeletonData} isSkeleton />}>
            <PetInfiniteList data={data} query={query} />
          </Suspense>
        </PetListErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
