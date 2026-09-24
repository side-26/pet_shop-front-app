import { describe, expect, it, vi } from 'vitest';

import { getProvincesAction, reverseGeocodeAction } from './locations.actions';
import { loadProvinces, loadReverseGeocodedLocation } from './locations.client';
import { globalErrorHandler } from '@/utils/helpers';

vi.mock('./locations.actions', () => ({
  getProvincesAction: vi.fn(),
  reverseGeocodeAction: vi.fn(),
}));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

describe('loadProvinces', () => {
  it('returns province data from the public action', async () => {
    const provinces = [{ provinceId: 8, title: 'تهران', latLng: [35.6892, 51.389] as const }];
    vi.mocked(getProvincesAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: provinces,
    });

    await expect(loadProvinces()).resolves.toBe(provinces);
  });

  it('forwards action failures to the shared error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'دریافت استان‌ها ناموفق بود.',
      data: { messages: [], details: {} },
    };
    vi.mocked(getProvincesAction).mockResolvedValue(error);

    await expect(loadProvinces()).resolves.toBeNull();
    expect(globalErrorHandler).toHaveBeenCalledWith(error);
  });
});

describe('loadReverseGeocodedLocation', () => {
  it('returns the reverse-geocoded location from the authenticated action', async () => {
    const location = { formatted_address: 'تهران، خیابان فاطمی', city: 'تهران' };
    vi.mocked(reverseGeocodeAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: location,
    });

    await expect(loadReverseGeocodedLocation({ lat: 35.7219, lng: 51.3347 })).resolves.toBe(
      location,
    );
    expect(reverseGeocodeAction).toHaveBeenCalledWith({ lat: 35.7219, lng: 51.3347 });
  });

  it('forwards reverse-geocoding failures to the shared error handler', async () => {
    const error = {
      isSuccess: false as const,
      message: 'سرویس مکان‌یابی موقتاً در دسترس نیست.',
      data: { messages: [], details: {} },
    };
    vi.mocked(reverseGeocodeAction).mockResolvedValue(error);

    await expect(loadReverseGeocodedLocation({ lat: 35, lng: 51 })).resolves.toBeNull();
    expect(globalErrorHandler).toHaveBeenCalledWith(error);
  });
});
