'use client';

import { createContext, use } from 'react';

import type { UpdateTagsDialogParams } from './types';

const UpdateTagsDialogContext = createContext<UpdateTagsDialogParams | null>(null);

function useUpdateTagsDialogParams() {
  const params = use(UpdateTagsDialogContext);
  if (!params) throw new Error('Missing UpdateTagsDialog context');
  return params;
}

export { UpdateTagsDialogContext, useUpdateTagsDialogParams };
