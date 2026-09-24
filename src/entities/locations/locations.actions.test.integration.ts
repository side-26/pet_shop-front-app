import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getCitiesByProvinceIdAction,
  getProvincesAction,
  reverseGeocodeAction,
} from './locations.actions';
import { getCitiesByProvinceId, getProvinces, reverseGeocode } from './locations.service';

vi.mock('./locations.service', () => ({
  getCitiesByProvinceId: vi.fn(),
  getProvinces: vi.fn(),
  reverseGeocode: vi.fn(),
}));
vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));

import { getSession } from '@/utils/session';

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

  it('validates coordinates before delegating the authenticated reverse-geocoding read', async () => {
    const response = {
      isSuccess: true as const,
      message: null,
      data: { formatted_address: 'تهران، خیابان فاطمی' },
    };
    vi.mocked(getSession).mockResolvedValue({} as Awaited<ReturnType<typeof getSession>>);
    vi.mocked(reverseGeocode).mockResolvedValue(response);

    await expect(
      reverseGeocodeAction({ lat: '35.7219', lng: '51.3347', ignored: true }),
    ).resolves.toBe(response);
    expect(reverseGeocode).toHaveBeenCalledWith({ lat: 35.7219, lng: 51.3347 });
  });

  it('rejects unauthenticated reverse-geocoding requests before validation or service access', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await expect(reverseGeocodeAction({ lat: 35, lng: 51 })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(reverseGeocode).not.toHaveBeenCalled();
  });

  it('does not call reverse-geocoding for invalid coordinates', async () => {
    vi.mocked(getSession).mockResolvedValue({} as Awaited<ReturnType<typeof getSession>>);

    await expect(reverseGeocodeAction({ lat: 91, lng: 51 })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(reverseGeocode).not.toHaveBeenCalled();
  });
});
