'use client';

import { useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import type { DashboardDateRangeFilterValues } from './dashboard-date-range-filter.helpers';
import { DashboardDateRangeFilter } from './dashboard-date-range-filter';

type DashboardHeaderActionsProps = {
  initialValues?: DashboardDateRangeFilterValues;
};

export function DashboardHeaderActions({ initialValues }: DashboardHeaderActionsProps) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [filterOpen, setFilterOpen] = useState(false);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 1,
      filter: { order: 1, action: () => setFilterOpen(true) },
      reload: { order: 2, action: router.refresh },
    }),
    [router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);

  return (
    <DashboardDateRangeFilter
      initialValues={initialValues}
      open={filterOpen}
      onOpenChange={setFilterOpen}
    />
  );
}
