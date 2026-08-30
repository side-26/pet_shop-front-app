'use client';
import { lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAdminLayoutContext,
  type AdminHeaderActions,
} from '@/contexts/admin/layout/admin-layout-context';
export function PetTypesHeaderActions() {
  const router = useRouter();
  const { setHeaderActions, resetHeaderActions } = useAdminLayoutContext();
  const [createOpen, setCreateOpen] = useState(false);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 1,
      'add-new-item': { order: 1, name: 'افزودن نوع حیوان', action: () => setCreateOpen(true) },
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
      <LazyCreatePetTypeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          setCreateOpen(false);
          router.refresh();
        }}
      />
    </Suspense>
  ) : null;
}
const LazyCreatePetTypeDialog = lazy(async () => {
  const dialog = await import('./create-pet-type-dialog');
  return { default: dialog.CreatePetTypeDialog };
});
