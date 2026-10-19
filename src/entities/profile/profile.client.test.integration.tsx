import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useProfileOrdersPage } from './profile.client';
import { getProfileOrdersAction } from './profile.actions';
import type { ProfileOrdersPageDTO } from './profile.dto';

vi.mock('./profile.actions', () => ({
  getProfileOrderAction: vi.fn(),
  getProfileOrdersAction: vi.fn(),
}));

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
  it('seeds the streamed initial page and fetches a requested next page through the Server Action', async () => {
    vi.mocked(getProfileOrdersAction).mockResolvedValue({
      ...initialPage,
      pagination: { ...initialPage.pagination, currentPage: 2, hasNextPage: false, nextPage: null },
    });
    const { result } = renderHook(() => useProfileOrdersPage(initialPage));

    expect(getProfileOrdersAction).not.toHaveBeenCalled();
    expect(result.current.data.pages).toEqual([initialPage]);

    await act(() => result.current.fetchNextPage());
    await waitFor(() => expect(result.current.data.pages).toHaveLength(2));
    expect(getProfileOrdersAction).toHaveBeenCalledWith({ page: 2 });
  });
});
