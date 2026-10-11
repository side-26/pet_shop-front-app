'use client';
import { useCallback } from 'react';

export function useConvertActionToQueryFn<TData>(
  action: () => Promise<TData>,
): () => Promise<TData> {
  return useCallback(() => action(), [action]);
}
