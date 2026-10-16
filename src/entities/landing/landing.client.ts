'use client';

import { useMemo } from 'react';
import { useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

import { transformData, transformPaginateResult } from '@/app/core/transformer/transform';

import {
  LandingPetListCardDTO,
  type LandingPetListPageDTO,
  type LandingPetListQueryDTO,
  LandingProductListItemDTO,
  type LandingProductListPageDTO,
  type LandingProductListQueryDTO,
  LandingSearchResultDTO,
  type LandingSearchPageDTO,
  type LandingSearchQueryDTO,
} from './landing.dto';
import { landingClientService } from './landing.client-service';

const landingSearchCacheTime = 5 * 60 * 1000;

export const landingQueryKeys = {
  all: ['landing'] as const,
  products: (query: Readonly<Record<string, string>>, limit: number) =>
    [
      ...landingQueryKeys.all,
      'products',
      new URLSearchParams([...Object.entries(query), ['limit', String(limit)]].sort()).toString(),
    ] as const,
  pets: (query: Readonly<Record<string, string>>, limit: number) =>
    [
      ...landingQueryKeys.all,
      'pets',
      new URLSearchParams([...Object.entries(query), ['limit', String(limit)]].sort()).toString(),
    ] as const,
  search: ({ limit, page, search }: LandingSearchQueryDTO) =>
    [...landingQueryKeys.all, 'search', search, page, limit] as const,
};

function toLandingProductListRequest(
  query: Readonly<Record<string, string>>,
  page: number,
  limit: number,
): Partial<LandingProductListQueryDTO> {
  return {
    ...(query.category ? { category: query.category } : {}),
    ...(query.subCategory ? { subCategory: query.subCategory } : {}),
    ...(query.brand ? { brand: query.brand } : {}),
    ...(query.priceFrom ? { priceFrom: Number(query.priceFrom) } : {}),
    ...(query.priceTo ? { priceTo: Number(query.priceTo) } : {}),
    ...(query.isEnable ? { isEnable: query.isEnable === 'true' } : {}),
    ...(query.sort ? { sort: query.sort as LandingProductListQueryDTO['sort'] } : {}),
    page,
    limit,
  };
}

function toLandingPetListRequest(
  query: Readonly<Record<string, string>>,
  page: number,
  limit: number,
): Partial<LandingPetListQueryDTO> {
  return {
    ...(query.petType ? { petType: query.petType } : {}),
    ...(query.breed ? { breed: query.breed } : {}),
    ...(query.priceFrom ? { priceFrom: Number(query.priceFrom) } : {}),
    ...(query.priceTo ? { priceTo: Number(query.priceTo) } : {}),
    ...(query.isEnable ? { isEnable: query.isEnable === 'true' } : {}),
    ...(query.sort ? { sort: query.sort as LandingPetListQueryDTO['sort'] } : {}),
    page,
    limit,
  };
}

export const landingSearchDialogQuery = (query: Omit<LandingSearchQueryDTO, 'page'>) =>
  landingQueryKeys.search({ ...query, page: 1 });

const selectLandingSearchResults = (searchPage: LandingSearchPageDTO) =>
  transformPaginateResult(LandingSearchResultDTO, searchPage);

const selectLandingProductListItems = (productPage: LandingProductListPageDTO) =>
  transformPaginateResult(LandingProductListItemDTO, productPage);

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

const selectLandingProductPages = (productData: {
  pages: LandingProductListPageDTO[];
  pageParams: unknown[];
}) => ({
  ...productData,
  pages: productData.pages.map((productPage) => ({
    ...productPage,
    result: selectLandingProductListItems(productPage),
  })),
});

const selectLandingPetPages = (petData: {
  pages: LandingPetListPageDTO[];
  pageParams: unknown[];
}) => ({
  ...petData,
  pages: petData.pages.map((petPage) => ({
    ...petPage,
    result: transformData(LandingPetListCardDTO, petPage.result),
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

export function useSuspenseLandingProductsInfiniteQuery(
  initialPage: LandingProductListPageDTO,
  query: Readonly<Record<string, string>>,
) {
  const limit = initialPage.pagination.itemsPerPage;
  const infiniteQuery = useSuspenseInfiniteQuery({
    queryKey: landingQueryKeys.products(query, limit),
    queryFn: ({ pageParam, signal }) =>
      landingClientService.getProducts(
        toLandingProductListRequest(query, pageParam, limit),
        signal,
      ),
    initialPageParam: initialPage.pagination.currentPage,
    initialData: {
      pages: [initialPage],
      pageParams: [initialPage.pagination.currentPage],
    },
    getNextPageParam: (page) => page.pagination.nextPage ?? undefined,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: selectLandingProductPages,
  });

  const products = useMemo(() => {
    const uniqueProducts = new Map<string, LandingProductListItemDTO>();
    infiniteQuery.data.pages
      .flatMap((page) => page.result)
      .forEach((product) => uniqueProducts.set(product.id, product));
    return [...uniqueProducts.values()];
  }, [infiniteQuery.data.pages]);

  return { ...infiniteQuery, products };
}

export function useSuspenseLandingPetsInfiniteQuery(
  initialPage: LandingPetListPageDTO,
  query: Readonly<Record<string, string>>,
) {
  const limit = initialPage.pagination.itemsPerPage;
  const infiniteQuery = useSuspenseInfiniteQuery({
    queryKey: landingQueryKeys.pets(query, limit),
    queryFn: ({ pageParam, signal }) =>
      landingClientService.getPets(toLandingPetListRequest(query, pageParam, limit), signal),
    initialPageParam: initialPage.pagination.currentPage,
    initialData: {
      pages: [initialPage],
      pageParams: [initialPage.pagination.currentPage],
    },
    getNextPageParam: (page) => page.pagination.nextPage ?? undefined,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    select: selectLandingPetPages,
  });

  const pets = useMemo(() => {
    const uniquePets = new Map<string, LandingPetListCardDTO>();
    infiniteQuery.data.pages
      .flatMap((page) => page.result)
      .forEach((pet) => uniquePets.set(pet.id, pet));
    return [...uniquePets.values()];
  }, [infiniteQuery.data.pages]);

  return { ...infiniteQuery, pets };
}
