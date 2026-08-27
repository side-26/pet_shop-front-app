'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';

import {
  AdminLayoutContextProvider,
  type AdminHeaderActions,
  type AdminLayoutContextValue,
} from '@/contexts/admin/layout/admin-layout-context';

type AdminLayoutContentProps = Readonly<{
  children: ReactNode;
  entityName: string;
  headerActions: AdminHeaderActions;
}>;

export function AdminLayoutContent({
  children,
  entityName,
  headerActions,
}: AdminLayoutContentProps) {
  const [currentHeaderActions, setCurrentHeaderActions] = useState(headerActions);

  const resetHeaderActions = useCallback(() => {
    setCurrentHeaderActions(headerActions);
  }, [headerActions]);

  const value = useMemo<AdminLayoutContextValue>(
    () => ({
      entityName,
      headerActions: currentHeaderActions,
      resetHeaderActions,
      setHeaderActions: setCurrentHeaderActions,
    }),
    [currentHeaderActions, entityName, resetHeaderActions],
  );

  return <AdminLayoutContextProvider value={value}>{children}</AdminLayoutContextProvider>;
}
