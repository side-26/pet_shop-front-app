'use client';

import { lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  type AdminHeaderActions,
  useAdminLayoutContext,
} from '@/contexts/admin/layout/admin-layout-context';

import type { ProductFormOptions } from './product-form-options.types';
import type { ProductsFilterValues } from './products-filter.helpers';
import { ProductsFilterDialog } from './products-filter-dialog';

const LazyCreateProductDialog = lazy(async () => ({
  default: (await import('./create-product-dialog')).CreateProductDialog,
}));
type Props = { initialValues?: Partial<ProductsFilterValues>; options?: ProductFormOptions };

export function ProductsHeaderActions({ initialValues, options }: Props) {
  const router = useRouter();
  const { resetHeaderActions, setHeaderActions } = useAdminLayoutContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const actions = useMemo<AdminHeaderActions>(
    () => ({
      lastVisibleOrder: 2,
      'add-new-item': { order: 1, name: 'افزودن محصول جدید', action: () => setCreateOpen(true) },
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
          <LazyCreateProductDialog
            open
            options={options}
            onOpenChange={setCreateOpen}
            onCreated={() => {
              setCreateOpen(false);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
      {options ? (
        <ProductsFilterDialog
          open={filterOpen}
          options={options}
          onOpenChange={setFilterOpen}
          initialValues={initialValues}
        />
      ) : null}
    </>
  );
}
