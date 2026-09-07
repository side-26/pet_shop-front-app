import { Suspense } from 'react';

import { DashboardContentRenderer } from './dashboard-content-renderer';
import {
  parseDashboardDateRangeSearchParams,
  toDashboardMetricsQuery,
  type DashboardSearchParams,
} from './dashboard-date-range-filter.helpers';
import { DashboardContentWrapper } from './dashboard-content-wrapper';
import { dashboardSkeletonData } from './dashboard-skeleton-data';

type DashboardPageContentWrapperProps = {
  searchParams: Promise<DashboardSearchParams>;
};

async function DashboardPageContent({ searchParams }: DashboardPageContentWrapperProps) {
  const values = parseDashboardDateRangeSearchParams(await searchParams);
  return <DashboardContentWrapper query={toDashboardMetricsQuery(values)} />;
}

export function DashboardPageContentWrapper(props: DashboardPageContentWrapperProps) {
  return (
    <Suspense fallback={<DashboardContentRenderer dashboard={dashboardSkeletonData} isSkeleton />}>
      <DashboardPageContent {...props} />
    </Suspense>
  );
}
