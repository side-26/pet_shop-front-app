import { CircleAlertIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { getDashboardMetricsAction } from '@/entities/dashboard/dashboard.actions';

import { DashboardContentRenderer } from './dashboard-content-renderer';
import { mapDashboardMetrics } from './dashboard.mapper';

type DashboardContentContainerProps = {
  dashboardMetricsPromise: ReturnType<typeof getDashboardMetricsAction>;
};

export async function DashboardContentContainer({
  dashboardMetricsPromise,
}: DashboardContentContainerProps) {
  const result = await dashboardMetricsPromise;

  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlertIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>دریافت آمار داشبورد انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'لطفاً دوباره تلاش کنید.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <DashboardContentRenderer dashboard={mapDashboardMetrics(result.data)} />;
}
