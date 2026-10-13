'use client';

import { createContext, use, type ReactNode } from 'react';

type HeaderProductSearchContextValue = Readonly<{
  onCloseHoverCard: () => void;
}>;

const HeaderProductSearchContext = createContext<HeaderProductSearchContextValue | null>(null);

export function HeaderProductSearchProvider({
  children,
  onCloseHoverCard,
}: Readonly<HeaderProductSearchContextValue & { children: ReactNode }>) {
  return (
    <HeaderProductSearchContext value={{ onCloseHoverCard }}>{children}</HeaderProductSearchContext>
  );
}

export function useHeaderProductSearchContext() {
  const context = use(HeaderProductSearchContext);

  if (context === null) {
    throw new Error(
      'useHeaderProductSearchContext must be used within HeaderProductSearchProvider.',
    );
  }

  return context;
}
