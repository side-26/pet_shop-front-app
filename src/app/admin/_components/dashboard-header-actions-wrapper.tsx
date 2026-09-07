import { Suspense } from 'react';

import {
  parseDashboardDateRangeSearchParams,
  type DashboardSearchParams,
} from './dashboard-date-range-filter.helpers';
import { DashboardHeaderActions } from './dashboard-header-actions';

type DashboardHeaderActionsWrapperProps = {
  searchParams: Promise<DashboardSearchParams>;
};

async function DashboardHeaderActionsContainer({
  searchParams,
}: DashboardHeaderActionsWrapperProps) {
  return (
    <DashboardHeaderActions
      initialValues={parseDashboardDateRangeSearchParams(await searchParams)}
    />
  );
}

export function DashboardHeaderActionsWrapper(props: DashboardHeaderActionsWrapperProps) {
  return (
    <Suspense fallback={<DashboardHeaderActions />}>
      <DashboardHeaderActionsContainer {...props} />
    </Suspense>
  );
}
