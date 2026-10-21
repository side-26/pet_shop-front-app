'use client';

import { useLayoutEffect, useMemo } from 'react';

import { useRouter } from '@/hooks/use-router';
import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

/** Filter is deliberately a placeholder until the filter dialog is introduced. */
export function OrdersHeaderActions() {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      filter: { order: 1, action: () => undefined },
      reload: { order: 2, action: router.refresh },
    }),
    [router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);

  return null;
}
