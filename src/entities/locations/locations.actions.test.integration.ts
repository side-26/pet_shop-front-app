import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCitiesByProvinceIdAction, getProvincesAction } from './locations.actions';
import { getCitiesByProvinceId, getProvinces } from './locations.service';

vi.mock('./locations.service', () => ({
  getCitiesByProvinceId: vi.fn(),
  getProvinces: vi.fn(),
}));

describe('location actions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('delegates the public provinces read to the service', async () => {
    const response = { isSuccess: true as const, message: null, data: [] };
    vi.mocked(getProvinces).mockResolvedValue(response);

    await expect(getProvincesAction()).resolves.toBe(response);
    expect(getProvinces).toHaveBeenCalledOnce();
  });

  it('validates and normalizes a province id before reading its cities', async () => {
    const response = { isSuccess: true as const, message: null, data: [] };
    vi.mocked(getCitiesByProvinceId).mockResolvedValue(response);

    await expect(getCitiesByProvinceIdAction({ provinceId: '8', ignored: true })).resolves.toBe(
      response,
    );
    expect(getCitiesByProvinceId).toHaveBeenCalledWith({ provinceId: 8 });
  });

  it('does not call the service for an invalid province id', async () => {
    await expect(getCitiesByProvinceIdAction({ provinceId: 0 })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(getCitiesByProvinceId).not.toHaveBeenCalled();
  });
});
