import { describe, expect, it, vi } from 'vitest';

import { internalFetcher } from '@/lib/api/internalFetcher';
import type { LandingPetTypeDTO } from './landing.dto';

import { landingClientService } from './landing.client-service';

vi.mock('@/lib/api/internalFetcher', () => ({ internalFetcher: vi.fn() }));

describe('landing client service', () => {
  it('requests all landing pet types through the same-origin API and forwards cancellation', async () => {
    const signal = new AbortController().signal;
    const petTypes: LandingPetTypeDTO[] = [];
    vi.mocked(internalFetcher).mockResolvedValue(petTypes);

    await expect(landingClientService.getPetTypes(signal)).resolves.toBe(petTypes);
    expect(internalFetcher).toHaveBeenCalledWith({
      url: '/api/landing/pet-types',
      method: 'GET',
      signal,
    });
  });

  it('requests landing pet pages through the same-origin API and forwards cancellation', async () => {
    const signal = new AbortController().signal;
    const query = { petType: '507f1f77bcf86cd799439011', page: 2, limit: 12 };
    const page = { result: [], pagination: {} };
    vi.mocked(internalFetcher).mockResolvedValue(page);

    await expect(landingClientService.getPets(query, signal)).resolves.toBe(page);
    expect(internalFetcher).toHaveBeenCalledWith({
      url: '/api/landing/pets',
      method: 'GET',
      query,
      signal,
    });
  });

  it('requests landing product pages through the same-origin API and forwards cancellation', async () => {
    const signal = new AbortController().signal;
    const query = { brand: '507f1f77bcf86cd799439011', page: 2, limit: 12 };
    const page = { result: [], pagination: {} };
    vi.mocked(internalFetcher).mockResolvedValue(page);

    await expect(landingClientService.getProducts(query, signal)).resolves.toBe(page);
    expect(internalFetcher).toHaveBeenCalledWith({
      url: '/api/landing/products',
      method: 'GET',
      query,
      signal,
    });
  });

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
