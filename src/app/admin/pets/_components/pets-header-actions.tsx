'use client';

import { lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import type { PetsFilterValues } from './pets-filter.helpers';
import { PetsFilterDialog } from './pets-filter-dialog';
import type { PetFormOptions } from './pet-form-options.types';

const LazyCreatePetDialog = lazy(async () => ({
  default: (await import('./create-pet-dialog')).CreatePetDialog,
}));

export function PetsHeaderActions({
  initialValues,
  formOptions,
}: {
  initialValues?: Partial<PetsFilterValues>;
  formOptions?: PetFormOptions;
}) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن حیوان جدید', action: () => setCreateOpen(true) },
      filter: { order: 2, action: () => setFilterOpen(true) },
      reload: { order: 3, action: router.refresh },
    }),
    [router.refresh],
  );
  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);
  return (
    <>
      {createOpen ? (
        <Suspense fallback={null}>
          <LazyCreatePetDialog
            open
            formOptions={formOptions}
            onOpenChange={setCreateOpen}
            onCreated={() => {
              setCreateOpen(false);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
      <PetsFilterDialog
        open={filterOpen}
        formOptions={formOptions}
        onOpenChange={setFilterOpen}
        initialValues={initialValues}
      />
    </>
  );
}
