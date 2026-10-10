'use client';

import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';
import { useDialogController } from '@/hooks/use-dialog-controller';

import { CreateArticleDialog } from './create-article-dialog';
import type { CreateArticleDialogHandle } from './create-article-dialog.types';

export type ArticlePetTypeOption = Readonly<{ id: string; image: string; title: string }>;

export function ArticlesHeaderActions({ petTypes }: { petTypes: readonly ArticlePetTypeOption[] }) {
  const router = useRouter();
  const createArticleDialogRef = useRef<CreateArticleDialogHandle>(null);
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const { open: openDialog } = useDialogController(
    useMemo(() => ({ createArticle: { ref: createArticleDialogRef } }), []),
  );
  const openCreateDialog = useCallback(() => {
    openDialog('createArticle');
  }, [openDialog]);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن مقاله', action: openCreateDialog },
      reload: { order: 2, action: router.refresh },
    }),
    [openCreateDialog, router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);

  return (
    <CreateArticleDialog
      ref={createArticleDialogRef}
      onCreated={router.refresh}
      petTypes={petTypes}
    />
  );
}
