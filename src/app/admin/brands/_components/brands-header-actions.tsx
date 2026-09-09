'use client';

import dynamic from 'next/dynamic';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import type { BrandFormDialogHandle } from './brand-form-dialog.types';

const LazyCreateBrandDialog = dynamic(() =>
  import('./create-brand-dialog').then((module) => module.CreateBrandDialog),
);

export function BrandsHeaderActions() {
  const router = useRouter();
  const { setHeaderActions, resetHeaderActions } = useAdminLayoutContext();
  const createDialogRef = useRef<BrandFormDialogHandle>(null);
  const [createDialogMounted, setCreateDialogMounted] = useState(false);
  const openCreateDialog = useCallback(() => {
    if (createDialogRef.current) createDialogRef.current.open();
    else setCreateDialogMounted(true);
  }, []);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن برند', action: openCreateDialog },
      reload: { order: 2, action: router.refresh },
    }),
    [openCreateDialog, router.refresh],
  );
  useLayoutEffect(() => {
    setHeaderActions(actions);
    return resetHeaderActions;
  }, [actions, resetHeaderActions, setHeaderActions]);
  return createDialogMounted ? (
    <LazyCreateBrandDialog
      ref={createDialogRef}
      openOnMount
      onClosed={() => setCreateDialogMounted(false)}
      onCreated={() => {
        setCreateDialogMounted(false);
        router.refresh();
      }}
    />
  ) : null;
}
