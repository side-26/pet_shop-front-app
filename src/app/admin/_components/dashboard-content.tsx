import { use } from 'react';

import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { getDashboardMetricsAction } from '@/entities/dashboard/dashboard.actions';

import { DashboardEmptyFetch } from './dashboard-empty-fetch';
import { DashboardContentRenderer } from './dashboard-content-renderer';
import { toDashboardViewModel } from './dashboard.types';

type DashboardContentProps = Readonly<{
  dashboardMetricsPromise: ReturnType<typeof getDashboardMetricsAction>;
}>;

export function DashboardContent({ dashboardMetricsPromise }: DashboardContentProps) {
  const metrics = use(dashboardMetricsPromise);
  const dashboard = toDashboardViewModel(metrics);

  return (
    <EmptyStateBoundary
      data={dashboard}
      fallback={<DashboardEmptyFetch />}
      isEmpty={() => !dashboard.summary}
    >
      <DashboardContentRenderer dashboard={dashboard} />
    </EmptyStateBoundary>
  );
}
