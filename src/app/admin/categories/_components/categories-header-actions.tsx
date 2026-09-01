'use client';

import { lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import type { CategoryPetTypeOption } from './categories-form.types';

const LazyCreateCategoryDialog = lazy(async () => {
  const dialog = await import('./create-category-dialog');
  return { default: dialog.CreateCategoryDialog };
});

export function CategoriesHeaderActions({
  petTypes,
}: {
  petTypes: readonly CategoryPetTypeOption[];
}) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [createOpen, setCreateOpen] = useState(false);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': {
        order: 1,
        name: 'افزودن دسته‌بندی',
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
      <LazyCreateCategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        petTypes={petTypes}
        onCreated={() => {
          setCreateOpen(false);
          router.refresh();
        }}
      />
    </Suspense>
  ) : null;
}
