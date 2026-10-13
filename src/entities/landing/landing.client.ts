'use client';

import { useMemo } from 'react';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

import { transformPaginateResult } from '@/app/core/transformer/transform';

import {
  LandingSearchResultDTO,
  type LandingSearchPageDTO,
  type LandingSearchQueryDTO,
} from './landing.dto';
import { landingClientService } from './landing.client-service';

const landingSearchCacheTime = 5 * 60 * 1000;

export const landingQueryKeys = {
  all: ['landing'] as const,
  search: ({ limit, page, search }: LandingSearchQueryDTO) =>
    [...landingQueryKeys.all, 'search', search, page, limit] as const,
};

export const landingSearchDialogQuery = (query: Omit<LandingSearchQueryDTO, 'page'>) =>
  landingQueryKeys.search({ ...query, page: 1 });

const selectLandingSearchResults = (searchPage: LandingSearchPageDTO) =>
  transformPaginateResult(LandingSearchResultDTO, searchPage);

const selectLandingSearchPages = (searchData: {
  pages: LandingSearchPageDTO[];
  pageParams: unknown[];
}) => ({
  ...searchData,
  pages: searchData.pages.map((searchPage) => ({
    ...searchPage,
    result: selectLandingSearchResults(searchPage),
  })),
});

export function useSuspenseLandingSearchQuery(query: LandingSearchQueryDTO) {
  return useSuspenseQuery({
    queryKey: landingQueryKeys.search(query),
    queryFn: ({ signal }) => landingClientService.getSearch(query, signal),
    select: selectLandingSearchResults,
    retry: false,
    staleTime: landingSearchCacheTime,
    gcTime: landingSearchCacheTime,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}

export function useSuspenseLandingSearchInfiniteQuery(query: Omit<LandingSearchQueryDTO, 'page'>) {
  const infiniteQuery = useSuspenseInfiniteQuery({
    queryKey: landingSearchDialogQuery(query),
    queryFn: ({ pageParam, signal }) =>
      landingClientService.getSearch({ ...query, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (searchPage) => searchPage.pagination.nextPage ?? undefined,
    select: selectLandingSearchPages,
    retry: false,
    staleTime: landingSearchCacheTime,
    gcTime: landingSearchCacheTime,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const suggestions = useMemo(
    () => infiniteQuery.data.pages.flatMap((searchPage) => searchPage.result),
    [infiniteQuery.data.pages],
  );

  return { ...infiniteQuery, suggestions };
}
