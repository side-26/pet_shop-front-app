import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, Suspense, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { landingClientService } from './landing.client-service';
import { landingQueryKeys, useSuspenseLandingSearchQuery } from './landing.client';

vi.mock('./landing.client-service', () => ({
  landingClientService: { getSearch: vi.fn() },
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
});
