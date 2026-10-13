'use client';

import { createContext, use, useMemo, useRef, type ReactNode } from 'react';

import type { LandingSearchResultDTO } from '@/entities/landing/landing.dto';
import { useDialogController } from '@/hooks/use-dialog-controller';

import {
  HeaderProductSearchSuggestionsDialog,
  type HeaderProductSearchSuggestionsDialogHandle,
} from './search-suggestions-dialog';

type HeaderProductSearchContextValue = Readonly<{
  onNavigateToDetail: () => void;
  onCloseHoverCard: () => void;
  openSearchSuggestionsDialog: (params: {
    initialSuggestions: LandingSearchResultDTO[];
    query: string;
  }) => void;
}>;

const HeaderProductSearchContext = createContext<HeaderProductSearchContextValue | null>(null);

export function HeaderProductSearchProvider({
  children,
  onCloseHoverCard,
}: Readonly<Pick<HeaderProductSearchContextValue, 'onCloseHoverCard'> & { children: ReactNode }>) {
  const searchSuggestionsDialogRef = useRef<HeaderProductSearchSuggestionsDialogHandle>(null);
  const { close, open } = useDialogController(
    useMemo(() => ({ searchSuggestions: { ref: searchSuggestionsDialogRef } }), []),
  );
  const value = useMemo<HeaderProductSearchContextValue>(
    () => ({
      onCloseHoverCard,
      onNavigateToDetail: () => {
        onCloseHoverCard();
        close();
      },
      openSearchSuggestionsDialog: (params) => open('searchSuggestions', params),
    }),
    [close, onCloseHoverCard, open],
  );

  return (
    <HeaderProductSearchContext value={value}>
      {children}
      <HeaderProductSearchSuggestionsDialog ref={searchSuggestionsDialogRef} />
    </HeaderProductSearchContext>
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
