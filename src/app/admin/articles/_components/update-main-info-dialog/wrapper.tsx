'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import type { ArticlePetTypeOption } from '../create-new-article-dialog/types';
import { UpdateMainInfoDialogContext } from './context';
import type { UpdateMainInfoDialogHandle, UpdateMainInfoDialogParams } from './types';

const LazyUpdateMainInfoDialog = dynamic(() =>
  import('./dialog').then((module) => module.UpdateMainInfoDialog),
);

const EXIT_FALLBACK_MS = 200;

export const UpdateMainInfoDialogWrapper = forwardRef<
  UpdateMainInfoDialogHandle,
  Readonly<{ onUpdated: () => void; petTypes: readonly ArticlePetTypeOption[] }>
>(function UpdateMainInfoDialogWrapper({ onUpdated, petTypes }, ref) {
  const [params, setParams] = useState<UpdateMainInfoDialogParams | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const versionRef = useRef(0);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = null;
  }, []);
  const close = useCallback(() => {
    clearExitTimer();
    const version = ++versionRef.current;
    setIsOpen(false);
    exitTimerRef.current = setTimeout(() => {
      if (version === versionRef.current) setParams(null);
    }, EXIT_FALLBACK_MS);
  }, [clearExitTimer]);
  const open = useCallback(
    (nextParams: UpdateMainInfoDialogParams) => {
      clearExitTimer();
      ++versionRef.current;
      setParams(nextParams);
      setIsOpen(true);
    },
    [clearExitTimer],
  );

  useImperativeHandle(ref, () => ({ open, close }), [close, open]);

  if (!params) return null;

  return (
    <UpdateMainInfoDialogContext value={params}>
      <LazyUpdateMainInfoDialog
        open={isOpen}
        id={params.id}
        onClose={close}
        onUpdated={() => {
          onUpdated();
          close();
        }}
        petTypes={petTypes}
      />
    </UpdateMainInfoDialogContext>
  );
});
