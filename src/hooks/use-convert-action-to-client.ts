'use client';
import { useTransition, use } from 'react';

export const useConvertActionToQueryFn = async <TData>(
  serverAction: () => Promise<TData>,
): (() => Promise<TData>) => {
  const request = serverAction();

  return request;
};
