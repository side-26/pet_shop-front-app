import { Suspense } from 'react';

import { getDashboardMetricsAction } from '@/entities/dashboard/dashboard.actions';
import type { DashboardMetricsQueryInput } from '@/entities/dashboard/dashboard.schema';

import { DashboardContent } from './dashboard-content';
import { DashboardContentRenderer } from './dashboard-content-renderer';
import { DashboardErrorBoundary } from './dashboard-error-boundary';
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
      <DashboardErrorBoundary>
        <DashboardContent dashboardMetricsPromise={dashboardMetricsPromise} />
      </DashboardErrorBoundary>
    </Suspense>
  );
}
