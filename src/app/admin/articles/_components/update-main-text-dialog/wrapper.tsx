'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { UpdateMainTextDialogContext } from './context';
import type { UpdateMainTextDialogHandle, UpdateMainTextDialogParams } from './types';

const LazyUpdateMainTextDialog = dynamic(() =>
  import('./dialog').then((module) => module.UpdateMainTextDialog),
);

const EXIT_FALLBACK_MS = 200;

export const UpdateMainTextDialogWrapper = forwardRef<
  UpdateMainTextDialogHandle,
  Readonly<{ onUpdated: () => void }>
>(function UpdateMainTextDialogWrapper({ onUpdated }, ref) {
  const [params, setParams] = useState<UpdateMainTextDialogParams | null>(null);
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
    (nextParams: UpdateMainTextDialogParams) => {
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
    <UpdateMainTextDialogContext value={params}>
      <LazyUpdateMainTextDialog
        open={isOpen}
        id={params.id}
        onClose={close}
        onUpdated={() => {
          onUpdated();
          close();
        }}
      />
    </UpdateMainTextDialogContext>
  );
});
