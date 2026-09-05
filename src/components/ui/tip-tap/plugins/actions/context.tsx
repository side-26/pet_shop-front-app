'use client';

import type { Editor } from '@tiptap/core';
import { createContext, useContext } from 'react';

type TipTapActionColor = 'primary' | 'secondary' | 'error' | 'success';
type TipTapActionVariant = 'fill' | 'tonal' | 'outlined';

type TipTapActionsContextValue = {
  color: TipTapActionColor;
  editable: boolean;
  editor: Editor | null;
  variant: TipTapActionVariant;
};

const TipTapActionsContext = createContext<TipTapActionsContextValue | null>(null);

function useTipTapActionsContext() {
  const context = useContext(TipTapActionsContext);

  if (!context) {
    throw new Error(
      'TipTap header actions must be rendered through the TipTap headerActions prop.',
    );
  }

  return context;
}

export {
  TipTapActionsContext,
  useTipTapActionsContext,
  type TipTapActionColor,
  type TipTapActionsContextValue,
  type TipTapActionVariant,
};
