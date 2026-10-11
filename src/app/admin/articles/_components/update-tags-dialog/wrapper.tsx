'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';

import { UpdateTagsDialogContext } from './context';
import type { UpdateTagsDialogHandle, UpdateTagsDialogParams } from './types';

const LazyUpdateTagsDialog = dynamic(() =>
  import('./dialog').then((module) => module.UpdateTagsDialog),
);
const EXIT_FALLBACK_MS = 200;

export const UpdateTagsDialogWrapper = forwardRef<
  UpdateTagsDialogHandle,
  Readonly<{ onUpdated: () => void }>
>(function UpdateTagsDialogWrapper({ onUpdated }, ref) {
  const [params, setParams] = useState<UpdateTagsDialogParams | null>(null);
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
    (nextParams: UpdateTagsDialogParams) => {
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
    <UpdateTagsDialogContext value={params}>
      <LazyUpdateTagsDialog
        open={isOpen}
        onClose={close}
        onUpdated={() => {
          onUpdated();
          close();
        }}
      />
    </UpdateTagsDialogContext>
  );
});
