'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { DialogHandle } from '@/_types';
import { landingSearchDialogQuery } from '@/entities/landing/landing.client';
import type { LandingSearchResultDTO } from '@/entities/landing/landing.dto';

export type HeaderProductSearchSuggestionsDialogParams = Readonly<{
  initialSuggestions: LandingSearchResultDTO[];
  query: string;
}>;

export type HeaderProductSearchSuggestionsDialogHandle =
  DialogHandle<HeaderProductSearchSuggestionsDialogParams>;

const LazyHeaderProductSearchSuggestionsDialogContent = dynamic(() =>
  import('./search-suggestions-dialog-content').then(
    (module) => module.HeaderProductSearchSuggestionsDialogContent,
  ),
);
const exitFallbackMs = 200;

export const HeaderProductSearchSuggestionsDialog = forwardRef<
  HeaderProductSearchSuggestionsDialogHandle,
  object
>(function HeaderProductSearchSuggestionsDialog(_, ref) {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<HeaderProductSearchSuggestionsDialogParams | null>(null);
  const [open, setOpen] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const versionRef = useRef(0);
  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = null;
  }, []);
  const close = useCallback(() => {
    const dialogQuery = params
      ? landingSearchDialogQuery({ search: params.query, limit: 20 })
      : undefined;

    clearExitTimer();
    const version = ++versionRef.current;
    setOpen(false);
    if (dialogQuery) {
      void queryClient.cancelQueries({ queryKey: dialogQuery, exact: true });
      queryClient.removeQueries({ queryKey: dialogQuery, exact: true });
    }
    exitTimerRef.current = setTimeout(() => {
      if (version === versionRef.current) setParams(null);
    }, exitFallbackMs);
  }, [clearExitTimer, params, queryClient]);
  const openDialog = useCallback(
    (nextParams: HeaderProductSearchSuggestionsDialogParams) => {
      clearExitTimer();
      ++versionRef.current;
      setParams(nextParams);
      setOpen(true);
    },
    [clearExitTimer],
  );

  useImperativeHandle(ref, () => ({ open: openDialog, close }), [close, openDialog]);

  if (!params) return null;

  return (
    <LazyHeaderProductSearchSuggestionsDialogContent
      initialSuggestions={params.initialSuggestions}
      open={open}
      query={params.query}
      onClose={close}
    />
  );
});
