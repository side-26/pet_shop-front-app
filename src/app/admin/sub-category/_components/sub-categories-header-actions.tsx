'use client';

import { lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import type { SubCategoryOption } from './sub-categories-form.types';

const LazyCreateSubCategoryDialog = lazy(async () => {
  const dialog = await import('./create-sub-category-dialog');
  return { default: dialog.CreateSubCategoryDialog };
});

export function SubCategoriesHeaderActions({
  categories,
}: {
  categories: readonly SubCategoryOption[];
}) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [createOpen, setCreateOpen] = useState(false);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': {
        order: 1,
        name: 'افزودن زیر دسته‌بندی',
        action: () => setCreateOpen(true),
      },
      reload: { order: 2, action: router.refresh },
    }),
    [router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);

  return createOpen ? (
    <Suspense fallback={null}>
      <LazyCreateSubCategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        categories={categories}
        onCreated={() => {
          setCreateOpen(false);
          router.refresh();
        }}
      />
    </Suspense>
  ) : null;
}
