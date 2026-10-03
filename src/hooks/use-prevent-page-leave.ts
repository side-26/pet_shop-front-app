'use client';

import { AlertTriangle } from 'lucide-react';
import { useCallback, useEffect } from 'react';

import { useCommonStore } from '@/stores/common.store';

export type UsePreventPageLeaveOptions = Readonly<{
  /** Enables the native unload guard and confirmation dialog when true. */
  force: boolean;
  /** Message shown for controlled in-app leave attempts. */
  message: string;
  title?: string;
}>;

export type LeavePageCallback = () => void | Promise<void>;

/**
 * Guards browser close/refresh and provides `requestLeave` for app-controlled navigation.
 * Browsers intentionally replace custom beforeunload text with their own localized message.
 */
export function usePreventPageLeave({
  force,
  message,
  title = 'صفحه را ترک می‌کنید؟',
}: UsePreventPageLeaveOptions) {
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);

  useEffect(() => {
    if (!force) return;

    const preventUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
    };

    window.addEventListener('beforeunload', preventUnload);
    return () => window.removeEventListener('beforeunload', preventUnload);
  }, [force, message]);

  const requestLeave = useCallback(
    (onLeave: LeavePageCallback) => {
      if (!force) {
        void onLeave();
        return;
      }

      showConfirmDialog({
        title,
        message,
        icon: AlertTriangle,
        variant: 'warning',
        onSuccess: async () => {
          await onLeave();
        },
      });
    },
    [force, message, showConfirmDialog, title],
  );

  return { isPreventingLeave: force, requestLeave } as const;
}
