import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

import { GET } from './route';

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));

describe('GET /api/landing/pet-types', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns public pet types without backend credentials', async () => {
    const petTypes: LandingPetTypeDTO[] = [];
    vi.mocked(customFetcher).mockResolvedValue({ isSuccess: true, message: null, data: petTypes });

    const response = await GET(new Request('http://localhost/api/landing/pet-types'), undefined);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(petTypes);
    expect(customFetcher).toHaveBeenCalledWith({
      url: '/landing/pet-types/all',
      method: 'GET',
      auth: false,
      cache: 'no-store',
    });
  });
});
