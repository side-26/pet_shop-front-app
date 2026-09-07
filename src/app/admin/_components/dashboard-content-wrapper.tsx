import { Suspense } from 'react';

import { getDashboardMetricsAction } from '@/entities/dashboard/dashboard.actions';
import type { DashboardMetricsQueryInput } from '@/entities/dashboard/dashboard.schema';

import { DashboardContentContainer } from './dashboard-content-container';
import { DashboardContentRenderer } from './dashboard-content-renderer';
import { dashboardSkeletonData } from './dashboard-skeleton-data';

type DashboardContentWrapperProps = {
  query?: Partial<DashboardMetricsQueryInput>;
};

export function DashboardContentWrapper({ query }: DashboardContentWrapperProps) {
  const dashboardMetricsPromise = getDashboardMetricsAction(query);
  const suspenseKey = JSON.stringify(query ?? {});

  return (
    <Suspense
      key={suspenseKey}
      fallback={<DashboardContentRenderer dashboard={dashboardSkeletonData} isSkeleton />}
    >
      <DashboardContentContainer dashboardMetricsPromise={dashboardMetricsPromise} />
    </Suspense>
  );
}
