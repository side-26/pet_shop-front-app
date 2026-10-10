'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { ArticlePetTypeOption, CreateNewArticleDialogHandle } from './types';

const LazyCreateNewArticleDialogContent = dynamic(() => import('./content'));

const EXIT_FALLBACK_MS = 200;

type CreateNewArticleDialogProps = Readonly<{
  onCreated: () => void;
  petTypes: readonly ArticlePetTypeOption[];
}>;

export const CreateNewArticleDialog = forwardRef<
  CreateNewArticleDialogHandle,
  CreateNewArticleDialogProps
>(function CreateNewArticleDialog({ onCreated, petTypes }, ref) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lifecycleVersionRef = useRef(0);
  const isOpenRef = useRef(false);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== null) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const finishClose = useCallback(
    (version: number) => {
      if (version !== lifecycleVersionRef.current || isOpenRef.current) return;

      clearExitTimer();
      setIsMounted(false);
    },
    [clearExitTimer],
  );

  const close = useCallback(() => {
    if (!isMounted) return;

    clearExitTimer();
    const version = lifecycleVersionRef.current + 1;
    lifecycleVersionRef.current = version;
    isOpenRef.current = false;
    setIsOpen(false);
    exitTimerRef.current = setTimeout(() => finishClose(version), EXIT_FALLBACK_MS);
  }, [clearExitTimer, finishClose, isMounted]);

  const open = useCallback(() => {
    clearExitTimer();
    lifecycleVersionRef.current += 1;
    isOpenRef.current = true;
    setIsMounted(true);
    setIsOpen(true);
  }, [clearExitTimer]);

  const handleCreated = useCallback(() => {
    onCreated();
    close();
  }, [close, onCreated]);

  useEffect(() => clearExitTimer, [clearExitTimer]);

  useImperativeHandle(ref, () => ({ open, close }), [close, open]);

  if (!isMounted) return null;

  return (
    <LazyCreateNewArticleDialogContent
      open={isOpen}
      onCreated={handleCreated}
      onExitComplete={() => finishClose(lifecycleVersionRef.current)}
      onOpenChange={(nextOpen) => (nextOpen ? open() : close())}
      petTypes={petTypes}
    />
  );
});
