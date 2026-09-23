import { describe, expect, it, vi } from 'vitest';

import { getProvincesAction } from './locations.actions';
import { loadProvinces } from './locations.client';
import { globalErrorHandler } from '@/utils/helpers';

vi.mock('./locations.actions', () => ({ getProvincesAction: vi.fn() }));
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
