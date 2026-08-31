'use client';

import { lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  useAdminLayoutContext,
  type AdminHeaderActions,
} from '@/contexts/admin/layout/admin-layout-context';

import type { BreedsFilterValues } from './breeds-filter.helpers';
import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

const LazyCreateBreedDialog = lazy(async () => {
  const dialog = await import('./create-breed-dialog');
  return { default: dialog.CreateBreedDialog };
});
const LazyBreedsFilterDialog = lazy(async () => {
  const dialog = await import('./breeds-filter-dialog');
  return { default: dialog.BreedsFilterDialog };
});

type Props = {
  initialValues?: Partial<BreedsFilterValues>;
  countries?: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
};

export function BreedsHeaderActions({ initialValues, countries = [], petTypes }: Props) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const headerActions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن نژاد', action: () => setCreateOpen(true) },
      filter: { order: 2, action: () => setFilterOpen(true) },
      reload: { order: 3, action: router.refresh },
    }),
    [router.refresh],
  );

  useLayoutEffect(() => {
    setHeaderActions(headerActions);
    return resetHeaderActions;
  }, [headerActions, resetHeaderActions, setHeaderActions]);

  return (
    <>
      {createOpen ? (
        <Suspense fallback={null}>
          <LazyCreateBreedDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            onCreated={() => {
              setCreateOpen(false);
              router.refresh();
            }}
            countries={countries}
            petTypes={petTypes}
          />
        </Suspense>
      ) : null}
      {filterOpen ? (
        <Suspense fallback={null}>
          <LazyBreedsFilterDialog
            initialValues={initialValues}
            open={filterOpen}
            onOpenChange={setFilterOpen}
            countries={countries}
            petTypes={petTypes}
          />
        </Suspense>
      ) : null}
    </>
  );
}
