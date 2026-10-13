'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { transformPaginateResult } from '@/app/core/transformer/transform';

import {
  LandingSearchResultDTO,
  type LandingSearchPageDTO,
  type LandingSearchQueryDTO,
} from './landing.dto';
import { landingClientService } from './landing.client-service';

export const landingQueryKeys = {
  all: ['landing'] as const,
  search: ({ limit, page, search }: LandingSearchQueryDTO) =>
    [...landingQueryKeys.all, 'search', search, page, limit] as const,
};

const selectLandingSearchResults = (searchPage: LandingSearchPageDTO) =>
  transformPaginateResult(LandingSearchResultDTO, searchPage);

export function useSuspenseLandingSearchQuery(query: LandingSearchQueryDTO) {
  return useSuspenseQuery({
    queryKey: landingQueryKeys.search(query),
    queryFn: ({ signal }) => landingClientService.getSearch(query, signal),
    select: selectLandingSearchResults,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
