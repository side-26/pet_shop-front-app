'use client';

import { createContext, useContext } from 'react';

import type { Map as NeshanMapInstance } from '@neshan-maps-platform/maplibre-sdk';

export type NeshanMapContextValue = Readonly<{ map: NeshanMapInstance | null }>;

const NeshanMapContext = createContext<NeshanMapContextValue>({ map: null });

export const NeshanMapContextProvider = NeshanMapContext.Provider;

export function useNeshanMapContext() {
  return useContext(NeshanMapContext);
}
