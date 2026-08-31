import { describe, expect, it, vi } from 'vitest';

import { getCountriesAction } from './countries.actions';
import { getCountries } from './countries.service';

vi.mock('./countries.service', () => ({ getCountries: vi.fn() }));

const getCountriesMock = vi.mocked(getCountries);

describe('getCountriesAction', () => {
  it('delegates the public read to the countries service', async () => {
    const response = { isSuccess: true as const, message: null, data: [] };
    getCountriesMock.mockResolvedValue(response);

    await expect(getCountriesAction()).resolves.toBe(response);
    expect(getCountriesMock).toHaveBeenCalledOnce();
  });
});
