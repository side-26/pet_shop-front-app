import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, Suspense, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { landingClientService } from './landing.client-service';
import {
  landingSearchDialogQuery,
  landingQueryKeys,
  useSuspenseLandingProductsInfiniteQuery,
  useSuspenseLandingSearchInfiniteQuery,
  useSuspenseLandingSearchQuery,
} from './landing.client';

vi.mock('./landing.client-service', () => ({
  landingClientService: { getProducts: vi.fn(), getSearch: vi.fn() },
}));

function createWrapper() {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(Suspense, { fallback: null }, children),
    );

  return { queryClient, wrapper };
}

describe('landing search suspense query', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keys every search input and forwards TanStack Query cancellation to the client service', async () => {
    const query = { search: 'غذای گربه', page: 2, limit: 12 };
    const page = {
      result: [
        {
          itemType: 'product' as const,
          title: 'غذای گربه',
          slug: 'cat-food',
          mainImage: '/images/cat-food.jpg',
          thumbnailImage: '/images/cat-food-thumb.jpg',
        },
      ],
      pagination: {
        currentPage: 2,
        totalPages: 2,
        totalItems: 12,
        itemsPerPage: 12,
        hasNextPage: false,
        hasPrevPage: true,
        nextPage: null,
        prevPage: 1,
      },
    };
    vi.mocked(landingClientService.getSearch).mockResolvedValue(page);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useSuspenseLandingSearchQuery(query), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(page.result));

    expect(landingQueryKeys.search(query)).toEqual(['landing', 'search', 'غذای گربه', 2, 12]);
    expect(landingClientService.getSearch).toHaveBeenCalledWith(query, expect.any(AbortSignal));
    queryClient.clear();
  });

  it('reuses the latest result when the hover-card query observer remounts', async () => {
    const query = { search: 'غذای گربه', page: 1, limit: 20 };
    const page = {
      result: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
      },
    };
    vi.mocked(landingClientService.getSearch).mockResolvedValue(page);
    const { queryClient, wrapper } = createWrapper();
    const firstQuery = renderHook(() => useSuspenseLandingSearchQuery(query), { wrapper });

    await waitFor(() => expect(firstQuery.result.current.data).toEqual(page.result));
    firstQuery.unmount();

    const remountedQuery = renderHook(() => useSuspenseLandingSearchQuery(query), { wrapper });

    await waitFor(() => expect(remountedQuery.result.current.data).toEqual(page.result));
    expect(landingClientService.getSearch).toHaveBeenCalledTimes(1);
    queryClient.clear();
  });

  it('loads subsequent dialog pages and exposes one transformed suggestion list', async () => {
    const query = { search: 'غذای گربه', limit: 20 };
    const firstPage = {
      result: [
        {
          itemType: 'product' as const,
          title: 'غذای گربه',
          slug: 'cat-food',
          mainImage: '/images/cat-food.jpg',
          thumbnailImage: '/images/cat-food-thumb.jpg',
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 2,
        itemsPerPage: 20,
        hasNextPage: true,
        hasPrevPage: false,
        nextPage: 2,
        prevPage: null,
      },
    };
    const secondPage = {
      result: [
        {
          itemType: 'pet' as const,
          title: 'گربه بالغ',
          slug: 'adult-cat',
          mainImage: '/images/adult-cat.jpg',
          thumbnailImage: '/images/adult-cat-thumb.jpg',
        },
      ],
      pagination: {
        currentPage: 2,
        totalPages: 2,
        totalItems: 2,
        itemsPerPage: 20,
        hasNextPage: false,
        hasPrevPage: true,
        nextPage: null,
        prevPage: 1,
      },
    };
    vi.mocked(landingClientService.getSearch)
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useSuspenseLandingSearchInfiniteQuery(query), { wrapper });

    await waitFor(() => expect(result.current.suggestions).toEqual(firstPage.result));
    await result.current.fetchNextPage();

    await waitFor(() =>
      expect(result.current.suggestions).toEqual([...firstPage.result, ...secondPage.result]),
    );
    expect(landingClientService.getSearch).toHaveBeenNthCalledWith(
      2,
      { ...query, page: 2 },
      expect.any(AbortSignal),
    );
    queryClient.clear();
  });

  it('keeps the dialog cache key distinct from the hover-card result key', () => {
    expect(landingSearchDialogQuery({ search: 'غذای گربه', limit: 20 })).toEqual([
      'landing',
      'search',
      'غذای گربه',
      1,
      20,
    ]);
    expect(landingSearchDialogQuery({ search: 'غذای گربه', limit: 20 })).not.toEqual(
      landingQueryKeys.search({ search: 'غذای گربه', page: 1, limit: 3 }),
    );
  });
});

describe('landing product suspense infinite query', () => {
  it('seeds the server page, then requests the backend-provided next page with filters and cancellation', async () => {
    const query = { brand: '507f1f77bcf86cd799439011', sort: 'less-valued' };
    const firstPage = {
      result: [
        {
          id: 'product-1',
          title: 'غذای خشک گربه',
          mainImage: '/cat-food.webp',
          price: 200_000,
          discountPercentage: 0,
          discountPrice: 200_000,
          slug: 'cat-food',
          minimumQuantity: 3,
          ignoredByCatalogueCard: 'not exposed',
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 2,
        totalItems: 2,
        itemsPerPage: 12,
        hasNextPage: true,
        hasPrevPage: false,
        nextPage: 2,
        prevPage: null,
      },
    };
    const secondPage = {
      ...firstPage,
      result: [
        ...firstPage.result,
        {
          ...firstPage.result[0],
          id: 'product-2',
          minimumQuantity: 0,
          slug: 'dog-food',
          title: 'غذای خشک سگ',
        },
      ],
      pagination: {
        ...firstPage.pagination,
        currentPage: 2,
        hasNextPage: false,
        nextPage: null,
        prevPage: 1,
      },
    };
    vi.mocked(landingClientService.getProducts).mockResolvedValue(secondPage);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useSuspenseLandingProductsInfiniteQuery(firstPage, query), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.products).toEqual([
        {
          available: true,
          discountPercentage: 0,
          discountPrice: 200_000,
          id: 'product-1',
          image: '/cat-food.webp',
          imageThumbnail: '',
          price: 200_000,
          slug: 'cat-food',
          title: 'غذای خشک گربه',
        },
      ]),
    );
    expect(landingClientService.getProducts).not.toHaveBeenCalled();

    await result.current.fetchNextPage();

    await waitFor(() => expect(result.current.products).toHaveLength(2));
    expect(result.current.products[1]).toMatchObject({
      available: false,
      id: 'product-2',
      title: 'غذای خشک سگ',
    });
    expect(landingClientService.getProducts).toHaveBeenCalledWith(
      { brand: query.brand, sort: 'less-valued', page: 2, limit: 12 },
      expect.any(AbortSignal),
    );
    expect(landingQueryKeys.products(query, 12)).not.toEqual(
      landingQueryKeys.products({ ...query, brand: '507f1f77bcf86cd799439012' }, 12),
    );
    queryClient.clear();
  });
});
