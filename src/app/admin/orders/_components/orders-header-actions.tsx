'use client';

import { useLayoutEffect, useMemo } from 'react';

import { useRouter } from '@/hooks/use-router';
import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import { useOrdersDialogs } from './orders-dialog-provider';

type OrdersHeaderActionsProps = { query: Record<string, string> };

export function OrdersHeaderActions({ query }: OrdersHeaderActionsProps) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const { openFilter } = useOrdersDialogs();
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      filter: { order: 1, action: () => openFilter(query) },
      reload: { order: 2, action: router.refresh },
    }),
    [openFilter, query, router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);

  return null;
}
