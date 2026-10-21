'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';

import type {
  OrdersFilterDialogHandle,
  OrdersFilterDialogParams,
} from './orders-filter-dialog.types';

const LazyOrdersFilterDialogContent = dynamic(() => import('./orders-filter-dialog-content'));
const EXIT_FALLBACK_MS = 200;

type OrdersFilterDialogProps = Readonly<{ ref: Ref<OrdersFilterDialogHandle> }>;

export function OrdersFilterDialog({ ref }: OrdersFilterDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<OrdersFilterDialogParams>({ query: {} });
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

  const open = useCallback(
    (nextParams: OrdersFilterDialogParams) => {
      clearExitTimer();
      lifecycleVersionRef.current += 1;
      isOpenRef.current = true;
      setParams(nextParams);
      setIsMounted(true);
      setIsOpen(true);
    },
    [clearExitTimer],
  );

  useEffect(() => clearExitTimer, [clearExitTimer]);
  useImperativeHandle(ref, () => ({ open, close }), [close, open]);

  if (!isMounted) return null;

  return (
    <LazyOrdersFilterDialogContent
      open={isOpen}
      initialQuery={params.query}
      onExitComplete={() => finishClose(lifecycleVersionRef.current)}
      onOpenChange={(nextOpen) => (nextOpen ? open(params) : close())}
    />
  );
}

export type { OrdersFilterDialogHandle } from './orders-filter-dialog.types';
