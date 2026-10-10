'use client';

import { useLayoutEffect, useMemo } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';
import { useArticlesTableDialogs } from './articles-table-dialog-provider';

export function ArticlesHeaderActions() {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const { openCreateNewArticle } = useArticlesTableDialogs();
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن مقاله', action: openCreateNewArticle },
      reload: { order: 2, action: router.refresh },
    }),
    [openCreateNewArticle, router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);

  return null;
}
