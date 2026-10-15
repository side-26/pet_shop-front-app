'use client';

import { CustomInfiniteScroll } from '@/components/templates/custom-infinite-scroll';
import { useSuspenseLandingPetsInfiniteQuery } from '@/entities/landing/landing.client';

import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';

import { PetGrid } from './pet-grid';
import { toPetCardViewModel } from './pet-card-view-model.mapper';
import { PetInfiniteListLoader } from './pet-infinite-list-loader';
import { PetListDescription } from './pet-list-description';
import { PetListErrorFallback } from './pet-list-error-boundary';

type PetInfiniteListProps = Readonly<{
  data: LandingPetListPageDTO;
  query: Readonly<Record<string, string>>;
}>;

export function PetInfiniteList({ data, query }: PetInfiniteListProps) {
  const { pets, error, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
    useSuspenseLandingPetsInfiniteQuery(data, query);

  return (
    <CustomInfiniteScroll
      dataLength={pets.length}
      endMessage={pets.length > 0 ? <PetListDescription /> : null}
      error={error}
      errorFallback={({ error: nextPageError, retry }) => (
        <PetListErrorFallback error={nextPageError} refreshOnRetry={false} retry={retry} />
      )}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage ?? false}
      isFetchingNextPage={isFetchingNextPage}
      isFetchNextPageError={isFetchNextPageError}
      loader={<PetInfiniteListLoader />}
    >
      <PetGrid pets={pets.map(toPetCardViewModel)} />
    </CustomInfiniteScroll>
  );
}
