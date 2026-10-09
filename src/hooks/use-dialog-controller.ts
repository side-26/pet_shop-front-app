'use client';

import { useCallback, useRef } from 'react';

import type { DialogConfig, InferDialogParams } from '@/_types';

type DialogKey<T> = Extract<keyof T, string>;

type OpenArgs<T extends DialogConfig, K extends DialogKey<T>> =
  InferDialogParams<T[K]> extends void ? [key: K] : [key: K, params: InferDialogParams<T[K]>];

export function useDialogController<const T extends DialogConfig>(config: T) {
  type Key = DialogKey<T>;

  const activeDialog = useRef<Key | null>(null);

  const open = useCallback(
    <K extends Key>(...args: OpenArgs<T, K>) => {
      const [key, params] = args;

      const currentKey = activeDialog.current;

      if (currentKey && currentKey !== key) {
        config[currentKey].ref.current?.close();
      }

      const dialog = config[key].ref.current;

      if (!dialog) return;

      // The generic cast is localized inside the controller.
      // Callers remain fully type-safe.
      (dialog.open as (params: unknown) => void)(params);

      activeDialog.current = key;
    },
    [config],
  );

  const close = useCallback(() => {
    const key = activeDialog.current;

    if (!key) return;

    config[key].ref.current?.close();
    activeDialog.current = null;
  }, [config]);

  return { open, close } as const;
}
