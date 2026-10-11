'use client';

import { createContext, use } from 'react';

import type { UpdateMainInfoDialogParams } from './types';

const UpdateMainInfoDialogContext = createContext<UpdateMainInfoDialogParams | null>(null);

export function useUpdateMainInfoDialogParams() {
  const params = use(UpdateMainInfoDialogContext);
  if (!params) throw new Error('Missing UpdateMainInfoDialog context');
  return params;
}

export { UpdateMainInfoDialogContext };
