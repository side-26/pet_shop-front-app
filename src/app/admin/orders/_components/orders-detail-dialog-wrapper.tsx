'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';

import { OrdersDetailDialogParamsContext } from './orders-detail-dialog-context';
import type {
  OrdersDetailDialogHandle,
  OrdersDetailDialogParams,
} from './orders-detail-dialog.types';

const LazyOrdersDetailDialog = dynamic(() => import('./orders-detail-dialog'));
const EXIT_FALLBACK_MS = 200;

export function OrdersDetailDialogWrapper({
  ref,
}: Readonly<{ ref: Ref<OrdersDetailDialogHandle> }>) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<OrdersDetailDialogParams | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const versionRef = useRef(0);
  const isOpenRef = useRef(false);
  const clearExit = useCallback(() => {
    if (exitTimerRef.current !== null) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);
  const finishClose = useCallback(
    (version: number) => {
      if (version === versionRef.current && !isOpenRef.current) {
        clearExit();
        setIsMounted(false);
      }
    },
    [clearExit],
  );
  const close = useCallback(() => {
    if (!isMounted) return;
    clearExit();
    const version = versionRef.current + 1;
    versionRef.current = version;
    isOpenRef.current = false;
    setIsOpen(false);
    exitTimerRef.current = setTimeout(() => finishClose(version), EXIT_FALLBACK_MS);
  }, [clearExit, finishClose, isMounted]);
  const open = useCallback(
    (nextParams: OrdersDetailDialogParams) => {
      clearExit();
      versionRef.current += 1;
      isOpenRef.current = true;
      setParams(nextParams);
      setIsMounted(true);
      setIsOpen(true);
    },
    [clearExit],
  );
  useEffect(() => clearExit, [clearExit]);
  useImperativeHandle(ref, () => ({ open, close }), [close, open]);
  if (!isMounted || !params) return null;
  return (
    <OrdersDetailDialogParamsContext value={params}>
      <LazyOrdersDetailDialog
        open={isOpen}
        onOpenChange={(nextOpen) => (nextOpen ? open(params) : close())}
        onExitComplete={() => finishClose(versionRef.current)}
      />
    </OrdersDetailDialogParamsContext>
  );
}
