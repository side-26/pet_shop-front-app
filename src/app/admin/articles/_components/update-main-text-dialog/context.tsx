'use client';

import { createContext, use } from 'react';

import type { UpdateMainTextDialogParams } from './types';

const UpdateMainTextDialogContext = createContext<UpdateMainTextDialogParams | null>(null);

export function useUpdateMainTextDialogParams() {
  const params = use(UpdateMainTextDialogContext);
  if (!params) throw new Error('Missing UpdateMainTextDialog context');
  return params;
}

export { UpdateMainTextDialogContext };
