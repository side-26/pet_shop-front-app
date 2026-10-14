'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useContext, useImperativeHandle, useRef, useState } from 'react';
import { QueryClientContext } from '@tanstack/react-query';

import type { DialogHandle } from '@/_types';
import { landingSearchDialogQuery } from '@/entities/landing/landing.client';

import type { HeaderProductSearchSuggestionsDialogParams } from './search-suggestions-dialog';

export type HeaderProductSearchNavigationDrawerHandle =
  DialogHandle<HeaderProductSearchSuggestionsDialogParams>;

const LazyHeaderProductSearchNavigationDrawerContent = dynamic(() =>
  import('./search-suggestions-navigation-drawer-content').then(
    (module) => module.HeaderProductSearchNavigationDrawerContent,
  ),
);
const exitFallbackMs = 200;

export const HeaderProductSearchNavigationDrawer = forwardRef<
  HeaderProductSearchNavigationDrawerHandle,
  object
>(function HeaderProductSearchNavigationDrawer(_, ref) {
  const queryClient = useContext(QueryClientContext);
  const [params, setParams] = useState<HeaderProductSearchSuggestionsDialogParams | null>(null);
  const [open, setOpen] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const versionRef = useRef(0);
  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = null;
  }, []);
  const close = useCallback(() => {
    const drawerQuery = params
      ? landingSearchDialogQuery({ search: params.query, limit: 20 })
      : undefined;

    clearExitTimer();
    const version = ++versionRef.current;
    setOpen(false);
    if (drawerQuery && queryClient) {
      void queryClient.cancelQueries({ queryKey: drawerQuery, exact: true });
      queryClient.removeQueries({ queryKey: drawerQuery, exact: true });
    }
    exitTimerRef.current = setTimeout(() => {
      if (version === versionRef.current) setParams(null);
    }, exitFallbackMs);
  }, [clearExitTimer, params, queryClient]);
  const openDrawer = useCallback(
    (nextParams: HeaderProductSearchSuggestionsDialogParams) => {
      clearExitTimer();
      ++versionRef.current;
      setParams(nextParams);
      setOpen(true);
    },
    [clearExitTimer],
  );

  useImperativeHandle(ref, () => ({ open: openDrawer, close }), [close, openDrawer]);

  if (!params) return null;

  return (
    <LazyHeaderProductSearchNavigationDrawerContent
      initialSuggestions={params.initialSuggestions}
      open={open}
      query={params.query}
      onClose={close}
    />
  );
});
