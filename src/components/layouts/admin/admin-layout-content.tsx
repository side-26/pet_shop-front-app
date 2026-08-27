'use client';

import { useMemo, type ReactNode } from 'react';

import {
  AdminLayoutContextProvider,
  type AdminLayoutContextValue,
} from '@/contexts/admin/layout/admin-layout-context';

type AdminLayoutContentProps = Readonly<{
  children: ReactNode;
}> &
  AdminLayoutContextValue;

export function AdminLayoutContent({
  children,
  entityName,
  headerActions,
}: AdminLayoutContentProps) {
  const value = useMemo<AdminLayoutContextValue>(
    () => ({ entityName, headerActions }),
    [entityName, headerActions],
  );

  return <AdminLayoutContextProvider value={value}>{children}</AdminLayoutContextProvider>;
}
