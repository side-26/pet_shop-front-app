'use client';

import { useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  useAdminLayoutContext,
  type AdminHeaderActions,
} from '@/contexts/admin/layout/admin-layout-context';

import { UsersAllPaginateFilter } from './users-all-paginate-filter';
import type { UsersAllPaginateFilterValues } from './users-filter.helpers';

type UsersHeaderActionsProps = {
  initialValues?: Partial<UsersAllPaginateFilterValues>;
};

function UsersHeaderActions({ initialValues }: UsersHeaderActionsProps) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [filterOpen, setFilterOpen] = useState(false);

  const headerActions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن کاربر', action: () => undefined },
      filter: { order: 2, action: () => setFilterOpen(true) },
      reload: { order: 3, action: router.refresh },
    }),
    [router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(headerActions);
    return resetHeaderActions;
  }, [headerActions, resetHeaderActions, setHeaderActions]);

  return (
    <UsersAllPaginateFilter
      initialValues={initialValues}
      open={filterOpen}
      onOpenChange={setFilterOpen}
    />
  );
}

export { UsersHeaderActions };
