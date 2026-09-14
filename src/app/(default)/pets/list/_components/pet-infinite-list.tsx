'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getLandingPetListAction } from '@/entities/landing/landing.actions';
import type { LandingPetListItemDTO, LandingPetListPageDTO } from '@/entities/landing/landing.dto';
import { globalErrorHandler } from '@/utils/helpers';

import { PetGrid, petGridSkeletonData, toPetCardViewModel } from './pet-grid';
import { PetInfiniteListLoadError } from './pet-infinite-list-load-error';
import { PetInfiniteListLoader } from './pet-infinite-list-loader';

type PetInfiniteListProps = Readonly<{
  data?: LandingPetListPageDTO;
  endMessage?: ReactNode;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function PetInfiniteList({
  data,
  endMessage,
  isSkeleton = false,
  query,
}: PetInfiniteListProps) {
  const [pets, setPets] = useState<readonly LandingPetListItemDTO[]>(() => data?.result ?? []);
  const [hasMore, setHasMore] = useState(data?.pagination.hasNextPage ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pageRef = useRef(data?.pagination.currentPage ?? 1);

  const loadNextPage = useCallback(
    async (isRetry = false) => {
      if (isLoading || (!hasMore && !isRetry)) return;

      setIsLoading(true);
      setLoadError(null);

      const result = await getLandingPetListAction({ ...query, page: pageRef.current + 1 });
      if (!result.isSuccess) {
        globalErrorHandler(result);
        setLoadError(result.message ?? 'دریافت حیوانات بیشتر انجام نشد.');
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      pageRef.current = result.data.pagination.currentPage;
      setPets((current) => {
        const currentIds = new Set(current.map((pet) => pet.id));
        return [...current, ...result.data.result.filter((pet) => !currentIds.has(pet.id))];
      });
      setHasMore(result.data.pagination.hasNextPage);
      setIsLoading(false);
    },
    [hasMore, isLoading, query],
  );

  if (isSkeleton) return <PetGrid pets={petGridSkeletonData} isSkeleton />;

  return (
    <InfiniteScroll
      dataLength={pets.length}
      endMessage={pets.length > 0 ? endMessage : null}
      hasMore={hasMore}
      loader={<PetInfiniteListLoader />}
      next={() => void loadNextPage()}
    >
      <PetGrid pets={pets.map(toPetCardViewModel)} />
      {loadError ? (
        <PetInfiniteListLoadError
          description={loadError}
          isLoading={isLoading}
          onRetry={() => void loadNextPage(true)}
        />
      ) : null}
    </InfiniteScroll>
  );
}
