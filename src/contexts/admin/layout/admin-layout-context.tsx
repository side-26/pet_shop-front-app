'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type AdminHeaderAction = Readonly<{
  order: number;
  action: () => void;
  name?: string;
  icon?: ReactNode;
}>;

export type AdminHeaderActions = Readonly<
  {
    lastVisibleOrder: number;
    'add-new-item'?: AdminHeaderAction;
    filter?: AdminHeaderAction;
    reload?: AdminHeaderAction;
  } & Record<string, AdminHeaderAction | number | undefined>
>;

export type AdminLayoutContextValue = Readonly<{
  entityName: string;
  headerActions: AdminHeaderActions;
}>;

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export function AdminLayoutContextProvider({
  children,
  value,
}: Readonly<{
  children: ReactNode;
  value: AdminLayoutContextValue;
}>) {
  return <AdminLayoutContext.Provider value={value}>{children}</AdminLayoutContext.Provider>;
}

export function useAdminLayoutContext(): AdminLayoutContextValue {
  const context = useContext(AdminLayoutContext);

  if (!context) {
    throw new Error('useAdminLayoutContext must be used within AdminLayoutContextProvider.');
  }

  return context;
}
