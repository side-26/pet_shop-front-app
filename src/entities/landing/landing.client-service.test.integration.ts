import { describe, expect, it, vi } from 'vitest';

import { internalFetcher } from '@/lib/api/internalFetcher';

import { landingClientService } from './landing.client-service';

vi.mock('@/lib/api/internalFetcher', () => ({ internalFetcher: vi.fn() }));

describe('landing client service', () => {
  it('requests the paginated landing search through the same-origin API and forwards cancellation', async () => {
    const signal = new AbortController().signal;
    const query = { search: 'غذای گربه', page: 2, limit: 12 };
    const page = { result: [], pagination: {} };
    vi.mocked(internalFetcher).mockResolvedValue(page);

    await expect(landingClientService.getSearch(query, signal)).resolves.toBe(page);
    expect(internalFetcher).toHaveBeenCalledWith({
      url: '/api/landing/search',
      method: 'GET',
      query,
      signal,
    });
  });
});
