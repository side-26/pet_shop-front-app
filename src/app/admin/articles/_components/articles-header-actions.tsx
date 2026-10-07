'use client';

import { useLayoutEffect, useMemo } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

export function ArticlesHeaderActions() {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      // The create dialog is deliberately deferred until its requested flow is implemented.
      'add-new-item': { order: 1, name: 'افزودن مقاله', action: () => undefined },
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
