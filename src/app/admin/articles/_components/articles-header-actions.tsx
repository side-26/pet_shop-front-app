'use client';

import { useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import { CreateArticleDialog } from './create-article-dialog';

export function ArticlesHeaderActions() {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن مقاله', action: () => setIsCreateDialogOpen(true) },
      reload: { order: 2, action: router.refresh },
    }),
    [router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);

  return (
    <CreateArticleDialog
      open={isCreateDialogOpen}
      onOpenChange={setIsCreateDialogOpen}
      onCreated={() => {
        setIsCreateDialogOpen(false);
        router.refresh();
      }}
    />
  );
}
