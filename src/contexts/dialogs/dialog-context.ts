'use client';

import { createContext, use, type ReactNode } from 'react';

export function createDialogContext<TParams>() {
  const Context = createContext<TParams | null>(null);

  function useDialogParams(): TParams {
    const params = use(Context);

    if (params === null) {
      throw new Error('Dialog context must be used inside its provider');
    }

    return params;
  }

  return {
    Context,
    useDialogParams,
  } as const;
}
