import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
import { EntityTag } from '@/utils/entityCache';

import type { DashboardMetricsDTO, DashboardMetricsQueryDTO } from './dashboard.dto';
import { dashboardMetricsQuerySchema } from './dashboard.schema';

const dashboardCache = new EntityTag('dashboard');

function createQueryKey(query: DashboardMetricsQueryDTO) {
  return new URLSearchParams(
    Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, String(value)]),
  ).toString();
}

export async function getDashboardMetrics(input: Partial<DashboardMetricsQueryDTO> = {}) {
  const query = await dashboardMetricsQuerySchema.validate(input, { stripUnknown: true });
  return fetchDashboardMetrics(query);
}

async function fetchDashboardMetrics(query: DashboardMetricsQueryDTO) {
  'use cache: private';

  dashboardCache.cacheLife({ stale: 60 });
  dashboardCache.registerList(createQueryKey(query));

  return customFetcher<DashboardMetricsDTO>({
    url: '/dashboard/metrics',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}
