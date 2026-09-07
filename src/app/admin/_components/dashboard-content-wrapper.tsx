import { Suspense } from 'react';

import { getDashboardMetricsAction } from '@/entities/dashboard/dashboard.actions';

import { DashboardContentContainer } from './dashboard-content-container';
import { DashboardContentRenderer } from './dashboard-content-renderer';
import { dashboardSkeletonData } from './dashboard-skeleton-data';

export function DashboardContentWrapper() {
  const dashboardMetricsPromise = getDashboardMetricsAction();

  return (
    <Suspense fallback={<DashboardContentRenderer dashboard={dashboardSkeletonData} isSkeleton />}>
      <DashboardContentContainer dashboardMetricsPromise={dashboardMetricsPromise} />
    </Suspense>
  );
}
