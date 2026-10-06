import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getProfileOrdersAction } from './profile.actions';
import { useProfileOrdersPage } from './profile.client';
import type { ProfileOrdersPageDTO } from './profile.dto';

vi.mock('./profile.actions', () => ({ getProfileOrdersAction: vi.fn() }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const initialPage: ProfileOrdersPageDTO = {
  result: [],
  pagination: {
    currentPage: 1,
    totalPages: 2,
    totalItems: 11,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
    nextPage: 2,
    prevPage: null,
  },
};

afterEach(() => vi.clearAllMocks());

describe('useProfileOrdersPage', () => {
  it('seeds the first server page and fetches only the next page on demand without staleTime', async () => {
    vi.mocked(getProfileOrdersAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: {
        ...initialPage,
        pagination: {
          ...initialPage.pagination,
          currentPage: 2,
          hasNextPage: false,
          nextPage: null,
        },
      },
    });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useProfileOrdersPage(initialPage), { wrapper });

    expect(getProfileOrdersAction).not.toHaveBeenCalled();
    expect(result.current.data.pages).toEqual([initialPage]);
    expect(
      'staleTime' in
        (queryClient.getQueryCache().find({ queryKey: ['profile', 'orders'] })?.options ?? {}),
    ).toBe(false);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data.pages).toHaveLength(2));
    expect(getProfileOrdersAction).toHaveBeenCalledWith({ page: 2 });
    queryClient.clear();
  });
});
