'use client';

import { useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  useAdminLayoutContext,
  type AdminHeaderActions,
} from '@/contexts/admin/layout/admin-layout-context';

import { CreateUserDialog } from './create-user-dialog';
import { UsersAllPaginateFilter } from './users-all-paginate-filter';
import type { UsersAllPaginateFilterValues } from './users-filter.helpers';

type UsersHeaderActionsProps = {
  initialValues?: Partial<UsersAllPaginateFilterValues>;
};

function UsersHeaderActions({ initialValues }: UsersHeaderActionsProps) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const headerActions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن کاربر', action: () => setCreateUserOpen(true) },
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
    <>
      {createUserOpen ? (
        <CreateUserDialog
          open={createUserOpen}
          onOpenChange={setCreateUserOpen}
          onCreated={() => {
            setCreateUserOpen(false);
            router.refresh();
          }}
        />
      ) : null}
      <UsersAllPaginateFilter
        initialValues={initialValues}
        open={filterOpen}
        onOpenChange={setFilterOpen}
      />
    </>
  );
}

export { UsersHeaderActions };
