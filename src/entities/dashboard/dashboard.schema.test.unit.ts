import { describe, expect, it } from 'vitest';

import { dashboardMetricsQuerySchema } from './dashboard.schema';

describe('dashboardMetricsQuerySchema', () => {
  it('applies the backend dashboard defaults', async () => {
    await expect(dashboardMetricsQuerySchema.validate({})).resolves.toEqual({
      groupBy: 'day',
      lowStockThreshold: 5,
      topLimit: 5,
      lowStockLimit: 5,
      recentLimit: 5,
    });
  });

  it('accepts the supported filters and rejects invalid date ranges', async () => {
    await expect(
      dashboardMetricsQuerySchema.validate({
        fromDate: '2026-09-01T00:00:00.000Z',
        toDate: '2026-09-05T00:00:00.000Z',
        groupBy: 'week',
        lowStockThreshold: 0,
        topLimit: 20,
      }),
    ).resolves.toMatchObject({ groupBy: 'week', lowStockThreshold: 0, topLimit: 20 });

    await expect(
      dashboardMetricsQuerySchema.validate({
        fromDate: '2026-09-05T00:00:00.000Z',
        toDate: '2026-09-01T00:00:00.000Z',
      }),
    ).rejects.toBeDefined();
  });
});
